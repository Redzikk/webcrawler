Concurrent Crawler

This is a concurrent crawler that crawls a website and extracts the data from the pages.

Usage:

```bash
npm run start <url> <maxConcurrency> <maxPages>
```

example:

```bash
npm run start "https://sandbox.oxylabs.io/products" 2 20
```

This will crawl the website https://sandbox.oxylabs.io/products with a maximum concurrency of 2 and a maximum number of pages of 20.

report.json will be created in the root of the project.
