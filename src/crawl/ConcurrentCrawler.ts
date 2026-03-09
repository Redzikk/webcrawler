import pLimit from "p-limit";
import { normalizeUrl } from "./crawl";
import extractPageData, {
  ExtractedPageData,
} from "../extractPageContent/extractPageContent";

export default class ConcurrentCrawler {
  baseURL;
  pages;
  limit;
  maxPages;
  shouldStop = false;
  allTasks: Set<Promise<void>> = new Set();
  constructor(
    baseURL: string,
    pages: Record<string, ExtractedPageData>,
    limit: ReturnType<typeof pLimit>,
    maxPages: number,
  ) {
    this.maxPages = maxPages;
    this.baseURL = baseURL;
    this.pages = pages;
    this.limit = limit;
  }

  private addPageVisit(normalizedUrl: string): boolean {
    if (this.shouldStop) {
      return false;
    }
    if (
      !this.pages[normalizedUrl] &&
      this.maxPages <= Object.keys(this.pages).length
    ) {
      this.shouldStop = true;
      console.log("Reached maximum number of pages to crawl.");
      return false;
    }
    if (!this.pages[normalizedUrl]) {
      this.pages[normalizedUrl] = {
        url: normalizedUrl,
        heading: "",
        first_paragraph: "",
        outgoing_links: [],
        image_urls: [],
      };
    }
    return true;
  }

  private async fetchHTML(url: string): Promise<string> {
    return await this.limit(async () => {
      try {
        const res = await fetch(url, {
          headers: {
            // add User-Agent to avoid being banned by servers :)
            "User-Agent": "BootCrawler/1.0",
          },
        });
        if (res.status >= 400) {
          console.error("error: ", url);
          throw new Error("error: " + url + " " + res.status);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("text/html")) {
          console.error("response content type isn't html:", contentType);
          throw new Error("response isn't HTML");
        }
        return res.text();
      } catch (err) {
        console.log("ERROR: ", err);
        throw new Error();
      }
    });
  }

  async crawl() {
    await this.crawlPage(this.baseURL);
    return this.pages;
  }

  private async crawlPage(currentURL: string): Promise<void> {
    if (this.shouldStop) {
      return;
    }
    const normalizedUrl = normalizeUrl(currentURL);
    if (!normalizedUrl.includes(this.baseURL)) {
      return;
    }

    if (!this.addPageVisit(normalizedUrl)) {
      return;
    }
    try {
      const html = await this.fetchHTML(normalizedUrl);
      if (html === "") {
        return;
      }
      const extractData = extractPageData(html, normalizedUrl);
      if (extractData !== null) {
        this.pages[normalizedUrl] = extractData;
        await Promise.all(
          extractData.outgoing_links.map((link) => {
            const task = this.crawlPage(link).finally(() =>
              this.allTasks.delete(task),
            );
            this.allTasks.add(task);
            return task;
          }),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}
