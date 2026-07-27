"""Keep frontend/src/lib/schools.ts entries stocked with a header image URL.

Unlike sync_school_meta.py (which asks Claude to *generate* plausible metadata),
image URLs must point at something real — so this hits Wikipedia's REST API by
school name and pulls the article's lead image (usually the main campus building),
served under a Wikimedia Commons license. No API key required.

Idempotent: only fills in schools whose schools.ts entry has no `image` field yet,
so reruns after adding new schools only fetch what's missing.

Run standalone:
    python3 src/fetch_school_images.py

Or import fetch_school_images() and call it from another script (e.g. at the end
of a pipeline run, alongside sync_school_meta()).
"""

from __future__ import annotations

import os
import re
import time
import urllib.parse

import requests

from scrape_and_summarize_all import SCHOOLS

SCHOOLS_TS_PATH = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "lib", "schools.ts")
)

USER_AGENT = "UnfilteredU-ImageFetcher/1.0 (https://unfilteredu.co)"
REQUEST_DELAY_SECONDS = 0.3

# Wikipedia's imageinfo API returns titles as space-separated ("Baltimore City
# Hall 2.jpg"), not underscore-joined — keywords here must match that form
# (matching happens against a lowercased, underscore-normalized-to-space title;
# see _normalize_title_words()).
#
# Infobox lead images are almost always the school seal/crest, not a campus photo.
# Filter those out by filename when picking from an article's embedded images.
_EXCLUDE_KEYWORDS = [
    "seal", "logo", "crest", "coat of arms", "coatofarms", "medallion",
    "wordmark", "monogram", "emblem", "flag", "locator", "location map",
    "map of", "commons-logo", "wiki", "icon", "symbol", "banner",
    # award-ceremony / notable-alumni captions that can still contain a
    # building keyword (e.g. "...MVP trophy at Aloha Stadium...")
    "trophy", "mvp", "pro bowl", "award", "ceremony", "portrait", "headshot",
    "official photo", "press conference", "ribbon", "signing", "commencement",
    "parade",
    # A city's own municipal landmarks get mentioned/pictured in the Wikipedia
    # articles of nearby small schools (accreditation, local-government
    # context) — never the actual answer to "picture of this school."
    "city hall",
    # A single generic Morrill Act / land-grant-history illustration (US
    # Capitol) is reused verbatim across dozens of land-grant universities'
    # articles — never a photo of any specific campus.
    "land grant", "uscapitol", "us capitol",
    # A statue/monument of a notable person is a person-focused image, not
    # architecture — same reasoning as excluding portraits.
    "statue", "monument",
]

# University Wikipedia articles are full of "Notable alumni" portrait photos,
# headshots of trustees/donors, sports action shots, and unrelated historical
# images (documents, manuscripts, band photos tied to something mentioned in
# the article). Filename-based exclusion alone doesn't catch these reliably
# (they don't say "seal" or "logo") — so instead of blocklisting, we require
# an explicit building/campus keyword allowlist match. This trades recall
# (some real campus photos with unpredictable filenames get missed) for
# precision (no risk of an alumnus's headshot ending up as a school's photo).
_REQUIRE_KEYWORDS = [
    "hall", "building", "library", "tower", "campus", "quad", "stadium",
    "arena", "union", "center", "centre", "house", "field", "museum",
    "observatory", "chapel", "memorial", "gate", "bridge", "plaza",
    "courtyard", "court", "dormitory", "dorm", "residence", "academic", "admin",
    "aerial", "panorama", "skyline", "station", "hub", "lawn", "green",
    "walk", "college", "university", "school of",
]

_MIN_WIDTH = 400
_MIN_HEIGHT = 300
# Portraits/headshots tend to be roughly square or taller than wide; genuine
# campus photography is almost always a wide landscape shot.
_MIN_ASPECT_RATIO = 1.2


def _has_image(ts_content: str, slug: str) -> bool:
    esc_slug = re.escape(slug)
    pattern = re.compile(
        rf'slug:\s*"{esc_slug}",\n\s*name:\s*"[^"]*",\n\s*location:\s*"[^"]*",\n\s*image:'
    )
    return bool(pattern.search(ts_content))


def _insert_image(ts_content: str, slug: str, url: str) -> str:
    esc_slug = re.escape(slug)
    pattern = re.compile(
        rf'(slug:\s*"{esc_slug}",\n\s*name:\s*"[^"]*",\n\s*location:\s*"[^"]*",\n)'
    )
    esc_url = url.replace("\\", "\\\\").replace('"', '\\"')
    return pattern.sub(rf'\1    image: "{esc_url}",\n', ts_content, count=1)


def _wiki_summary(title: str) -> dict | None:
    encoded = urllib.parse.quote(title.replace(" ", "_"))
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}"
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
    except requests.RequestException:
        return None
    if resp.status_code != 200:
        return None
    return resp.json()


def _wiki_search_title(query: str) -> str | None:
    try:
        resp = requests.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "query",
                "list": "search",
                "srsearch": query,
                "format": "json",
                "srlimit": 1,
            },
            headers={"User-Agent": USER_AGENT},
            timeout=10,
        )
    except requests.RequestException:
        return None
    if resp.status_code != 200:
        return None
    results = resp.json().get("query", {}).get("search", [])
    return results[0]["title"] if results else None


def _page_images(title: str) -> list[dict]:
    """All images embedded in a Wikipedia article, with size/mime info."""
    try:
        resp = requests.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "query",
                "titles": title,
                "generator": "images",
                "gimlimit": 40,
                "prop": "imageinfo",
                "iiprop": "url|size|mime",
                "format": "json",
            },
            headers={"User-Agent": USER_AGENT},
            timeout=10,
        )
    except requests.RequestException:
        return []
    if resp.status_code != 200:
        return []
    pages = resp.json().get("query", {}).get("pages", {})
    images = []
    for page in pages.values():
        info = (page.get("imageinfo") or [None])[0]
        if not info or not info.get("url"):
            continue
        images.append(
            {
                "title": page.get("title", ""),
                "url": info["url"],
                "width": info.get("width", 0),
                "height": info.get("height", 0),
                "mime": info.get("mime", ""),
            }
        )
    return images


_NAME_STOPWORDS = {
    "university", "of", "the", "at", "state", "college", "and", "a", "an",
    "saint", "st", "institute", "technology", "in",
}


def _name_tokens(*texts: str) -> set[str]:
    tokens: set[str] = set()
    for text in texts:
        tokens |= set(re.findall(r"[a-z]+", text.lower()))
    return tokens - _NAME_STOPWORDS


def _pick_campus_photo(images: list[dict], name_tokens: set[str]) -> str | None:
    """Prefer a real (JPEG), landscape-oriented photo whose filename names an
    actual building/campus feature — Wikipedia university articles are full of
    "Notable alumni" headshots, trustee portraits, and unrelated event photos
    that a blocklist alone won't catch, so this requires a positive signal
    instead. Among qualifying photos, one whose filename mentions the school's
    own name/city wins over a wider one that doesn't — otherwise a big photo of
    a *different*, larger nearby school's landmark (that just happens to also
    satisfy the building-keyword check, e.g. a shared metro area's landmark
    mentioned in passing) can out-rank the smaller photo that's actually of
    this school."""
    candidates = []
    for img in images:
        if img["mime"] != "image/jpeg":
            continue
        width, height = img["width"], img["height"]
        if width < _MIN_WIDTH or height < _MIN_HEIGHT:
            continue
        if height == 0 or width / height < _MIN_ASPECT_RATIO:
            continue
        title_lower = img["title"].lower().replace("_", " ")
        if any(kw in title_lower for kw in _EXCLUDE_KEYWORDS):
            continue
        if not any(kw in title_lower for kw in _REQUIRE_KEYWORDS):
            continue
        candidates.append(img)

    if not candidates:
        return None

    def sort_key(img: dict) -> tuple[bool, float, int]:
        title_tokens = set(re.findall(r"[a-z]+", img["title"].lower()))
        matched = title_tokens & name_tokens
        # A title that's *mostly* the school's own name (e.g. "Campus Marshall
        # University (WV).JPG") ranks above one that merely mentions the school
        # in passing while describing something else (e.g. a caption comparing
        # another building's architecture to "...-Harvard.jpg") — raw presence
        # of the token isn't enough, since both technically "match."
        relevance = len(matched) / len(title_tokens) if title_tokens else 0.0
        return (bool(matched), relevance, img["width"])

    candidates.sort(key=sort_key, reverse=True)
    return candidates[0]["url"]


def _is_university_page(data: dict | None) -> bool:
    """Short school names collide with unrelated Wikipedia articles that resolve
    confidently (not flagged as disambiguation) rather than 404ing — "Kansas" ->
    the US state, "Louisville" -> the city, "Delaware"/"Louisiana" -> the states,
    "Pitt" -> Brad Pitt. `type == "disambiguation"` alone misses these, so verify
    via the page's own description/title instead of trusting a confident match."""
    if not data or data.get("type") == "disambiguation":
        return False
    title = (data.get("title") or "").lower()
    desc = (data.get("description") or "").lower()
    signals = ("university", "college", "academy", "institute of technology")
    return any(sig in s for s in (title, desc) for sig in signals)


def _resolve_university_summary(school_name: str) -> dict | None:
    data = _wiki_summary(school_name)
    if _is_university_page(data):
        return data

    fallback_title = _wiki_search_title(f"{school_name} university")
    if fallback_title:
        data = _wiki_summary(fallback_title)
        if _is_university_page(data):
            return data

    return None


def fetch_image_url(school_name: str, location: str = "") -> str | None:
    """Look up a real campus photo from the school's Wikipedia article. Refuses to
    fall back to the infobox image of a page that isn't confirmed to actually be
    about a university — better to fetch nothing than the wrong school's photo."""
    data = _resolve_university_summary(school_name)
    if not data:
        return None

    canonical_title = data.get("title", school_name)
    city = location.split(",")[0] if location else ""
    name_tokens = _name_tokens(school_name, city)
    photo = _pick_campus_photo(_page_images(canonical_title), name_tokens)
    if photo:
        return photo

    image = data.get("originalimage") or data.get("thumbnail")
    return image["source"] if image else None


# Schools whose SCHOOLS `name` is too generic to disambiguate even with the
# "+university" search retry (usually because it collides with a US state or
# region name). Keyed by slug -> the real Wikipedia article title to use.
_TITLE_OVERRIDES = {
    "louisiana": "University of Louisiana at Lafayette",
    # Search-fallback resolved this to Saint Peter's University (NJ) instead —
    # this school is the Minnesota one (r/uofstthomas, r/StThomasMN).
    "stthomas": "University of St. Thomas (Minnesota)",
}


def fetch_school_images() -> list[str]:
    """Fill in schools.ts `image` fields for any school missing one. Returns slugs added."""
    with open(SCHOOLS_TS_PATH, encoding="utf-8") as f:
        ts_content = f.read()

    # SCHOOLS can contain accidental duplicate slugs (e.g. a school added twice
    # in the pipeline list) — dedupe so a repeated slug doesn't get `image:`
    # inserted twice into its single schools.ts entry.
    seen_slugs: set[str] = set()
    missing = []
    for s in SCHOOLS:
        if s["slug"] in seen_slugs or _has_image(ts_content, s["slug"]):
            continue
        seen_slugs.add(s["slug"])
        missing.append(s)

    if not missing:
        print("All schools already have an image in schools.ts.")
        return []

    print(f"Fetching images for {len(missing)} school(s)...")
    added: list[str] = []
    failed: list[str] = []

    for school in missing:
        title = _TITLE_OVERRIDES.get(school["slug"], school["name"])
        image_url = fetch_image_url(title, school.get("location", ""))
        if image_url:
            ts_content = _insert_image(ts_content, school["slug"], image_url)
            added.append(school["slug"])
            print(f"  ✓ {school['name']}")
        else:
            failed.append(school["slug"])
            print(f"  ✗ {school['name']} — no image found")
        time.sleep(REQUEST_DELAY_SECONDS)

    with open(SCHOOLS_TS_PATH, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Added images for {len(added)} school(s).")
    if failed:
        print(f"No image found for {len(failed)}: {', '.join(failed)}")
    return added


if __name__ == "__main__":
    fetch_school_images()
