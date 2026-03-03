import { expect, test } from "vitest";
import {
  getFirstParagraphFromHTML,
  getHeadingFromHTML,
} from "./extractPageContent";

test("should get H1 from HTML basic", () => {
  const inputBody = `<html><body><h1>Test Title</h1></body></html>`;
  const actualBody = getHeadingFromHTML(inputBody);
  expect(actualBody).toStrictEqual("Test Title");
});

test("should get first paragraph from main", () => {
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>
  `;
  const result = getFirstParagraphFromHTML(inputBody);
  expect(result).toEqual("Main paragraph.");
});

test("should fallback to first paragraph if there is no P in main section", () => {
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <div>ok</div>
      </main>
    </body></html>
  `;
  const result = getFirstParagraphFromHTML(inputBody);
  expect(result).toEqual("Outside paragraph.");
});

test("should return empty string if there isn't any html", () => {
  const inputBody = "";
  const result = getFirstParagraphFromHTML(inputBody);
  expect(result).toEqual("");
});
