import { JSDOM } from "jsdom";

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
