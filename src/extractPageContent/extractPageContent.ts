import { JSDOM } from "jsdom";

export type ExtractedPageData = {
  url: string;
  heading: string;
  first_paragraph: string;
  outgoing_links: string[];
  image_urls: string[];
};

export const getHeadingFromHTML = (html: string): string => {
  if (!html) return "";
  const dom = new JSDOM(html);
  return dom.window.document.querySelector("h1")?.textContent ?? "";
};

export const getFirstParagraphFromHTML = (html: string): string => {
  if (!html) return "";
  const dom = new JSDOM(html);
  const mainParagraph =
    dom.window.document.querySelector("main p")?.textContent ?? "";
  if (mainParagraph !== "") {
    return mainParagraph;
  }
  return dom.window.document.querySelector("p")?.textContent ?? "";
};

export const getURLsFromHTML = (html: string, baseURL: string): string[] => {
  if (!html) return [];
  const dom = new JSDOM(html);
  const allLinks = Array.from(
    dom.window.document.querySelectorAll("[href], [src]"),
  )
    .map((item) => item.getAttribute("href") ?? item.getAttribute("src"))
    .filter((url): url is string => url !== null);

  const relativeUrls = allLinks.map((link) =>
    link.startsWith(baseURL) ? link : `${baseURL}${link}`,
  );
  return relativeUrls;
};

export const getOutgoingLinks = (html: string, baseURL: string): string[] => {
  if (!html) return [];
  const dom = new JSDOM(html);
  const allOutgoingLinks = [...dom.window.document.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href"))
    .filter((link) => link !== null);

  const relativeUrls = allOutgoingLinks.map((link) =>
    link.startsWith(baseURL) ? link : `${baseURL}${link}`,
  );
  return relativeUrls;
};

export const getImagesFromHTML = (html: string, baseURL: string): string[] => {
  if (!html) return [];
  const dom = new JSDOM(html);
  const allImages = Array.from(dom.window.document.querySelectorAll("img[src]"))
    .map((img) => img.getAttribute("src"))
    .filter((src): src is string => src !== null);
  const relativeUrls = allImages.map((link) =>
    link.startsWith(baseURL) ? link : `${baseURL}${link}`,
  );
  return relativeUrls;
};

export const extractPageData = (
  html: string,
  baseURL: string,
): ExtractedPageData | null => {
  if (!html) return null;

  return {
    url: baseURL,
    heading: getHeadingFromHTML(html),
    first_paragraph: getFirstParagraphFromHTML(html),
    outgoing_links: getOutgoingLinks(html, baseURL),
    image_urls: getImagesFromHTML(html, baseURL),
  };
};

export default extractPageData;
