import json
import os

import anthropic
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not found in .env")

MODEL = "claude-sonnet-4-6"

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

        comments = post.get("top_comments") or []
        if comments:
            lines.append("Top comments:")
            for c in comments[:5]:
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


def main():
    data_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data"))
    in_path = os.path.join(data_dir, "unc_raw.json")

    with open(in_path, encoding="utf-8") as f:
        posts = json.load(f)

    print(f"Loaded {len(posts)} posts")

    formatted = format_posts(posts)
    user_content = (
        f"Here are {len(posts)} Reddit posts about UNC Chapel Hill "
        f"from r/UNC, r/chapelhill, r/UNCCharlotte, r/ApplyingToCollege, and r/college.\n\n"
        f"{formatted}\n\n"
        f"{OUTPUT_SCHEMA}"
    )

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    print(f"Sending to Claude ({MODEL})...")
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_content,
                        "cache_control": {"type": "ephemeral"},
                    }
                ],
            }
        ],
    )

    raw = strip_fences(response.content[0].text)
    summary = json.loads(raw)

    out_path = os.path.join(data_dir, "unc_summary.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to {out_path}")
    print("\nCategories populated:")
    for cat in CATEGORIES:
        marker = "✓" if cat in summary else "✗ MISSING"
        print(f"  {marker}  {cat}")

    usage = response.usage
    cache_written = getattr(usage, "cache_creation_input_tokens", 0)
    cache_read = getattr(usage, "cache_read_input_tokens", 0)
    if cache_written or cache_read:
        print(f"\nCache: {cache_written} tokens written, {cache_read} tokens read")


if __name__ == "__main__":
    main()
