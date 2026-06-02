#!/bin/bash
set -e

echo "=== UnfilteredU Codespace Setup ==="

# Install dependencies
echo "Installing dependencies..."
pip3 install anthropic python-dotenv requests

# Pull latest data before scraping so we don't duplicate work
echo "Pulling latest data from remote..."
git pull --rebase origin main

# Determine which batch this Codespace should run
if [ -z "$BATCH_NUMBER" ]; then
  echo ""
  echo "ERROR: BATCH_NUMBER is not set."
  echo "Add it as a Codespace secret or run: export BATCH_NUMBER=1"
  exit 1
fi

# Generate batch files if they don't exist yet
if [ ! -f "data/batch_${BATCH_NUMBER}.json" ]; then
  echo "Batch files not found — generating now..."
  python3 src/assign_schools.py
fi

echo ""
echo "Starting batch $BATCH_NUMBER..."
python3 src/scrape_batch.py "$BATCH_NUMBER"

# Commit and push results back to the repo
echo ""
echo "Pushing results to GitHub..."
git config user.email "codespace@unfilteredu.com"
git config user.name "UnfilteredU Codespace $BATCH_NUMBER"
git add data/
git diff --cached --quiet && echo "Nothing new to commit." || (
  git commit -m "Add scraped data from batch $BATCH_NUMBER [codespace]"
  git pull --rebase origin main
  git push origin main
  echo "Pushed successfully."
)

echo ""
echo "=== Batch $BATCH_NUMBER complete ==="
