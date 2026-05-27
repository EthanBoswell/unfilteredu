import json
import os
import re
import time
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import quote_plus

import requests

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
}

CROSS_SUBS = ["ApplyingToCollege", "college"]
SLEEP = 3
MAX_COMMENT_POSTS = 100  # only fetch comments for top N posts by upvotes


def _get(url: str, params: Optional[dict] = None):
    for _ in range(2):
        resp = requests.get(url, headers=HEADERS, params=params, timeout=30)
        if resp.status_code == 429:
            retry_after = int(resp.headers.get("Retry-After", 60))
            wait = max(retry_after, 60)
            print(f"    Rate limited — sleeping {wait}s before retry...")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        return resp.json()
    resp.raise_for_status()
    return resp.json()


def _utc_to_iso(ts: float) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")


def _parse_post(data: dict) -> dict:
    return {
        "id": data.get("id", ""),
        "subreddit": f"r/{data.get('subreddit', '')}",
        "title": data.get("title", ""),
        "body": data.get("selftext", ""),
        "url": data.get("url", ""),
        "upvotes": data.get("ups", 0),
        "date": _utc_to_iso(data.get("created_utc", 0)),
        "author": data.get("author", ""),
        "top_comments": [],
    }


def _fetch_listing(url: str, params: Optional[dict] = None) -> list[dict]:
    try:
        data = _get(url, params)
        time.sleep(SLEEP)
        children = data.get("data", {}).get("children", [])
        return [_parse_post(c["data"]) for c in children if c.get("kind") == "t3"]
    except Exception as e:
        print(f"    Warning: failed to fetch {url}: {e}")
        time.sleep(SLEEP)
        return []


def _fetch_comments(post_id: str) -> list[dict]:
    url = f"https://www.reddit.com/comments/{post_id}.json"
    try:
        result = _get(url, params={"sort": "top", "limit": 10, "depth": 1})
        time.sleep(SLEEP)
        if not isinstance(result, list) or len(result) < 2:
            return []
        comments = []
        for child in result[1]["data"]["children"]:
            if child.get("kind") != "t1":
                continue
            d = child["data"]
            body = (d.get("body") or "").strip()
            if body and body not in ("[deleted]", "[removed]"):
                comments.append({
                    "text": body,
                    "upvotes": d.get("ups", 0),
                    "author": d.get("author", ""),
                    "date": _utc_to_iso(d.get("created_utc", 0)),
                })
        return sorted(comments, key=lambda c: c["upvotes"], reverse=True)[:10]
    except Exception as e:
        print(f"    Warning: failed to fetch comments for {post_id}: {e}")
        time.sleep(SLEEP)
        return []


def scrape_school_direct(school: dict, data_dir: str) -> str:
    slug = school["slug"]
    out_path = os.path.join(data_dir, f"{slug}_raw.json")

    if os.path.exists(out_path):
        print(f"  [SKIP scrape] {slug}_raw.json already exists")
        return out_path

    own_subs = set()
    for sub in school["subreddits"]:
        name = sub[2:] if sub.startswith("r/") else sub
        own_subs.add(name.lower())

    pattern = re.compile(
        "|".join(re.escape(k) for k in school["keywords"]),
        re.IGNORECASE,
    )

    def is_relevant(post: dict) -> bool:
        sub = (post.get("subreddit") or "").lower()
        sub_name = sub[2:] if sub.startswith("r/") else sub
        if sub_name in own_subs:
            return True
        return bool(pattern.search(f"{post.get('title', '')} {post.get('body', '')}"))

    posts: dict[str, dict] = {}

    # Scrape each school's own subreddits (top posts of the year)
    for sub in school["subreddits"]:
        sub_name = sub[2:] if sub.startswith("r/") else sub
        url = f"https://www.reddit.com/r/{sub_name}/top.json"
        print(f"    Fetching r/{sub_name} top posts...")
        for p in _fetch_listing(url, params={"t": "year", "limit": 100}):
            if p["id"] not in posts:
                posts[p["id"]] = p

    # Search cross-subs (r/ApplyingToCollege, r/college) for each keyword
    for keyword in school["keywords"]:
        for cross_sub in CROSS_SUBS:
            url = f"https://www.reddit.com/r/{cross_sub}/search.json"
            print(f"    Searching r/{cross_sub} for '{keyword}'...")
            for p in _fetch_listing(url, params={"q": keyword, "sort": "top", "restrict_sr": "1", "limit": 100}):
                if p["id"] not in posts:
                    posts[p["id"]] = p

    all_posts = list(posts.values())
    relevant = [p for p in all_posts if is_relevant(p)]
    relevant.sort(key=lambda p: p["upvotes"], reverse=True)
    print(f"  {len(all_posts)} posts collected, {len(relevant)} kept after relevance filter")

    # Fetch top comments for the highest-upvoted posts only
    for_comments = relevant[:MAX_COMMENT_POSTS]
    print(f"  Fetching comments for {len(for_comments)} posts (top {MAX_COMMENT_POSTS} by upvotes)...")
    for i, post in enumerate(for_comments, 1):
        print(f"    [{i}/{len(for_comments)}] {post['title'][:70]}...")
        post["top_comments"] = _fetch_comments(post["id"])

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(relevant, f, indent=2, ensure_ascii=False)

    print(f"  Saved {len(relevant)} posts → {out_path}")
    return out_path
