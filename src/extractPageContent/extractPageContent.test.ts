import { expect, test } from "vitest";
import {
  getFirstParagraphFromHTML,
  getHeadingFromHTML,
  getImagesFromHTML,
  getURLsFromHTML,
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

test("should return all urls in html", () => {
  const inputBody = `<html>
        <body>
            <a href="https://crawler-test.com">Go to Boot.dev</a>
            <img src="/logo.png" alt="Boot.dev Logo" />
        </body>
    </html>`;
  const result = getURLsFromHTML(inputBody, "https://crawler-test.com");
  const expected = [
    "https://crawler-test.com",
    "https://crawler-test.com/logo.png",
  ];
  expect(result).toEqual(expected);
});

test("should find link from href", () => {
  const inputBody = `<html>
    <body>
        <a href="https://crawler-test.com">Go to Boot.dev</a>
    </body>
</html>`;
  const result = getURLsFromHTML(inputBody, "https://crawler-test.com");
  const expected = ["https://crawler-test.com"];
  expect(result).toEqual(expected);
});

test("should return src links from images", () => {
  const inputBody = `<html>
        <body>
            <img src="https://crawler-test.com/image.png">Go to Boot.dev</img>
            <img src="/crawler-test/image.png">Go to Boot.dev</img>
        </body>
    </html>`;
  const result = getImagesFromHTML(inputBody, "https://crawler-test.com");
  const expected = [
    "https://crawler-test.com/image.png",
    "https://crawler-test.com/crawler-test/image.png",
  ];
  expect(result).toEqual(expected);
});
