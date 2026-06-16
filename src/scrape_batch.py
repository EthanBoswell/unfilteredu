import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))

from scrape_and_summarize_all import summarize_school
from scrape_reddit_direct import scrape_school_direct

DATA_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "frontend", "data"))


def main():
    if len(sys.argv) < 2:
        print("Usage: python src/scrape_batch.py <batch_number>")
        sys.exit(1)

    batch_num = int(sys.argv[1])
    batch_path = os.path.join(DATA_DIR, f"batch_{batch_num}.json")

    if not os.path.exists(batch_path):
        print(f"ERROR: {batch_path} not found. Run python src/assign_schools.py first.")
        sys.exit(1)

    with open(batch_path, encoding="utf-8") as f:
        schools = json.load(f)

    total = len(schools)
    failed = []
    print(f"Batch {batch_num}: {total} schools\n")

    for i, school in enumerate(schools, 1):
        print(f"\n{'=' * 60}")
        print(f"[{i}/{total}]  {school['name']}  ({school['slug']})")
        print("=" * 60)

        try:
            raw_path = scrape_school_direct(school, DATA_DIR)
        except Exception as e:
            print(f"  ERROR scraping: {e}")
            failed.append((school["slug"], "scrape", str(e)))
            continue

        try:
            summarize_school(school, raw_path, DATA_DIR)
        except Exception as e:
            print(f"  ERROR summarizing: {e}")
            failed.append((school["slug"], "summarize", str(e)))
            continue

        if i < total:
            print(f"\n  Waiting 5 seconds...")
            time.sleep(5)

    print(f"\n{'=' * 60}")
    print(f"Done. {total - len(failed)}/{total} schools completed successfully.")
    if failed:
        for slug, stage, err in failed:
            print(f"  FAILED [{stage}] {slug}: {err}")


if __name__ == "__main__":
    main()
