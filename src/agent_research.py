#!/usr/bin/env python3
"""
Autonomous research agent for UnfilteredU.
Researches a university using YouTube, RateMyProfessors, Coursicle, and web search
via Claude's tool use feature — no Reddit.
"""
import json
import os
import re
import datetime
from typing import Optional, Tuple, List

import requests
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
import anthropic
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not found in .env")

MODEL = "claude-sonnet-4-6"
MAX_TOOL_CALLS = 15
SCHOOL_NAME = "Louisiana State University"
SCHOOL_SLUG = "lsu"
TODAY = datetime.date.today().isoformat()

DATA_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data"))
OUTPUT_PATH = os.path.join(DATA_DIR, "lsu_agent_summary.json")
EXISTING_PATH = os.path.join(DATA_DIR, "lsu_summary.json")

CATEGORIES = [
    "housing", "social_life", "dining", "mental_health",
    "financial_aid", "academics", "administration", "location_and_campus",
    "career_outcomes", "value_for_money", "overall_vibe", "red_flags", "hidden_gems",
]

BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


# ─── Tool implementations ──────────────────────────────────────────────────────

def search_youtube(query: str, max_videos: int = 5) -> dict:
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY not configured in .env"}

    try:
        youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

        search_resp = youtube.search().list(
            q=query,
            part="id,snippet",
            type="video",
            maxResults=max_videos,
            relevanceLanguage="en",
        ).execute()

        videos = []
        for item in search_resp.get("items", []):
            video_id = item["id"]["videoId"]
            title = item["snippet"]["title"]
            channel = item["snippet"]["channelTitle"]

            short_comments = []
            try:
                comments_resp = youtube.commentThreads().list(
                    part="snippet",
                    videoId=video_id,
                    maxResults=50,
                    order="relevance",
                    textFormat="plainText",
                ).execute()

                for c in comments_resp.get("items", []):
                    text = c["snippet"]["topLevelComment"]["snippet"]["textDisplay"].strip()
                    if text and len(text.split()) < 20:
                        short_comments.append(text)
            except Exception:
                pass

            videos.append({
                "video_id": video_id,
                "title": title,
                "channel": channel,
                "short_comments": short_comments,
            })

        return {"query": query, "videos": videos}

    except Exception as e:
        return {"error": str(e)}


def scrape_rmp(school_name: str) -> dict:
    url = "https://www.ratemyprofessors.com/search/schools?q=" + requests.utils.quote(school_name)
    try:
        resp = requests.get(url, headers=BROWSER_HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")

        # Try to extract structured data embedded in script tags
        json_data = []
        for script in soup.find_all("script"):
            if not script.string:
                continue
            blob = script.string
            if "rating" not in blob.lower() and "professor" not in blob.lower():
                continue
            for match in re.findall(r'\{[^<>]{20,600}\}', blob):
                try:
                    obj = json.loads(match)
                    if any(k in obj for k in ("avgRating", "numRatings", "avgDifficulty", "ratingValue")):
                        json_data.append(obj)
                except Exception:
                    pass

        page_text = soup.get_text(separator="\n", strip=True)
        relevant = [
            ln.strip() for ln in page_text.split("\n")
            if ln.strip() and any(
                kw in ln.lower() for kw in
                ["rating", "professor", "difficulty", "quality", "review", "student", "helpful"]
            )
        ]

        return {
            "url": url,
            "structured": json_data[:10],
            "relevant_text": relevant[:40],
            "page_sample": page_text[:2500],
        }
    except Exception as e:
        return {"error": str(e), "url": url}


def scrape_coursicle(school_slug: str) -> dict:
    url = f"https://www.coursicle.com/{school_slug}/"
    try:
        resp = requests.get(url, headers=BROWSER_HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")

        reviews = []
        for el in soup.find_all(["p", "div", "span", "li"]):
            cls = " ".join(el.get("class", []))
            if any(kw in cls.lower() for kw in ["review", "comment", "description", "rating", "text", "content"]):
                text = el.get_text(strip=True)
                if 20 < len(text) < 400:
                    reviews.append(text)

        page_text = soup.get_text(separator="\n", strip=True)
        lines = [ln.strip() for ln in page_text.split("\n") if len(ln.strip()) > 20]

        return {
            "url": url,
            "reviews": reviews[:20],
            "page_lines": lines[:60],
            "page_sample": page_text[:2500],
        }
    except Exception as e:
        return {"error": str(e), "url": url}


# ─── Agent definition ──────────────────────────────────────────────────────────

TOOLS = [
    {"type": "web_search_20250305", "name": "web_search"},
    {
        "name": "search_youtube",
        "description": (
            "Search YouTube for student review and experience videos about a university. "
            "Fetches up to 50 comments per video and filters to comments under 20 words — "
            "short comments tend to be the most candid student takes."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "YouTube search query, e.g. 'LSU student life honest review 2024'",
                },
                "max_videos": {
                    "type": "integer",
                    "description": "Number of videos to sample (default 5)",
                    "default": 5,
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "scrape_rmp",
        "description": (
            "Scrape RateMyProfessors for professor quality ratings, difficulty scores, "
            "and student comments at a given university."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "school_name": {
                    "type": "string",
                    "description": "Full school name, e.g. 'Louisiana State University'",
                },
            },
            "required": ["school_name"],
        },
    },
    {
        "name": "scrape_coursicle",
        "description": (
            "Scrape Coursicle for course reviews and student comments about a university."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "school_slug": {
                    "type": "string",
                    "description": "School's Coursicle URL slug, e.g. 'lsu', 'unc', 'duke'",
                },
            },
            "required": ["school_slug"],
        },
    },
]

# Use $PLACEHOLDERS$ to avoid conflicts with JSON curly braces in the template
SYSTEM_PROMPT_TEMPLATE = """\
You are a college research agent for UnfilteredU — a platform that gives high school students \
and parents honest, unfiltered information about universities based on real student experiences. \
Your job is to research $SCHOOL_NAME$ thoroughly using the tools available to you.

Search for honest student opinions across YouTube comments, Rate My Professors, Coursicle, \
and general web search. Prioritize:
- Student-written reviews and comments
- Complaints and red flags students mention
- Hidden gems and insider tips
- Specific details about daily student life
- Financial realities and value for money

Ignore: official school websites, marketing material, rankings without student context

Research all of these categories thoroughly:
housing, social_life, dining, mental_health, financial_aid, academics, administration, \
location_and_campus, career_outcomes, value_for_money, overall_vibe, red_flags, hidden_gems

For each category find at least 2-3 specific student opinions before moving on. \
Use multiple tool calls — be thorough.

When you have researched all 13 categories, return this exact JSON structure \
(no markdown fences, no explanation — only valid JSON):
{
  "school_name": "LSU",
  "sources_used": ["youtube", "ratemyprofessors", "web"],
  "research_date": "$TODAY$",
  "housing": {
    "summary": "2-3 sentences summarizing student sentiment",
    "key_points": ["point 1", "point 2", "point 3"],
    "key_quotes": ["quote 1", "quote 2"],
    "score": 7,
    "sentiment": "mixed"
  },
  "social_life": { "summary": "...", "key_points": [...], "key_quotes": [...], "score": 7, "sentiment": "positive" },
  "dining": { ... },
  "mental_health": { ... },
  "financial_aid": { ... },
  "academics": { ... },
  "administration": { ... },
  "location_and_campus": { ... },
  "career_outcomes": { ... },
  "value_for_money": { ... },
  "overall_vibe": { ... },
  "red_flags": { ... },
  "hidden_gems": { ... }
}

Sentiment must be one of: "positive", "mixed", "negative".
Score is 1-10 (for red_flags, 10 = very serious concerns, 1 = minimal)."""


# ─── Agent loop ────────────────────────────────────────────────────────────────

def _extract_json(response) -> Optional[dict]:
    """Pull the first valid JSON object out of a response's text blocks."""
    for block in reversed(response.content):
        if block.type != "text" or not block.text.strip():
            continue
        text = block.text.strip()
        # Strip markdown fences
        clean = re.sub(r"^```(?:json)?\s*\n?", "", text, flags=re.MULTILINE)
        clean = re.sub(r"\n?```\s*$", "", clean, flags=re.MULTILINE).strip()
        try:
            return json.loads(clean)
        except json.JSONDecodeError:
            pass
        # Try to locate a JSON object anywhere in the text
        match = re.search(r"(\{.*\})", clean, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
    return None


def _execute_tool(name: str, tool_input: dict) -> str:
    if name == "search_youtube":
        result = search_youtube(**tool_input)
    elif name == "scrape_rmp":
        result = scrape_rmp(**tool_input)
    elif name == "scrape_coursicle":
        result = scrape_coursicle(**tool_input)
    else:
        result = {"error": f"Unknown tool: {name}"}
    return json.dumps(result, ensure_ascii=False)


def run_agent(school_name: str, school_slug: str) -> Tuple[dict, List[str]]:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    system = (
        SYSTEM_PROMPT_TEMPLATE
        .replace("$SCHOOL_NAME$", school_name)
        .replace("$TODAY$", TODAY)
    )

    messages = [
        {
            "role": "user",
            "content": (
                f"Research {school_name} comprehensively for UnfilteredU. "
                f"Use all tools — YouTube, RateMyProfessors, Coursicle, and web search. "
                f"Cover all 13 categories: {', '.join(CATEGORIES)}. "
                f"Find real student opinions for each. When finished, return the complete JSON."
            ),
        }
    ]

    sources_used = set()
    tool_call_count = 0

    print(f"\n{'=' * 60}")
    print(f"  UnfilteredU Research Agent — {school_name}")
    print(f"  Model : {MODEL}")
    print(f"  Limit : {MAX_TOOL_CALLS} tool calls")
    print(f"{'=' * 60}\n")

    while tool_call_count < MAX_TOOL_CALLS:
        response = client.messages.create(
            model=MODEL,
            max_tokens=8000,
            system=system,
            tools=TOOLS,
            tool_choice={"type": "auto"},
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        for block in response.content:
            if block.type == "text" and block.text.strip():
                print(f"\n[Agent] {block.text.strip()[:400]}")

        if response.stop_reason == "end_turn":
            result = _extract_json(response)
            if result:
                return result, sorted(sources_used)
            print("[WARN] end_turn with no valid JSON — falling through to synthesis")
            break

        if response.stop_reason != "tool_use":
            print(f"[WARN] Unexpected stop_reason: {response.stop_reason!r}")
            break

        # Execute each tool the agent called
        tool_results = []
        for block in response.content:
            if block.type != "tool_use":
                continue

            print(f"\n[Tool #{tool_call_count + 1}] {block.name}")
            print(f"  Input : {json.dumps(block.input)[:200]}")

            if block.name == "web_search":
                # Built-in server-side tool — Anthropic executes it
                sources_used.add("web")
                print("  Result: [Anthropic web search — handled server-side]")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": "Web search executed server-side by Anthropic.",
                })
            else:
                if block.name == "search_youtube":
                    sources_used.add("youtube")
                elif block.name == "scrape_rmp":
                    sources_used.add("ratemyprofessors")
                elif block.name == "scrape_coursicle":
                    sources_used.add("coursicle")

                result_str = _execute_tool(block.name, block.input)
                print(f"  Result: {result_str[:300]}")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result_str,
                })

            tool_call_count += 1

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    # Force synthesis once the tool budget is spent (or loop exited early)
    print(f"\n[Agent] Forcing synthesis after {tool_call_count} tool calls...")
    messages.append({
        "role": "user",
        "content": (
            f"You have completed research on {school_name} using {tool_call_count} tool calls. "
            "Now synthesize everything gathered and return ONLY the complete JSON object — "
            "no markdown fences, no explanation, no extra text."
        ),
    })

    synthesis = client.messages.create(
        model=MODEL,
        max_tokens=8000,
        system=system,
        messages=messages,
        # No tools — forces text-only output for the synthesis step
    )

    result = _extract_json(synthesis)
    if result:
        return result, sorted(sources_used)

    raise RuntimeError("Agent failed to produce valid JSON even after forced synthesis")


# ─── Comparison ────────────────────────────────────────────────────────────────

def compare_summaries(agent_data: dict, existing_path: str) -> None:
    print(f"\n{'=' * 60}")
    print("  Score Comparison: Agent vs Existing Summary")
    print(f"{'=' * 60}")

    if not os.path.exists(existing_path):
        print(f"  No existing summary found at {existing_path}")
        print("\n  Agent scores (standalone):")
        for cat in CATEGORIES:
            score = agent_data.get(cat, {}).get("score")
            if score is not None:
                filled = "█" * score + "░" * (10 - score)
                print(f"    {cat:<25} [{filled}] {score}/10")
        return

    with open(existing_path) as f:
        existing = json.load(f)

    print(f"\n  {'Category':<25} {'Existing':>9}  {'Agent':>7}  {'Delta':>6}")
    print(f"  {'-' * 54}")

    for cat in CATEGORIES:
        a = agent_data.get(cat, {}).get("score")
        e = existing.get(cat, {}).get("score")

        a_str = f"{a}/10" if a is not None else " N/A"
        e_str = f"{e}/10" if e is not None else " N/A"

        if a is not None and e is not None:
            delta = a - e
            d_str = f"{delta:+d}"
            arrow = "  ↑" if delta > 0 else ("  ↓" if delta < 0 else "  =")
        else:
            d_str, arrow = " N/A", ""

        print(f"  {cat:<25} {e_str:>9}  {a_str:>7}  {d_str:>6}{arrow}")


# ─── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)

    result, sources = run_agent(SCHOOL_NAME, SCHOOL_SLUG)

    result.setdefault("school_name", SCHOOL_NAME)
    result.setdefault("sources_used", sources)
    result.setdefault("research_date", TODAY)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\n[Saved] → {OUTPUT_PATH}")

    compare_summaries(result, EXISTING_PATH)


if __name__ == "__main__":
    main()
