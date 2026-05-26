import json
import os
import re
import time
from urllib.parse import quote_plus

import anthropic
import requests
from dotenv import load_dotenv

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_TOKEN not found in .env")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not found in .env")

ACTOR_ID = "trudax~reddit-scraper-lite"
BASE_URL = "https://api.apify.com/v2"
MODEL = "claude-sonnet-4-6"

SCHOOLS = [
    {"name": "Duke University", "slug": "duke", "subreddits": ["r/duke", "r/DukeUniversity"], "keywords": ["Duke University", "Duke Blue Devils", "Durham NC"]},
    {"name": "NC State", "slug": "ncstate", "subreddits": ["r/NCState"], "keywords": ["NC State", "North Carolina State", "Wolfpack", "Raleigh NC"]},
    {"name": "Georgia Tech", "slug": "georgiatech", "subreddits": ["r/gatech"], "keywords": ["Georgia Tech", "GT", "Yellow Jackets", "Atlanta"]},
    {"name": "University of Virginia", "slug": "uva", "subreddits": ["r/uva"], "keywords": ["UVA", "University of Virginia", "Cavaliers", "Charlottesville"]},
    {"name": "Virginia Tech", "slug": "virginiatech", "subreddits": ["r/VirginiaTech"], "keywords": ["Virginia Tech", "Hokies", "Blacksburg"]},
    {"name": "Florida State", "slug": "fsu", "subreddits": ["r/FloridaState"], "keywords": ["Florida State", "FSU", "Seminoles", "Tallahassee"]},
    {"name": "University of Miami", "slug": "miami", "subreddits": ["r/umiami"], "keywords": ["University of Miami", "UM", "Hurricanes", "Coral Gables"]},
    {"name": "Clemson", "slug": "clemson", "subreddits": ["r/Clemson"], "keywords": ["Clemson", "Tigers", "Clemson SC"]},
    {"name": "Wake Forest", "slug": "wakeforest", "subreddits": ["r/wakeforest"], "keywords": ["Wake Forest", "Demon Deacons", "Winston-Salem"]},
    {"name": "Boston College", "slug": "bc", "subreddits": ["r/bostoncollege"], "keywords": ["Boston College", "BC Eagles", "Chestnut Hill"]},
    {"name": "Syracuse", "slug": "syracuse", "subreddits": ["r/Syracuse", "r/SyracuseU"], "keywords": ["Syracuse University", "Orange", "Syracuse NY"]},
    {"name": "Pitt", "slug": "pitt", "subreddits": ["r/Pitt"], "keywords": ["University of Pittsburgh", "Pitt", "Panthers", "Pittsburgh"]},
    {"name": "Louisville", "slug": "louisville", "subreddits": ["r/uofl"], "keywords": ["University of Louisville", "UofL", "Cardinals", "Louisville KY"]},
    {"name": "Notre Dame", "slug": "notredame", "subreddits": ["r/notredame"], "keywords": ["Notre Dame", "Fighting Irish", "South Bend"]},
    {"name": "UC Berkeley", "slug": "ucberkeley", "subreddits": ["r/berkeley", "r/UCBerkeley"], "keywords": ["UC Berkeley", "University of California Berkeley", "Cal Bears", "Berkeley CA"]},
    {"name": "Southern Methodist University", "slug": "smu", "subreddits": ["r/SMU"], "keywords": ["SMU", "Southern Methodist University", "Mustangs", "Dallas TX"]},
    {"name": "Stanford", "slug": "stanford", "subreddits": ["r/Stanford"], "keywords": ["Stanford University", "Cardinal", "Palo Alto", "Stanford CA"]},
    {"name": "Howard University", "slug": "howard", "subreddits": ["r/HowardUniversity", "r/HBCU"], "keywords": ["Howard University", "Bison", "Washington DC", "HBCU", "Howard HBCU"]},
]

CATEGORIES = [
    "housing", "social_life", "dining", "mental_health",
    "financial_aid", "academics", "overall_vibe", "red_flags", "hidden_gems",
]

SYSTEM_PROMPT = (
    "You are analyzing real student opinions from Reddit about a university. "
    "Extract honest insights students and parents would want to know but wouldn't "
    "find on an official campus tour. Be specific and direct."
)

OUTPUT_SCHEMA = """\
Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "housing": {"summary": "2-3 sentence summary", "key_quotes": ["quote1", "quote2", "quote3"]},
  "social_life": {"summary": "...", "key_quotes": [...]},
  "dining": {"summary": "...", "key_quotes": [...]},
  "mental_health": {"summary": "...", "key_quotes": [...]},
  "financial_aid": {"summary": "...", "key_quotes": [...]},
  "academics": {"summary": "...", "key_quotes": [...]},
  "overall_vibe": {"summary": "...", "key_quotes": [...]},
  "red_flags": {"summary": "...", "key_quotes": [...]},
  "hidden_gems": {"summary": "...", "key_quotes": [...]}
}
Each category must have a "summary" (2-3 sentences) and "key_quotes" (2-3 short direct quotes from the data)."""


# ── Apify helpers ──────────────────────────────────────────────────────────────

def build_start_urls(school: dict) -> list[dict]:
    urls = []
    for sub in school["subreddits"]:
        sub_name = sub[2:] if sub.startswith("r/") else sub
        urls.append({"url": f"https://www.reddit.com/r/{sub_name}/"})
    cross_subs = ["ApplyingToCollege", "college"]
    for keyword in school["keywords"]:
        encoded = quote_plus(keyword)
        for cross_sub in cross_subs:
            urls.append({
                "url": f"https://www.reddit.com/r/{cross_sub}/search?q={encoded}&sort=top&restrict_sr=1"
            })
    return urls


def get_own_subreddit_names(school: dict) -> set[str]:
    result = set()
    for sub in school["subreddits"]:
        name = sub[2:] if sub.startswith("r/") else sub
        result.add(name.lower())
    return result


def build_relevance_pattern(school: dict) -> re.Pattern:
    pattern = "|".join(re.escape(k) for k in school["keywords"])
    return re.compile(pattern, re.IGNORECASE)


def run_actor(start_urls: list[dict]) -> dict:
    actor_input = {
        "startUrls": start_urls,
        "sort": "top",
        "maxItems": 1000,
        "maxPostCount": 100,
        "maxComments": 10,
        "proxy": {"useApifyProxy": True},
    }
    resp = requests.post(
        f"{BASE_URL}/acts/{ACTOR_ID}/runs",
        params={"token": APIFY_TOKEN},
        json=actor_input,
    )
    resp.raise_for_status()
    run = resp.json()["data"]
    print(f"  Apify run started: {run['id']}")
    return run


def wait_for_run(run_id: str) -> dict:
    url = f"{BASE_URL}/actor-runs/{run_id}"
    while True:
        resp = requests.get(url, params={"token": APIFY_TOKEN})
        resp.raise_for_status()
        run = resp.json()["data"]
        status = run["status"]
        print(f"  status: {status}")
        if status in ("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"):
            return run
        time.sleep(10)


def fetch_dataset(dataset_id: str) -> list:
    resp = requests.get(
        f"{BASE_URL}/datasets/{dataset_id}/items",
        params={"token": APIFY_TOKEN, "format": "json", "clean": "true", "limit": 2000},
    )
    resp.raise_for_status()
    return resp.json()


def build_posts(items: list) -> list:
    posts = {}
    comments = []
    for item in items:
        dtype = item.get("dataType", "")
        if dtype == "post":
            post_id = item.get("id", "")
            if post_id in posts:
                continue
            posts[post_id] = {
                "id": post_id,
                "subreddit": item.get("communityName", ""),
                "title": item.get("title", ""),
                "body": item.get("body", ""),
                "url": item.get("url", ""),
                "upvotes": item.get("upVotes", 0),
                "date": item.get("createdAt", ""),
                "author": item.get("username", ""),
                "top_comments": [],
            }
        elif dtype == "comment":
            comments.append(item)
    for c in comments:
        parent_id = c.get("postId") or c.get("parentId", "")
        if parent_id in posts:
            posts[parent_id]["top_comments"].append({
                "text": c.get("body", ""),
                "upvotes": c.get("upVotes", 0),
                "author": c.get("username", ""),
                "date": c.get("createdAt", ""),
            })
    for post in posts.values():
        post["top_comments"].sort(key=lambda c: c["upvotes"], reverse=True)
        post["top_comments"] = post["top_comments"][:10]
    return list(posts.values())


def is_relevant(post: dict, own_subs: set[str], pattern: re.Pattern) -> bool:
    raw = (post.get("subreddit") or "").lower()
    sub_name = raw[2:] if raw.startswith("r/") else raw
    if sub_name in own_subs:
        return True
    text = f"{post.get('title', '')} {post.get('body', '')}"
    return bool(pattern.search(text))


# ── Scrape ─────────────────────────────────────────────────────────────────────

def scrape_school(school: dict, data_dir: str) -> str:
    slug = school["slug"]
    out_path = os.path.join(data_dir, f"{slug}_raw.json")

    if os.path.exists(out_path):
        print(f"  [SKIP scrape] {slug}_raw.json already exists")
        return out_path

    start_urls = build_start_urls(school)
    own_subs = get_own_subreddit_names(school)
    pattern = build_relevance_pattern(school)

    print(f"  Scraping {len(start_urls)} URLs...")
    run = run_actor(start_urls)
    print("  Waiting for Apify run...")
    run = wait_for_run(run["id"])

    if run["status"] != "SUCCEEDED":
        raise RuntimeError(f"Actor run failed with status: {run['status']}")

    items = fetch_dataset(run["defaultDatasetId"])
    all_posts = build_posts(items)
    relevant = [p for p in all_posts if is_relevant(p, own_subs, pattern)]

    print(f"  {len(all_posts)} posts collected, {len(relevant)} kept after relevance filter")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(relevant, f, indent=2, ensure_ascii=False)

    print(f"  Saved → {out_path}")
    return out_path


# ── Summarize ──────────────────────────────────────────────────────────────────

def format_posts(posts: list) -> str:
    lines = []
    for i, post in enumerate(posts, 1):
        title = (post.get("title") or "").strip()
        body = (post.get("body") or "").strip()[:500]
        subreddit = post.get("subreddit", "")
        upvotes = post.get("upvotes", 0)
        lines.append(f"--- POST {i} [{subreddit}] ({upvotes} upvotes) ---")
        lines.append(f"Title: {title}")
        if body:
            lines.append(f"Body: {body}")
        for c in (post.get("top_comments") or [])[:5]:
            text = (c.get("text") or "").strip()[:200]
            if text:
                lines.append(f"  - {text}")
        lines.append("")
    return "\n".join(lines)


def strip_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        if len(parts) >= 3:
            inner = parts[1]
            if inner.startswith("json"):
                inner = inner[4:]
            return inner.strip()
    return text


def summarize_school(school: dict, raw_path: str, data_dir: str) -> str:
    slug = school["slug"]
    out_path = os.path.join(data_dir, f"{slug}_summary.json")

    if os.path.exists(out_path):
        print(f"  [SKIP summarize] {slug}_summary.json already exists")
        return out_path

    with open(raw_path, encoding="utf-8") as f:
        posts = json.load(f)

    print(f"  Summarizing {len(posts)} posts with Claude ({MODEL})...")

    subreddit_list = ", ".join(school["subreddits"] + ["r/ApplyingToCollege", "r/college"])
    user_content = (
        f"Here are {len(posts)} Reddit posts about {school['name']} "
        f"from {subreddit_list}.\n\n"
        f"{format_posts(posts)}\n\n"
        f"{OUTPUT_SCHEMA}"
    )

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=[{"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}],
        messages=[{
            "role": "user",
            "content": [{"type": "text", "text": user_content, "cache_control": {"type": "ephemeral"}}],
        }],
    )

    raw = strip_fences(response.content[0].text)
    summary = json.loads(raw)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"  Saved → {out_path}")

    usage = response.usage
    cache_written = getattr(usage, "cache_creation_input_tokens", 0)
    cache_read = getattr(usage, "cache_read_input_tokens", 0)
    if cache_written or cache_read:
        print(f"  Cache: {cache_written} tokens written, {cache_read} tokens read")

    return out_path


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    data_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data"))
    os.makedirs(data_dir, exist_ok=True)

    total = len(SCHOOLS)
    failed = []

    for i, school in enumerate(SCHOOLS, 1):
        print(f"\n{'=' * 60}")
        print(f"[{i}/{total}]  {school['name']}  ({school['slug']})")
        print("=" * 60)

        try:
            raw_path = scrape_school(school, data_dir)
        except Exception as e:
            print(f"  ERROR scraping: {e}")
            failed.append((school["slug"], "scrape", str(e)))
            continue

        try:
            summarize_school(school, raw_path, data_dir)
        except Exception as e:
            print(f"  ERROR summarizing: {e}")
            failed.append((school["slug"], "summarize", str(e)))
            continue

        if i < total:
            print("\n  Waiting 5 seconds...")
            time.sleep(5)

    print(f"\n{'=' * 60}")
    print(f"Done. {total - len(failed)}/{total} schools completed successfully.")
    if failed:
        print("\nFailed:")
        for slug, stage, err in failed:
            print(f"  {slug} ({stage}): {err}")


if __name__ == "__main__":
    main()
