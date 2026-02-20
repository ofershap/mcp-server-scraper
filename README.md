# mcp-server-scraper

[![npm version](https://img.shields.io/npm/v/mcp-server-scraper.svg)](https://www.npmjs.com/package/mcp-server-scraper)
[![npm downloads](https://img.shields.io/npm/dm/mcp-server-scraper.svg)](https://www.npmjs.com/package/mcp-server-scraper)
[![CI](https://github.com/ofershap/mcp-server-scraper/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/mcp-server-scraper/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Extract clean, readable content from any URL. Returns markdown text, links, and metadata. No API keys, no config. A free alternative to Firecrawl for scraping docs, blogs, and articles.

```bash
npx mcp-server-scraper
```

> Works with Claude Desktop, Cursor, VS Code Copilot, and any MCP client. No accounts or API keys needed.

![MCP server for web scraping, content extraction, and URL metadata](assets/demo.gif)

<sub>Demo built with <a href="https://github.com/ofershap/remotion-readme-kit">remotion-readme-kit</a></sub>

## Why

When you're working with an AI assistant and need to reference a docs page, a blog post, or an API reference, you usually end up copy-pasting content manually. Tools like Firecrawl solve this but require a paid API key. This server does the same thing for free. It fetches a URL, runs it through Mozilla Readability (the same engine behind Firefox Reader View), and returns clean markdown. It works well for server-rendered content like documentation sites, blog posts, and articles. It won't handle JavaScript-heavy SPAs, but for the most common use case of "read this docs page and summarize it," it does the job.

## Tools

| Tool               | What it does                                                     |
| ------------------ | ---------------------------------------------------------------- |
| `scrape_url`       | Extract clean text content from a URL (Readability-powered)      |
| `extract_links`    | Get all links with href and anchor text                          |
| `extract_metadata` | Get title, description, OG tags, canonical, favicon              |
| `search_page`      | Search for a query string within the page, return matching lines |
| `scrape_multiple`  | Batch scrape multiple URLs, get title + excerpt per URL          |

## Quick Start

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "scraper": {
      "command": "npx",
      "args": ["-y", "mcp-server-scraper"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "scraper": {
      "command": "npx",
      "args": ["-y", "mcp-server-scraper"]
    }
  }
}
```

### VS Code

Add to your MCP settings (e.g. `.vscode/mcp.json`):

```json
{
  "mcp": {
    "servers": {
      "scraper": {
        "command": "npx",
        "args": ["-y", "mcp-server-scraper"]
      }
    }
  }
}
```

## Examples

- "Scrape the API docs from https://docs.example.com and summarize them"
- "Extract all links from this page"
- "What's the OG image and description for this URL?"
- "Search this page for mentions of 'authentication'"
- "Scrape these 5 URLs and give me a summary of each"

## How it works

Uses [Mozilla Readability](https://github.com/mozilla/readability) (the engine behind Firefox Reader View) plus [linkedom](https://github.com/WebReflection/linkedom) for fast HTML parsing in Node. No headless browser needed. Works best with server-rendered pages: docs, blogs, articles, news sites.

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
```

## See also

More MCP servers and developer tools on my [portfolio](https://gitshow.dev/ofershap).

## Author

[![Made by ofershap](https://gitshow.dev/api/card/ofershap)](https://gitshow.dev/ofershap)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/ofershap)

## License

[MIT](LICENSE) © [Ofer Shapira](https://github.com/ofershap)
