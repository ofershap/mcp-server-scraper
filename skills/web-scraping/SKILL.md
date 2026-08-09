---
name: web-scraping
description: Extract clean content from URLs via MCP. Use when the user asks to scrape a URL, read docs/blog/article pages, summarize a link, extract links, search page text, batch-scrape URLs, or get OG/title metadata without Firecrawl.
---

# Web Scraping via MCP

Use this skill to extract clean, readable content from any URL. Returns markdown text, links, and metadata. Free alternative to Firecrawl.

## Available Tools

| Tool               | What it does                                                |
| ------------------ | ----------------------------------------------------------- |
| `scrape_url`       | Extract clean text content from a URL (Readability-powered) |
| `extract_links`    | Get all links with href and anchor text                     |
| `extract_metadata` | Get title, description, OG tags, canonical, favicon         |
| `search_page`      | Search for a query string within the page content           |
| `scrape_multiple`  | Batch scrape multiple URLs, get title + excerpt per URL     |

## Workflow

1. `scrape_url` for reading a single page (docs, blog post, article)
2. `extract_links` to discover linked resources from a page
3. `extract_metadata` for SEO analysis or link preview data
4. `scrape_multiple` to survey multiple pages at once

## Key Patterns

- Uses Mozilla Readability (Firefox Reader View engine); works best with server-rendered content
- Does NOT handle JavaScript-heavy SPAs (React apps, dashboards); use a browser MCP for those
- `scrape_multiple` returns title + excerpt per URL, not full content; use for surveying
- `search_page` searches within the extracted content, not raw HTML

## Error Scenarios

- Empty or tiny markdown: page may be SPA-only or behind login; try a browser MCP or a direct API doc export
- HTTP 403/401: site blocks bots; no fix inside this server
- Timeout or DNS errors: retry with a simpler URL or check network
- `scrape_multiple` partial failures: inspect per-URL errors in the batch result and scrape successes individually

## Limitations

- No headless browser — won't execute JavaScript
- Best for: documentation, blogs, articles, news, wikis
- Won't work for: login-gated content, SPAs, dynamically loaded content
