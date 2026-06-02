import json
import os
import sys

# Prevent API key check from crashing on import — this script doesn't call Claude
os.environ.setdefault("ANTHROPIC_API_KEY", "assign-only")
sys.path.insert(0, os.path.dirname(__file__))

from scrape_and_summarize_all import SCHOOLS

CHUNK_SIZE = 5
DATA_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data"))


def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    batches = [SCHOOLS[i : i + CHUNK_SIZE] for i in range(0, len(SCHOOLS), CHUNK_SIZE)]

    for idx, batch in enumerate(batches, 1):
        path = os.path.join(DATA_DIR, f"batch_{idx}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(batch, f, indent=2)
        names = ", ".join(s["name"] for s in batch)
        print(f"Batch {idx} ({len(batch)} schools): {names}")
        print(f"  → {path}")

    print(f"\n{len(batches)} batches created from {len(SCHOOLS)} schools.")


if __name__ == "__main__":
    main()
