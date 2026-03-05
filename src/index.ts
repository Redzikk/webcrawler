import { crawlPage } from "./crawl/crawl";

const main = async () => {
  const url = process.argv[2];
  if (!url || process.argv.length > 3) {
    console.error("We need exact 1 URL");
    process.exit(1);
  }
  console.log("===START CRAWLING===");
  await crawlPage(url);
  process.exit(0);
};

main();
