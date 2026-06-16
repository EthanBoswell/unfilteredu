import json
import os
import time

import anthropic

from scrape_and_summarize_all import (
    ANTHROPIC_API_KEY,
    CATEGORIES,
    MODEL,
    SCHOOLS,
    strip_fences,
    summarize_school,
)

DATA_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "frontend", "data"))

SCHOOL_DELAY_SECONDS = 15
MAX_RETRIES = 5
RATE_LIMIT_BACKOFF_SECONDS = 30


def with_rate_limit_retry(fn, *args, **kwargs):
    delay = RATE_LIMIT_BACKOFF_SECONDS
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return fn(*args, **kwargs)
        except anthropic.RateLimitError:
            if attempt == MAX_RETRIES:
                raise
            print(f"  Rate limited, waiting {delay}s before retry ({attempt}/{MAX_RETRIES})...")
            time.sleep(delay)
            delay = min(delay * 2, 180)
        except json.JSONDecodeError as e:
            if attempt == MAX_RETRIES:
                raise
            print(f"  Malformed JSON from model ({e}), retrying ({attempt}/{MAX_RETRIES})...")
            time.sleep(5)

SCORE_SYSTEM_PROMPT = (
    "You are scoring existing summaries of real student opinions about a university. "
    "For each category, assign an integer score from 1-10 based on its summary and quotes. "
    "1-3 = poor, consistent complaints. 4-5 = mixed, notable issues. "
    "6-7 = good, mostly positive. 8-10 = excellent, strong praise. "
    "For \"red_flags\", the scale is reversed: 10 = very serious concerns, 1 = minimal concerns."
)

BULLET_SYSTEM_PROMPT = (
    "You are condensing existing summaries of real student opinions about a university "
    "into short, punchy bullet points for a scannable dashboard. For each category, write "
    "exactly 3 bullet points, each at most 12 words, leading with the most important insight "
    "first. Be specific and direct. For \"red_flags\", start each bullet with a bold category "
    "keyword and a colon, e.g. \"Housing: students assigned to inactive dorms with no notice\"."
)


def build_scoring_prompt(summary: dict) -> str:
    lines = ["Score each of the following categories from 1-10 based on its summary and quotes.\n"]
    for cat in CATEGORIES:
        data = summary.get(cat)
        if not data:
            continue
        lines.append(f"--- {cat} ---")
        lines.append(f"Summary: {data.get('summary', '')}")
        for q in data.get("key_quotes", []):
            lines.append(f"  Quote: {q}")
        lines.append("")

    lines.append(
        'Return ONLY a valid JSON object (no markdown, no explanation) mapping each '
        'category name to an integer score 1-10, e.g.:\n'
        '{"housing": 7, "social_life": 8, ...}'
    )
    return "\n".join(lines)


def score_summary(summary: dict) -> dict:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    response = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=SCORE_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": build_scoring_prompt(summary)}],
    )
    return json.loads(strip_fences(response.content[0].text))


def build_bullet_prompt(summary: dict) -> str:
    lines = ["Condense each category's summary into exactly 3 short bullet points (max 12 words each), most important first.\n"]
    for cat in CATEGORIES:
        data = summary.get(cat, {})
        if "key_points" in data:
            continue
        lines.append(f"--- {cat} ---")
        lines.append(f"Summary: {data.get('summary', '')}")
        lines.append("")

    lines.append(
        'Return ONLY a valid JSON object (no markdown, no explanation) mapping each '
        'category name to an array of exactly 3 bullet strings, e.g.:\n'
        '{"housing": ["point1", "point2", "point3"], "social_life": [...], ...}\n'
        'For "red_flags", start each bullet with a bold category keyword and colon, '
        'e.g. "Housing: students assigned to inactive dorms with no notice".'
    )
    return "\n".join(lines)


def bulletize_summary(summary: dict) -> dict:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    response = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=BULLET_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": build_bullet_prompt(summary)}],
    )
    return json.loads(strip_fences(response.content[0].text))


def process_school(slug: str, path: str, schools_by_slug: dict) -> None:
    with open(path, encoding="utf-8") as f:
        summary = json.load(f)

    has_all_categories = all(cat in summary for cat in CATEGORIES)

    if not has_all_categories:
        school = schools_by_slug.get(slug)
        raw_path = os.path.join(DATA_DIR, f"{slug}_raw.json")

        if not school or not os.path.exists(raw_path):
            print(f"[SKIP] {slug}: missing categories but no school/raw data to re-summarize from")
            return

        print(f"[RESUMMARIZE] {slug}: missing categories, re-running full summarization...")
        os.remove(path)
        with_rate_limit_retry(summarize_school, school, raw_path, DATA_DIR)
        return

    missing_scores = [cat for cat in CATEGORIES if "score" not in summary[cat]]
    missing_key_points = [cat for cat in CATEGORIES if "key_points" not in summary[cat]]

    if not missing_scores and not missing_key_points:
        print(f"[SKIP] {slug}: already up to date")
        return

    if missing_scores:
        print(f"[SCORE] {slug}: scoring {len(missing_scores)} categories...")
        scores = with_rate_limit_retry(score_summary, summary)
        for cat in missing_scores:
            if cat in scores:
                summary[cat]["score"] = scores[cat]
            else:
                print(f"  WARNING: no score returned for {cat}")

    if missing_key_points:
        print(f"[BULLETS] {slug}: condensing {len(missing_key_points)} categories into key points...")
        bullets = with_rate_limit_retry(bulletize_summary, summary)
        for cat in missing_key_points:
            if cat in bullets:
                summary[cat]["key_points"] = bullets[cat]
                summary[cat].pop("summary", None)
            else:
                print(f"  WARNING: no key_points returned for {cat}")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print(f"  Saved → {path}")


def main():
    schools_by_slug = {school["slug"]: school for school in SCHOOLS}
    summary_files = sorted(f for f in os.listdir(DATA_DIR) if f.endswith("_summary.json"))

    print(f"Found {len(summary_files)} summary files\n")

    failed = []

    for i, filename in enumerate(summary_files):
        slug = filename[: -len("_summary.json")]
        path = os.path.join(DATA_DIR, filename)

        try:
            process_school(slug, path, schools_by_slug)
        except Exception as e:
            print(f"  ERROR: {e}")
            failed.append((slug, str(e)))

        if i < len(summary_files) - 1:
            time.sleep(SCHOOL_DELAY_SECONDS)

    print(f"\n{'=' * 60}")
    print("Done.")
    if failed:
        print("\nFailed:")
        for slug, err in failed:
            print(f"  {slug}: {err}")


if __name__ == "__main__":
    main()
