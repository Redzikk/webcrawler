import { describe, expect, it } from "vitest";
import { normalizeUrl } from "./crawl";

describe("Normalize URL function", () => {
  const testCases = [
    "https://www.xyz.dev/blog/path/",
    "https://www.xyz.dev/blog/path",
    "www.xyz.dev/blog/path",
    "www.xyz.dev/blog/path?q1=dwad",
  ];

  it("should return same output for every testCase", () => {
    const output = "https://www.xyz.dev/blog/path";
    for (const tCase of testCases) {
      expect(normalizeUrl(tCase)).toEqual(output);
    }
  });
});
