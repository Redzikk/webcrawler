import extractPageData from "../extractPageContent/extractPageContent";
import ConcurrentCrawler from "./ConcurrentCrawler";
import pLimit from "p-limit";

function normalizeProtocol(input: string) {
  if (!/^https?:\/\//i.test(input)) {
    return "https://" + input;
  }
  return input;
}

export const normalizeUrl = (url: string) => {
  const urlObject = new URL(normalizeProtocol(url));
  const formattedPathname = urlObject.pathname.endsWith("/")
    ? urlObject.pathname.slice(0, -1)
    : urlObject.pathname;
  return `${urlObject.origin}${formattedPathname}`;
};

export const fetchHTML = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url, {
      headers: {
        // add User-Agent to avoid being banned by servers :)
      },
    });
    if (res.status >= 400) {
      console.error("something went wrong");
      throw new Error("Something went wrong");
    }
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      console.error("response content type isn't html:", contentType);
      throw new Error("response isn't HTML");
    }
    const html = await res.text();
    return html;
  } catch (err) {
    console.log("ERROR: ", err);
    throw new Error();
  }
};

export const crawlPage = async (
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> = {},
) => {
  const normalizedUrl = normalizeUrl(currentURL);
  if (!normalizedUrl.includes(baseURL)) {
    return pages;
  }
  pages[normalizedUrl] = (pages[normalizedUrl] ?? 0) + 1;
  if (pages[normalizedUrl] > 1) {
    return pages;
  }

  try {
    console.log("CURRENT CRAWLING URL: ", normalizedUrl);
    const html = await fetchHTML(normalizedUrl);
    const extractData = extractPageData(html, normalizedUrl);
    if (extractData !== null) {
      for (const outGoingLink of extractData.outgoing_links) {
        await crawlPage(baseURL, outGoingLink, pages);
      }
    }
  } catch (err) {
    console.error(err);
  }
  return pages;
};

export const crawlPageAsync = async (
  baseURL: string,
  maxConcurrency: number,
  maxPages: number,
) => {
  const concurrentCrawler = new ConcurrentCrawler(
    baseURL,
    {},
    pLimit(maxConcurrency),
    maxPages,
  );
  const result = await concurrentCrawler.crawl();
  return result;
};
