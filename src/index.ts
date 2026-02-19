import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  scrapeUrl,
  extractLinks,
  extractMetadata,
  searchPage,
  scrapeMultiple,
} from "./scraper.js";

const server = new McpServer({
  name: "mcp-server-scraper",
  version: "1.0.0",
});

server.tool(
  "scrape_url",
  "Extract clean, readable text content from a URL using Mozilla Readability. Returns title, excerpt, and main content. Best for articles, docs, and blog posts.",
  {
    url: z.string().url().describe("The URL to scrape"),
  },
  async ({ url }) => {
    const content = await scrapeUrl(url);
    const text = [
      `# ${content.title}`,
      content.byline ? `*${content.byline}*` : null,
      content.siteName ? `*${content.siteName}*` : null,
      "",
      content.excerpt ? `> ${content.excerpt}` : null,
      "",
      "---",
      "",
      content.content,
      "",
      `_(${content.length} characters)_`,
    ]
      .filter(Boolean)
      .join("\n");

    return { content: [{ type: "text", text }] };
  },
);

server.tool(
  "extract_links",
  "Extract all links from a page with their href and anchor text. Resolves relative URLs. Skips anchors and javascript: links.",
  {
    url: z.string().url().describe("The URL to extract links from"),
  },
  async ({ url }) => {
    const links = await extractLinks(url);
    const text =
      links.length === 0
        ? "No links found."
        : links
            .map((l, i) => `${i + 1}. [${l.text || l.href}](${l.href})`)
            .join("\n");

    return { content: [{ type: "text", text }] };
  },
);

server.tool(
  "extract_metadata",
  "Extract page metadata: title, description, Open Graph tags (og:title, og:description, og:image), canonical URL, and favicon.",
  {
    url: z.string().url().describe("The URL to extract metadata from"),
  },
  async ({ url }) => {
    const meta = await extractMetadata(url);
    const lines = [
      `**Title:** ${meta.title || "(none)"}`,
      `**Description:** ${meta.description || "(none)"}`,
      `**og:title:** ${meta.ogTitle || "(none)"}`,
      `**og:description:** ${meta.ogDescription || "(none)"}`,
      `**og:image:** ${meta.ogImage || "(none)"}`,
      `**Canonical:** ${meta.canonical || "(none)"}`,
      `**Favicon:** ${meta.favicon || "(none)"}`,
    ];
    return { content: [{ type: "text", text: lines.join("\n") }] };
  },
);

server.tool(
  "search_page",
  "Search for a query string within the page text. Returns matching lines (one per line). Use for finding mentions of a term.",
  {
    url: z.string().url().describe("The URL to search"),
    query: z.string().describe("The search query"),
  },
  async ({ url, query }) => {
    const lines = await searchPage(url, query);
    const text =
      lines.length === 0
        ? `No lines containing "${query}" found.`
        : lines.map((l, i) => `${i + 1}. ${l}`).join("\n");

    return { content: [{ type: "text", text }] };
  },
);

server.tool(
  "scrape_multiple",
  "Batch scrape multiple URLs. Returns title and excerpt for each. Failures are reported per URL without failing the whole batch.",
  {
    urls: z.array(z.string().url()).describe("Array of URLs to scrape"),
  },
  async ({ urls }) => {
    const results = await scrapeMultiple(urls);
    const lines = results.map((r, i) => {
      if (r.error) {
        return `${i + 1}. **${r.url}** — Error: ${r.error}`;
      }
      return `${i + 1}. **${r.title || "(no title)"}** — ${r.excerpt || "(no excerpt)"}\n   ${r.url}`;
    });
    return { content: [{ type: "text", text: lines.join("\n\n") }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
