---
name: web-scraping
description: Extract clean content from URLs via MCP. Use when asked to read web pages, extract links, or get page metadata.
---

# Web Scraping via MCP

Use this skill to extract clean, readable content from any URL. Returns markdown text, links, and metadata. Free alternative to Firecrawl.

## Available Tools

| Tool | What it does |
|------|-------------|
| `scrape_url` | Extract clean text content from a URL (Readability-powered) |
| `extract_links` | Get all links with href and anchor text |
| `extract_metadata` | Get title, description, OG tags, canonical, favicon |
| `search_page` | Search for a query string within the page content |
| `scrape_multiple` | Batch scrape multiple URLs, get title + excerpt per URL |

## Workflow

1. `scrape_url` for reading a single page (docs, blog post, article)
2. `extract_links` to discover linked resources from a page
3. `extract_metadata` for SEO analysis or link preview data
4. `scrape_multiple` to survey multiple pages at once

## Key Patterns

- Uses Mozilla Readability (Firefox Reader View engine) — works best with server-rendered content
- Does NOT handle JavaScript-heavy SPAs (React apps, dashboards) — use a browser MCP for those
- `scrape_multiple` returns title + excerpt per URL, not full content — use for surveying
- `search_page` searches within the extracted content, not raw HTML

## Limitations

- No headless browser — won't execute JavaScript
- Best for: documentation, blogs, articles, news, wikis
- Won't work for: login-gated content, SPAs, dynamically loaded content
