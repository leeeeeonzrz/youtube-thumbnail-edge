if (!globalThis.youtubeCoverDownloaderTitleReaderInstalled) {
  globalThis.youtubeCoverDownloaderTitleReaderInstalled = true;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "GET_YOUTUBE_TITLE") return false;

    waitForVideoTitle(message.videoId)
      .then((title) => sendResponse({ title }))
      .catch(() => sendResponse({ title: "" }));

    return true;
  });
}

async function waitForVideoTitle(videoId) {
  const deadline = Date.now() + 2500;

  while (Date.now() < deadline) {
    const title = readVideoTitle(videoId);
    if (title) return title;
    await delay(100);
  }

  return readVideoTitle(videoId);
}

function readVideoTitle(videoId) {
  return (
    readTitleFromVisiblePage() ||
    readTitleFromMetadata(videoId) ||
    readTitleFromDocument()
  );
}

function readTitleFromMetadata(videoId) {
  const canonicalUrl = document.querySelector('link[rel="canonical"]')?.href || "";
  const canonicalId = getVideoIdFromUrl(canonicalUrl || location.href);

  if (videoId && canonicalId && canonicalId !== videoId) return "";

  const selectors = [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    'meta[name="title"]'
  ];

  for (const selector of selectors) {
    const title = document.querySelector(selector)?.content?.trim();
    if (title) return title;
  }

  return "";
}

function getVideoIdFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).searchParams.get("v");
  } catch {
    return "";
  }
}

function readTitleFromVisiblePage() {
  const selectors = [
    "ytd-watch-metadata h1 yt-formatted-string",
    "ytd-watch-metadata h1",
    "#title h1 yt-formatted-string",
    "h1.title yt-formatted-string",
    "h1"
  ];

  for (const selector of selectors) {
    const title = document.querySelector(selector)?.textContent?.trim();
    if (title) return title;
  }

  return "";
}

function readTitleFromDocument() {
  return document.title?.trim() || "";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
