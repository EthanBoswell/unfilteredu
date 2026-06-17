from __future__ import annotations

import json
import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
BASE_URL = "https://www.googleapis.com/youtube/v3"

SEARCH_QUERY_TEMPLATES = [
    "{name} student review",
    "{name} honest review",
    "day in my life {name}",
    "{name} campus tour honest",
]


def scrape_youtube(school: dict, data_dir: str) -> tuple[str, int]:
    slug = school["slug"]
    name = school["name"]
    out_path = os.path.join(data_dir, f"{slug}_youtube_raw.json")

    if os.path.exists(out_path):
        with open(out_path, encoding="utf-8") as f:
            existing = json.load(f)
        return out_path, len(existing)

    if not YOUTUBE_API_KEY:
        raise ValueError("YOUTUBE_API_KEY not found in .env")

    all_comments = []
    seen_video_ids: set[str] = set()

    for query_template in SEARCH_QUERY_TEMPLATES:
        query = query_template.format(name=name)
        try:
            search_resp = requests.get(
                f"{BASE_URL}/search",
                params={
                    "key": YOUTUBE_API_KEY,
                    "q": query,
                    "type": "video",
                    "order": "viewCount",
                    "maxResults": 5,
                    "part": "snippet",
                },
                timeout=30,
            )
            search_resp.raise_for_status()
        except Exception as e:
            print(f"    Warning: YouTube search failed for '{query}': {e}")
            continue

        items = search_resp.json().get("items", [])
        time.sleep(0.5)

        for item in items:
            video_id = item["id"].get("videoId")
            if not video_id or video_id in seen_video_ids:
                continue
            seen_video_ids.add(video_id)
            video_title = item["snippet"]["title"]

            try:
                comments_resp = requests.get(
                    f"{BASE_URL}/commentThreads",
                    params={
                        "key": YOUTUBE_API_KEY,
                        "videoId": video_id,
                        "order": "relevance",
                        "maxResults": 30,
                        "part": "snippet",
                    },
                    timeout=30,
                )
                if comments_resp.status_code != 200:
                    time.sleep(0.5)
                    continue
            except Exception:
                continue

            for thread in comments_resp.json().get("items", []):
                snippet = thread["snippet"]["topLevelComment"]["snippet"]
                text = snippet.get("textDisplay", "").strip()
                if len(text.split()) < 20:
                    continue
                all_comments.append({
                    "id": thread["id"],
                    "source": "youtube",
                    "title": video_title,
                    "body": text,
                    "upvotes": snippet.get("likeCount", 0),
                    "date": snippet.get("publishedAt", ""),
                    "author": snippet.get("authorDisplayName", ""),
                })

            time.sleep(0.5)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_comments, f, indent=2, ensure_ascii=False)

    return out_path, len(all_comments)
