import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export interface ScrapedContent {
  title: string;
  content: string;
  excerpt: string;
  byline: string;
  siteName: string;
  length: number;
}

export interface PageMetadata {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  favicon: string;
}

export interface PageLink {
  href: string;
  text: string;
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; mcp-server-scraper/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.text();
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  const html = await fetchPage(url);
  const { document } = parseHTML(html);
  const reader = new Readability(document as unknown as Document);
  const article = reader.parse();
  if (!article) {
    throw new Error("Could not extract readable content from the page");
  }
  const textContent = article.textContent?.trim() ?? "";
  return {
    title: article.title ?? "",
    content: textContent,
    excerpt: article.excerpt ?? "",
    byline: article.byline ?? "",
    siteName: article.siteName ?? "",
    length: article.length ?? textContent.length,
  };
}

export async function extractLinks(url: string): Promise<PageLink[]> {
  const html = await fetchPage(url);
  const { document } = parseHTML(html);
  const anchors = Array.from(document.querySelectorAll("a[href]"));
  const links: PageLink[] = [];
  const baseUrl = new URL(url);
  for (const a of anchors) {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:"))
      continue;
    try {
      const resolved = new URL(href, baseUrl).href;
      links.push({ href: resolved, text: (a.textContent ?? "").trim() });
    } catch {
      // skip invalid URLs
    }
  }
  return links;
}

export async function extractMetadata(url: string): Promise<PageMetadata> {
  const html = await fetchPage(url);
  const { document } = parseHTML(html);

  const getMeta = (name: string): string => {
    const el = document.querySelector(
      `meta[property="${name}"], meta[name="${name}"]`,
    );
    return el?.getAttribute("content") ?? "";
  };

  const title = document.querySelector("title")?.textContent ?? "";
  const canonical =
    document.querySelector("link[rel='canonical']")?.getAttribute("href") ?? "";
  const favicon =
    document
      .querySelector("link[rel='icon'], link[rel='shortcut icon']")
      ?.getAttribute("href") ?? "";

  return {
    title,
    description: getMeta("description"),
    ogTitle: getMeta("og:title"),
    ogDescription: getMeta("og:description"),
    ogImage: getMeta("og:image"),
    canonical,
    favicon,
  };
}

export async function searchPage(
  url: string,
  query: string,
): Promise<string[]> {
  const html = await fetchPage(url);
  const { document } = parseHTML(html);
  const text = document.body?.textContent ?? "";
  const lines = text
    .split("\n")
    .map((l: string) => l.trim())
    .filter(Boolean);
  const queryLower = query.toLowerCase();
  return lines.filter((line: string) =>
    line.toLowerCase().includes(queryLower),
  );
}

export async function scrapeMultiple(
  urls: string[],
): Promise<{ url: string; title: string; excerpt: string; error?: string }[]> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const content = await scrapeUrl(url);
      return {
        url,
        title: content.title,
        excerpt: content.excerpt,
      };
    }),
  );
  return results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    return {
      url: urls[i] ?? "",
      title: "",
      excerpt: "",
      error: String((r.reason as Error).message),
    };
  });
}
