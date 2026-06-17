import argparse
import json
import os
import re
import time

import anthropic
from dotenv import load_dotenv

from scrape_reddit_direct import scrape_school_direct
from scrape_youtube import scrape_youtube

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not found in .env")

MODEL = "claude-sonnet-4-6"

# Pricing per token (Claude Sonnet 4.6)
_INPUT_PRICE = 3.0 / 1_000_000
_OUTPUT_PRICE = 15.0 / 1_000_000
_CACHE_WRITE_PRICE = 3.75 / 1_000_000
_CACHE_READ_PRICE = 0.30 / 1_000_000

SCHOOLS = [
    {"name": "University of Kansas", "slug": "kansas", "subreddits": ["r/KUHawks", "r/jayhawks"], "keywords": ["University of Kansas", "KU Jayhawks", "Lawrence Kansas", "KU campus"]},
    {"name": "University of North Carolina at Chapel Hill", "slug": "unc", "subreddits": ["r/UNC", "r/chapelhill"], "keywords": ["University of North Carolina", "UNC Chapel Hill", "Tar Heels", "Chapel Hill NC"]},
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
    {"name": "University of Alabama", "slug": "alabama", "subreddits": ["r/uAlabama"], "keywords": ["University of Alabama", "Alabama Crimson Tide", "Tuscaloosa", "UA campus"]},
    {"name": "Auburn University", "slug": "auburn", "subreddits": ["r/auburn"], "keywords": ["Auburn University", "War Eagle", "Auburn Alabama", "Auburn campus"]},
    {"name": "University of Florida", "slug": "florida", "subreddits": ["r/ufl", "r/gainesville"], "keywords": ["University of Florida", "UF", "Gators", "Gainesville"]},
    {"name": "University of Georgia", "slug": "uga", "subreddits": ["r/UGA"], "keywords": ["University of Georgia", "UGA", "Bulldogs", "Athens Georgia"]},
    {"name": "University of Tennessee", "slug": "tennessee", "subreddits": ["r/UTK"], "keywords": ["University of Tennessee", "UTK", "Volunteers", "Knoxville"]},
    {"name": "University of Kentucky", "slug": "kentucky", "subreddits": ["r/uky"], "keywords": ["University of Kentucky", "UK", "Wildcats", "Lexington Kentucky"]},
    {"name": "University of South Carolina", "slug": "southcarolina", "subreddits": ["r/uofsc"], "keywords": ["University of South Carolina", "Gamecocks", "Columbia SC"]},
    {"name": "University of Southern California", "slug": "usc", "subreddits": ["r/USC"], "keywords": ["University of Southern California", "USC Trojans", "Trojans", "USC Los Angeles"]},
    {"name": "Louisiana State University", "slug": "lsu", "subreddits": ["r/LSU"], "keywords": ["LSU", "Louisiana State", "Tigers", "Baton Rouge"]},
    {"name": "Ole Miss", "slug": "olemiss", "subreddits": ["r/OleMiss"], "keywords": ["Ole Miss", "University of Mississippi", "Rebels", "Oxford Mississippi"]},
    {"name": "Mississippi State", "slug": "msstate", "subreddits": ["r/msstate"], "keywords": ["Mississippi State", "Bulldogs", "Starkville", "MSU Mississippi"]},
    {"name": "University of Arkansas", "slug": "arkansas", "subreddits": ["r/uofarkansas"], "keywords": ["University of Arkansas", "Razorbacks", "Fayetteville Arkansas"]},
    {"name": "Texas A&M", "slug": "tamu", "subreddits": ["r/aggies"], "keywords": ["Texas A&M", "Aggies", "College Station", "TAMU"]},
    {"name": "University of Texas", "slug": "texas", "subreddits": ["r/UTAustin"], "keywords": ["University of Texas", "UT Austin", "Longhorns", "Austin Texas"]},
    {"name": "Vanderbilt University", "slug": "vanderbilt", "subreddits": ["r/vanderbilt"], "keywords": ["Vanderbilt", "Commodores", "Nashville Tennessee"]},
    {"name": "Missouri University", "slug": "missouri", "subreddits": ["r/mizzou"], "keywords": ["University of Missouri", "Mizzou", "Tigers", "Columbia Missouri"]},
    {"name": "Oklahoma University", "slug": "oklahoma", "subreddits": ["r/uoklahoma"], "keywords": ["University of Oklahoma", "Sooners", "Norman Oklahoma"]},
]

CATEGORIES = [
    "housing", "social_life", "dining", "mental_health",
    "financial_aid", "academics", "administration", "location_and_campus",
    "career_outcomes", "value_for_money", "overall_vibe", "red_flags", "hidden_gems",
]

SYSTEM_PROMPT = (
    "You are analyzing real student opinions from multiple sources about a university. "
    "Extract honest insights students and parents would want to know but wouldn't "
    "find on an official campus tour. Be specific and direct."
)

OUTPUT_SCHEMA = """\
Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "housing": {"key_points": ["point1", "point2", "point3"], "key_quotes": ["quote1", "quote2", "quote3"], "score": 7},
  "social_life": {"key_points": [...], "key_quotes": [...], "score": 7},
  "dining": {"key_points": [...], "key_quotes": [...], "score": 7},
  "mental_health": {"key_points": [...], "key_quotes": [...], "score": 7},
  "financial_aid": {"key_points": [...], "key_quotes": [...], "score": 7},
  "academics": {"key_points": [...], "key_quotes": [...], "score": 7},
  "administration": {"key_points": [...], "key_quotes": [...], "score": 7},
  "location_and_campus": {"key_points": [...], "key_quotes": [...], "score": 7},
  "career_outcomes": {"key_points": [...], "key_quotes": [...], "score": 7},
  "value_for_money": {"key_points": [...], "key_quotes": [...], "score": 7},
  "overall_vibe": {"key_points": [...], "key_quotes": [...], "score": 7},
  "red_flags": {"key_points": [...], "key_quotes": [...], "score": 3},
  "hidden_gems": {"key_points": [...], "key_quotes": [...], "score": 7}
}
Each category must have:
- "key_points": exactly 3 short, punchy bullet points (max 12 words each), most important insight \
first, written so someone can scan the whole page in 60 seconds
- "key_quotes": 2-3 short direct quotes from the data
- "score": an integer from 1-10:
  - 1-3 = poor, consistent complaints
  - 4-5 = mixed, notable issues
  - 6-7 = good, mostly positive
  - 8-10 = excellent, strong praise
For "red_flags", the score scale is reversed (10 = very serious concerns, 1 = minimal concerns), and each \
key_point must start with a bold category keyword and a colon, e.g. \
"Housing: students assigned to inactive dorms with no notice"."""


def format_combined(items: list) -> str:
    lines = []

    reddit_items = [i for i in items if i.get("source", "reddit") == "reddit"]
    youtube_items = [i for i in items if i.get("source") == "youtube"]

    if reddit_items:
        lines.append("=== REDDIT POSTS ===")
        for idx, post in enumerate(reddit_items, 1):
            title = (post.get("title") or "").strip()
            body = (post.get("body") or "").strip()[:500]
            subreddit = post.get("subreddit", "")
            upvotes = post.get("upvotes", 0)
            lines.append(f"--- POST {idx} [{subreddit}] ({upvotes} upvotes) ---")
            lines.append(f"Title: {title}")
            if body:
                lines.append(f"Body: {body}")
            for c in (post.get("top_comments") or [])[:5]:
                text = (c.get("text") or "").strip()[:200]
                if text:
                    lines.append(f"  - {text}")
            lines.append("")

    if youtube_items:
        lines.append("=== YOUTUBE COMMENTS ===")
        for idx, item in enumerate(youtube_items, 1):
            title = (item.get("title") or "").strip()
            body = (item.get("body") or "").strip()[:500]
            upvotes = item.get("upvotes", 0)
            lines.append(f"--- COMMENT {idx} [Video: {title}] ({upvotes} likes) ---")
            lines.append(f"Text: {body}")
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


def _summary_complete(path: str) -> bool:
    if not os.path.exists(path):
        return False
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return all(
            cat in data and isinstance(data[cat].get("score"), int)
            for cat in CATEGORIES
        )
    except Exception:
        return False


def summarize_school(school: dict, combined_path: str, data_dir: str) -> str:
    slug = school["slug"]
    out_path = os.path.join(data_dir, f"{slug}_summary.json")

    if _summary_complete(out_path):
        print(f"  [SKIP] {slug}_summary.json exists with all 13 categories")
        return out_path

    with open(combined_path, encoding="utf-8") as f:
        items = json.load(f)

    print(f"  → Summarizing combined data ({len(items)} total items)...")

    user_content = (
        f"You have two sources of real student data about {school['name']}: "
        f"Reddit posts (raw student opinions) and YouTube comments (reactions from tours and vlogs). "
        f"Synthesize both into honest, specific summaries. "
        f"Weight specific complaints and direct quotes heavily. Ignore generic praise.\n\n"
        f"{format_combined(items)}\n\n"
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

    usage = response.usage
    cost = (
        (usage.input_tokens or 0) * _INPUT_PRICE
        + (usage.output_tokens or 0) * _OUTPUT_PRICE
        + getattr(usage, "cache_creation_input_tokens", 0) * _CACHE_WRITE_PRICE
        + getattr(usage, "cache_read_input_tokens", 0) * _CACHE_READ_PRICE
    )
    print(f"  ✓ Done. Cost: ${cost:.2f}")
    return out_path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--school", help="Only process this school slug (e.g. kansas)")
    args = parser.parse_args()

    data_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "frontend", "data"))
    os.makedirs(data_dir, exist_ok=True)

    schools = SCHOOLS
    if args.school:
        schools = [s for s in SCHOOLS if s["slug"] == args.school]
        if not schools:
            print(f"Unknown school slug: {args.school}")
            print(f"Available: {', '.join(s['slug'] for s in SCHOOLS)}")
            return

    total = len(schools)
    failed = []

    for i, school in enumerate(schools, 1):
        print(f"\nProcessing {school['name']} ({i}/{total})...")

        # Source 1: Reddit
        try:
            reddit_path, reddit_count = scrape_school_direct(school, data_dir)
            print(f"  ✓ Reddit: {reddit_count} posts")
        except Exception as e:
            print(f"  ✗ Reddit failed: {e}")
            failed.append((school["slug"], "reddit", str(e)))
            continue

        # Source 2: YouTube
        try:
            youtube_path, youtube_count = scrape_youtube(school, data_dir)
            print(f"  ✓ YouTube: {youtube_count} comments")
        except Exception as e:
            print(f"  ✗ YouTube failed: {e}")
            youtube_path = None

        # Merge Reddit + YouTube into combined raw
        combined: list[dict] = []

        with open(reddit_path, encoding="utf-8") as f:
            reddit_items = json.load(f)
        for item in reddit_items:
            item.setdefault("source", "reddit")
        combined.extend(reddit_items)

        if youtube_path and os.path.exists(youtube_path):
            with open(youtube_path, encoding="utf-8") as f:
                combined.extend(json.load(f))

        combined_path = os.path.join(data_dir, f"{school['slug']}_combined_raw.json")
        with open(combined_path, "w", encoding="utf-8") as f:
            json.dump(combined, f, indent=2, ensure_ascii=False)

        # Summarize
        try:
            summarize_school(school, combined_path, data_dir)
        except Exception as e:
            print(f"  ✗ Summarization failed: {e}")
            failed.append((school["slug"], "summarize", str(e)))
            continue

        if i < total:
            time.sleep(3)

    print(f"\n{'=' * 60}")
    print(f"Done. {total - len(failed)}/{total} schools completed successfully.")
    if failed:
        print("\nFailed:")
        for slug, stage, err in failed:
            print(f"  {slug} ({stage}): {err}")


if __name__ == "__main__":
    main()
