import { fetchHTML } from "./crawl/crawl";
import extractPageData from "./extractPageContent/extractPageContent";

const main = async () => {
  const url = process.argv[2];
  if (!url || process.argv.length > 3) {
    console.error("We need exact 1 URL");
    process.exit(1);
  }
  console.log("===START CRAWLING===");
  await fetchHTML(url);
  process.exit(0);
};

main();
