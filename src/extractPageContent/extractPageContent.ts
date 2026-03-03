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
