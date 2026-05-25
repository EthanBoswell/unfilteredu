import json
import os
import re
import time

import requests
from dotenv import load_dotenv

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_TOKEN not found in .env")

ACTOR_ID = "trudax~reddit-scraper-lite"
BASE_URL = "https://api.apify.com/v2"

RELEVANCE_PATTERN = re.compile(
    r"\bunc\b|chapel hill|university of north carolina|tar heels",
    re.IGNORECASE,
)

SEARCH_TERMS = [
    "UNC+Chapel+Hill",
    "Chapel+Hill",
    "University+of+North+Carolina",
    "Tar+Heels+campus",
]

# r/UNC and r/chapelhill are on-topic by definition — scrape directly.
# r/UNCCharlotte is a different school, so search for CH-specific terms only.
# r/ApplyingToCollege and r/college need all search terms.
SEARCH_URLS = (
    [
        {"url": "https://www.reddit.com/r/UNC/"},
        {"url": "https://www.reddit.com/r/chapelhill/"},
    ]
    + [
        {"url": f"https://www.reddit.com/r/UNCCharlotte/search?q={t}&sort=top&restrict_sr=1"}
        for t in SEARCH_TERMS
    ]
    + [
        {"url": f"https://www.reddit.com/r/ApplyingToCollege/search?q={t}&sort=top&restrict_sr=1"}
        for t in SEARCH_TERMS
    ]
    + [
        {"url": f"https://www.reddit.com/r/college/search?q={t}&sort=top&restrict_sr=1"}
        for t in SEARCH_TERMS
    ]
)

ACTOR_INPUT = {
    "startUrls": SEARCH_URLS,
    "sort": "top",
    "maxItems": 1000,
    "maxPostCount": 100,
    "maxComments": 10,
    "proxy": {
        "useApifyProxy": True,
    },
}


def run_actor():
    url = f"{BASE_URL}/acts/{ACTOR_ID}/runs"
    resp = requests.post(url, params={"token": APIFY_TOKEN}, json=ACTOR_INPUT)
    resp.raise_for_status()
    run = resp.json()["data"]
    print(f"Run started: {run['id']}")
    return run


def wait_for_run(run_id):
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


def fetch_dataset(dataset_id):
    url = f"{BASE_URL}/datasets/{dataset_id}/items"
    params = {"token": APIFY_TOKEN, "format": "json", "clean": "true", "limit": 2000}
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    return resp.json()


def build_posts(items):
    posts = {}
    comments = []

    for item in items:
        dtype = item.get("dataType", "")
        if dtype == "post":
            post_id = item.get("id", "")
            if post_id in posts:
                continue  # deduplicate across overlapping search queries
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


def is_relevant(post):
    # r/UNC and r/chapelhill are always on-topic
    subreddit = (post.get("subreddit") or "").lower()
    if subreddit in ("r/unc", "r/chapelhill"):
        return True
    text = f"{post.get('title', '')} {post.get('body', '')}"
    return bool(RELEVANCE_PATTERN.search(text))


def main():
    print("Starting Reddit scrape for UNC Chapel Hill...")
    print(f"Querying {len(SEARCH_URLS)} URLs across 5 subreddits...")
    run = run_actor()
    print("Waiting for run to finish...")
    run = wait_for_run(run["id"])

    if run["status"] != "SUCCEEDED":
        raise RuntimeError(f"Actor run failed with status: {run['status']}")

    dataset_id = run["defaultDatasetId"]
    print(f"Fetching dataset {dataset_id}...")
    items = fetch_dataset(dataset_id)

    all_posts = build_posts(items)
    relevant_posts = [p for p in all_posts if is_relevant(p)]

    print(f"Total collected: {len(all_posts)} posts")
    print(f"After relevance filter: {len(relevant_posts)} posts kept "
          f"({len(all_posts) - len(relevant_posts)} removed)")

    out_path = os.path.join(os.path.dirname(__file__), "..", "data", "unc_raw.json")
    out_path = os.path.normpath(out_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(relevant_posts, f, indent=2, ensure_ascii=False)

    print(f"Saved to {out_path}")


if __name__ == "__main__":
    main()
