import { writeFileSync } from "fs";
import { ExtractedPageData } from "../extractPageContent/extractPageContent";
import * as path from "path";

export const writeJSONReport = (
  pageData: Record<string, ExtractedPageData>,
  filename = "report.json",
) => {
  const sorted = Object.values(pageData).sort((a, b) =>
    a.url.localeCompare(b.url),
  );
  const resolvePath = path.resolve(process.cwd(), filename);
  writeFileSync(resolvePath, JSON.stringify(sorted, null, 2));
};
