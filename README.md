# UnfilteredU

**Live site:** [unfilteredu.co](https://unfilteredu.co)

UnfilteredU gives prospective students unfiltered insight into college life — the stuff admissions offices won't tell you. It aggregates and summarizes real student discussions from Reddit and YouTube across 250+ universities, turning thousands of raw comments and posts into structured, digestible takeaways for high schoolers deciding where to apply.

## What it does

- Scrapes student discussion threads and comments from Reddit and YouTube for 250+ universities, onboarding ~20 new schools per day
- Processes roughly 2,000–2,500 Reddit posts and 1,000 YouTube comments daily
- Uses an NLP summarization pipeline built on the Claude API to distill raw, unstructured discussion into clear, structured insights (dorm life, workload, social scene, campus culture, etc.)
- Serves the aggregated, summarized data through a full-stack web app for students to browse by school

## Tech Stack

- **Backend / Scraping:** Python (custom scraper), Apify
- **Summarization / NLP:** Claude API
- **Frontend:** TypeScript
- **Deployment:** [unfilteredu.co](https://unfilteredu.co)

## Why I built this

College decisions are made on marketing copy and campus tours, not on what students actually think. I wanted a fast way for high schoolers to see honest, aggregated opinions instead of digging through Reddit threads themselves — so I built the pipeline to do that automatically, at scale, and keep it running daily.

## Status

Actively in development — currently expanding to add user accounts and filing a trademark for the platform.

## Roadmap

- [ ] User accounts and saved school lists
- [ ] Expand source coverage beyond Reddit/YouTube
- [ ] Sentiment trend tracking over time per school
