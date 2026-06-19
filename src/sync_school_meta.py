"""Keep frontend/src/lib/schools.ts in sync with the SCHOOLS list in scrape_and_summarize_all.py.

schools.ts holds hand-curated display metadata (brand colors, radio station, location,
fun-fact stats) that can't be derived from scraped Reddit/YouTube data. Whenever a school
is added to the pipeline's SCHOOLS list but has no entry in schools.ts, its page 404s at
runtime even though the data exists. This script finds those gaps, asks Claude to research
plausible real-world metadata in the same shape/style as the existing entries, and appends
the result to the TS file.

Run standalone:
    python3 src/sync_school_meta.py

Or import sync_school_meta() and call it from another script (e.g. at the end of a pipeline run).
"""

from __future__ import annotations

import json
import os
import re

import anthropic
from dotenv import load_dotenv

from scrape_and_summarize_all import SCHOOLS

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
MODEL = "claude-sonnet-4-6"

SCHOOLS_TS_PATH = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "lib", "schools.ts")
)

STYLE_EXAMPLES = """\
  {
    slug: "unc",
    name: "UNC Chapel Hill",
    location: "Chapel Hill, NC",
    colors: { primary: "#4B9CD3", secondary: "#13294B" },
    radioStation: "WXYC 89.3 FM",
    stats: [
      { icon: "📋", label: "84K+ Applicants" },
      { icon: "🏠", label: "Competitive Housing" },
      { icon: "🐏", label: "Strong School Spirit" },
    ],
  },
  {
    slug: "stanford",
    name: "Stanford University",
    location: "Palo Alto, CA",
    colors: { primary: "#8C1515", secondary: "#4D4F53" },
    radioStation: "KZSU 90.1 FM",
    stats: [
      { icon: "📋", label: "57K+ Applicants" },
      { icon: "💡", label: "Silicon Valley Access" },
      { icon: "🌲", label: "Beautiful Campus" },
    ],
  },"""

OUTPUT_SCHEMA = """\
Return ONLY a valid JSON array (no markdown, no explanation) with one object per school, \
in the same order given, matching this exact shape:
[
  {
    "slug": "exampleslug",
    "name": "Example University",
    "location": "City, ST",
    "colors": {"primary": "#RRGGBB", "secondary": "#RRGGBB"},
    "radioStation": "Call letters + frequency, or \\"Name — online\\" if no FM station",
    "stats": [
      {"icon": "📋", "label": "NNK+ Applicants"},
      {"icon": "<emoji>", "label": "<short fact, max ~5 words>"},
      {"icon": "<emoji>", "label": "<short fact, max ~5 words>"}
    ]
  }
]
Rules:
- "colors" should be the school's real official brand colors (hex) where known.
- "radioStation" should be the school's real campus radio station (call letters + frequency) \
if one exists; otherwise use "<Mascot/Name> Radio — online".
- The first stat is always an applicant-count estimate with icon "📋".
- The other two stats should be genuinely distinguishing facts (mascot/spirit, academic \
strength, location/culture), each with a fitting emoji."""


def _existing_slugs(ts_content: str) -> set[str]:
    return set(re.findall(r'slug:\s*"([^"]+)"', ts_content))


def _strip_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        if len(parts) >= 3:
            inner = parts[1]
            if inner.startswith("json"):
                inner = inner[4:]
            return inner.strip()
    return text


def _esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def _render_entry(meta: dict) -> str:
    colors = meta["colors"]
    stats_lines = "\n".join(
        f'      {{ icon: "{_esc(s["icon"])}", label: "{_esc(s["label"])}" }},'
        for s in meta["stats"]
    )
    return (
        "  {\n"
        f'    slug: "{_esc(meta["slug"])}",\n'
        f'    name: "{_esc(meta["name"])}",\n'
        f'    location: "{_esc(meta["location"])}",\n'
        f'    colors: {{ primary: "{colors["primary"]}", secondary: "{colors["secondary"]}" }},\n'
        f'    radioStation: "{_esc(meta["radioStation"])}",\n'
        "    stats: [\n"
        f"{stats_lines}\n"
        "    ],\n"
        "  },"
    )


def _generate_meta(missing: list[dict]) -> list[dict]:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    school_list = "\n".join(f'- slug: "{s["slug"]}", name: "{s["name"]}"' for s in missing)

    user_content = (
        "Here are two existing examples of the metadata style used on a university "
        "review site:\n\n"
        f"{STYLE_EXAMPLES}\n\n"
        f"Now generate the same kind of entry for these {len(missing)} schools:\n"
        f"{school_list}\n\n"
        f"{OUTPUT_SCHEMA}"
    )

    response = client.messages.create(
        model=MODEL,
        max_tokens=8192,
        messages=[{"role": "user", "content": user_content}],
    )

    raw = _strip_fences(response.content[0].text)
    return json.loads(raw)


def sync_school_meta() -> list[str]:
    """Append schools.ts entries for any pipeline school missing one. Returns slugs added."""
    if not ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY not found in .env")

    with open(SCHOOLS_TS_PATH, encoding="utf-8") as f:
        ts_content = f.read()

    existing = _existing_slugs(ts_content)
    missing = [s for s in SCHOOLS if s["slug"] not in existing]

    if not missing:
        print("schools.ts is already in sync with the pipeline's SCHOOLS list.")
        return []

    print(f"Found {len(missing)} school(s) missing from schools.ts: "
          f"{', '.join(s['slug'] for s in missing)}")
    print("Generating metadata with Claude...")

    generated = _generate_meta(missing)

    generated_by_slug = {g["slug"]: g for g in generated}
    new_entries = []
    for school in missing:
        meta = generated_by_slug.get(school["slug"])
        if not meta:
            print(f"  Warning: no metadata returned for {school['slug']}, skipping")
            continue
        new_entries.append(_render_entry(meta))

    if not new_entries:
        return []

    insertion = "\n" + "\n".join(new_entries)
    updated_content = re.sub(r"\n\];", insertion + "\n];", ts_content, count=1)

    with open(SCHOOLS_TS_PATH, "w", encoding="utf-8") as f:
        f.write(updated_content)

    added_slugs = [school["slug"] for school in missing if school["slug"] in generated_by_slug]
    print(f"Added {len(added_slugs)} entries to {SCHOOLS_TS_PATH}")
    return added_slugs


if __name__ == "__main__":
    sync_school_meta()
