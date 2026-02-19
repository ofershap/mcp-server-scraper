import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  scrapeUrl,
  extractLinks,
  extractMetadata,
  searchPage,
  scrapeMultiple,
} from "../src/scraper.js";

describe("scraper", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch") as ReturnType<typeof vi.spyOn>;
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  const articleHtml = `
<!DOCTYPE html>
<html>
<head><title>Test Article</title></head>
<body>
  <article>
    <h1>My Article Title</h1>
    <p>This is the excerpt of the article for testing.</p>
    <p>This is the main content with lots of text that Readability will extract. It needs enough content to be considered readable.</p>
    <p>More paragraphs help the algorithm identify the main content area.</p>
  </article>
</body>
</html>`;

  const linksHtml = `
<!DOCTYPE html>
<html>
<head><title>Links Page</title></head>
<body>
  <a href="/page1">Link 1</a>
  <a href="https://example.com/page2">Link 2</a>
  <a href="#">Skip anchor</a>
  <a href="javascript:void(0)">Skip js</a>
  <a href="/relative">Relative</a>
</body>
</html>`;

  const metadataHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
  <meta name="description" content="Page description here">
  <meta property="og:title" content="OG Title">
  <meta property="og:description" content="OG Description">
  <meta property="og:image" content="https://example.com/image.png">
  <link rel="canonical" href="https://example.com/canonical">
  <link rel="icon" href="/favicon.ico">
</head>
<body></body>
</html>`;

  const searchableHtml = `
<!DOCTYPE html>
<html>
<head><title>Search Page</title></head>
<body>
  Line one with authentication
  Line two without match
  Line three with authentication token
  Line four normal
</body>
</html>`;

  const emptyHtml = `
<!DOCTYPE html>
<html>
<head><title>Empty</title></head>
<body><div></div></body>
</html>`;

  it("scrapeUrl extracts readable content", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(articleHtml, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }),
    );

    const result = await scrapeUrl("https://example.com/article");
    expect(result.title).toContain("Article");
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.excerpt).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it("scrapeUrl throws on HTTP error", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("Not Found", { status: 404 }));

    await expect(scrapeUrl("https://example.com/404")).rejects.toThrow(
      "HTTP 404",
    );
  });

  it("scrapeUrl throws when Readability cannot extract content", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(emptyHtml, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }),
    );

    await expect(scrapeUrl("https://example.com/empty")).rejects.toThrow(
      "Could not extract readable content",
    );
  });

  it("extractLinks returns resolved links and skips anchors/javascript", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(linksHtml, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }),
    );

    const links = await extractLinks("https://example.com/links");
    expect(links).toHaveLength(3);
    expect(links.map((l) => l.href)).toEqual(
      expect.arrayContaining([
        "https://example.com/page1",
        "https://example.com/page2",
        "https://example.com/relative",
      ]),
    );
    expect(links.find((l) => l.href.includes("page1"))?.text).toBe("Link 1");
  });

  it("extractMetadata returns all meta fields", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(metadataHtml, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }),
    );

    const meta = await extractMetadata("https://example.com/meta");
    expect(meta.title).toBe("Page Title");
    expect(meta.description).toBe("Page description here");
    expect(meta.ogTitle).toBe("OG Title");
    expect(meta.ogDescription).toBe("OG Description");
    expect(meta.ogImage).toBe("https://example.com/image.png");
    expect(meta.canonical).toBe("https://example.com/canonical");
    expect(meta.favicon).toBe("/favicon.ico");
  });

  it("searchPage returns matching lines", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(searchableHtml, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }),
    );

    const lines = await searchPage(
      "https://example.com/search",
      "authentication",
    );
    expect(lines).toHaveLength(2);
    expect(lines.every((l) => l.toLowerCase().includes("authentication"))).toBe(
      true,
    );
  });

  it("scrapeMultiple returns mixed success and failure", async () => {
    fetchSpy
      .mockResolvedValueOnce(
        new Response(articleHtml, {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }),
      )
      .mockResolvedValueOnce(new Response("Not Found", { status: 404 }))
      .mockResolvedValueOnce(
        new Response(articleHtml, {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }),
      );

    const results = await scrapeMultiple([
      "https://example.com/ok1",
      "https://example.com/404",
      "https://example.com/ok2",
    ]);

    expect(results).toHaveLength(3);
    expect(results[0]?.title).toBeDefined();
    expect(results[0]?.error).toBeUndefined();
    expect(results[1]?.error).toContain("404");
    expect(results[2]?.title).toBeDefined();
  });
});
