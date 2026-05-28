import json
import os
import re
import time

import anthropic
from dotenv import load_dotenv

from scrape_reddit_direct import scrape_school_direct

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not found in .env")

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
            raw_path = scrape_school_direct(school, data_dir)
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
