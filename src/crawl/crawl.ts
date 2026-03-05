function normalizeProtocol(input: string) {
  if (!/^https?:\/\//i.test(input)) {
    return "https://" + input;
  }
  return input;
}

export const normalizeUrl = (url: string) => {
  const urlObject = new URL(normalizeProtocol(url));
  const formattedPathname = urlObject.pathname.endsWith("/")
    ? urlObject.pathname.slice(0, -1)
    : urlObject.pathname;
  return `${urlObject.hostname}${formattedPathname}`;
};

export const fetchHTML = async (url: string) => {
  try {
    const res = await fetch(url, {
      headers: {
        // add User-Agent to avoid being banned by servers :)
      },
    });
    if (res.status >= 400) {
      console.error("something went wrong");
      return;
    }
    if (res.headers.get("content-type") !== "text/html") {
      console.error("response content type isn't html");
      return;
    }
    console.log(await res.text());
  } catch (err) {
    console.log("ERROR: ", err);
    return;
  }
};
