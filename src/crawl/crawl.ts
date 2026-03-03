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
