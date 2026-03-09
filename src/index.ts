import { crawlPageAsync } from "./crawl/crawl";
import { writeJSONReport } from "./report/report";

const main = async () => {
  const url = process.argv[2];
  const maxConcurrency = process.argv[3];
  const maxPages = process.argv[4];
  if (!url || process.argv.length > 5) {
    console.error("We need exact 1 URL");
    process.exit(1);
  }
  console.log("===START CRAWLING===");
  const pages = await crawlPageAsync(
    url,
    Number(maxConcurrency),
    Number(maxPages),
  );
  writeJSONReport(pages, "report.json");
  process.exit(0);
};

main();
