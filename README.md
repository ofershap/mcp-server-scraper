# mcp-server-scraper

[![npm version](https://img.shields.io/npm/v/mcp-server-scraper.svg)](https://www.npmjs.com/package/mcp-server-scraper)
[![npm downloads](https://img.shields.io/npm/dm/mcp-server-scraper.svg)](https://www.npmjs.com/package/mcp-server-scraper)
[![CI](https://github.com/ofershap/mcp-server-scraper/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/mcp-server-scraper/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Extract clean, readable content from any URL — markdown text, links, and metadata. Zero auth, zero config. A free, open-source alternative to Firecrawl for docs, blogs, and articles.

```bash
npx mcp-server-scraper
```

> Works with Claude Desktop, Cursor, VS Code Copilot, and any MCP client. Zero auth — no API keys needed.

![Demo](assets/demo.gif)

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

### VS Code Copilot

Add to your MCP settings (e.g. `mcp.json` or equivalent):

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

## Examples

Ask your AI assistant:

- "Scrape the API docs from https://docs.example.com and summarize them"
- "Extract all links from this page"
- "What's the OG image and description for this URL?"
- "Search this page for mentions of 'authentication'"
- "Scrape these 5 URLs and give me a summary of each"

## How it works

Uses [Mozilla Readability](https://github.com/mozilla/readability) (same engine as Firefox Reader View) plus [linkedom](https://github.com/WebReflection/linkedom) for fast HTML parsing in Node. No headless browser needed. Works best with server-rendered pages: docs, blogs, articles, news.

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
```

## Author

**Ofer Shapira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/ofershap)

## License

[MIT](LICENSE) &copy; [Ofer Shapira](https://github.com/ofershap)
