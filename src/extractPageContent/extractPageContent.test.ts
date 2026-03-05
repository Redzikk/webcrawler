import { expect, test } from "vitest";
import extractPageData, {
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

test("should return outgoing links", () => {
  const inputBody = `<html>
    <body>
        <a href="https://crawler-test.com/siema">Go to Boot.dev</a>
    </body>
</html>`;
  const result = getURLsFromHTML(inputBody, "https://crawler-test.com");
  const expected = ["https://crawler-test.com/siema"];
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

test("extractPageData basic", () => {
  const inputURL = "https://crawler-test.com";
  const inputBody = `
      <html><body>
        <h1>Test Title</h1>
        <p>This is the first paragraph.</p>
        <a href="/link1">Link 1</a>
        <img src="/image1.jpg" alt="Image 1">
      </body></html>
    `;

  const actual = extractPageData(inputBody, inputURL);
  const expected = {
    url: "https://crawler-test.com",
    heading: "Test Title",
    first_paragraph: "This is the first paragraph.",
    outgoing_links: ["https://crawler-test.com/link1"],
    image_urls: ["https://crawler-test.com/image1.jpg"],
  };

  expect(actual).toEqual(expected);
});

test("extractPageData with p from main, and many links", () => {
  const inputURL = "https://crawler-test.com";
  const inputBody = `
        <html><body>
          <h1>Test Title</h1>
          <p>This is the first paragraph.</p>
          <main>
          <p>This is the correct paragraph.</p>
          </main>
          <a href="/link1">Link 1</a>
          <img src="/image1.jpg" alt="Image 1">
          <img src="/image2.jpg" alt="Image 2">
        </body></html>
      `;

  const actual = extractPageData(inputBody, inputURL);
  const expected = {
    url: "https://crawler-test.com",
    heading: "Test Title",
    first_paragraph: "This is the correct paragraph.",
    outgoing_links: ["https://crawler-test.com/link1"],
    image_urls: [
      "https://crawler-test.com/image1.jpg",
      "https://crawler-test.com/image2.jpg",
    ],
  };

  expect(actual).toEqual(expected);
});
