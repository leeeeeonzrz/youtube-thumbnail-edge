const MAXRES_TEMPLATE = "https://i.ytimg.com/vi/{id}/maxresdefault.jpg";
const FALLBACK_TEMPLATE = "https://i.ytimg.com/vi/{id}/hqdefault.jpg";
const pendingFilenamesByUrl = new Map();
const pendingDownloadIds = new Set();

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  const downloadUrl = downloadItem.finalUrl || downloadItem.url;
  const filename = pendingFilenamesByUrl.get(downloadUrl);

  if (!filename) return;

  pendingDownloadIds.add(downloadItem.id);
  suggest({
    filename,
    conflictAction: "uniquify"
  });
});

chrome.downloads.onChanged.addListener((delta) => {
  if (!pendingDownloadIds.has(delta.id)) return;
  if (!delta.state || !["complete", "interrupted"].includes(delta.state.current)) return;

  pendingDownloadIds.delete(delta.id);
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const videoId = extractYouTubeVideoId(tab.url || "");

    if (!videoId) {
      await showBadge("!", "#d93025");
      return;
    }

    const title = await getCurrentPageTitle(tab.id, tab.title || "");
    await downloadCover(videoId, title);
    await showBadge("OK", "#188038");
  } catch (error) {
    await showBadge("ERR", "#d93025");
  }
});

function extractYouTubeVideoId(rawUrl) {
  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    const watchId = url.searchParams.get("v");
    if (isLikelyVideoId(watchId)) return watchId;

    const pathMatch = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/);
    if (pathMatch && isLikelyVideoId(pathMatch[1])) return pathMatch[1];
  }

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (isLikelyVideoId(id)) return id;
  }

  return null;
}

function isLikelyVideoId(value) {
  return /^[a-zA-Z0-9_-]{6,}$/.test(value || "");
}

async function getCurrentPageTitle(tabId, fallbackTitle) {
  if (!tabId) return fallbackTitle;

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: readYouTubeTitleFromPage
    });

    return results?.[0]?.result || fallbackTitle;
  } catch {
    return fallbackTitle;
  }
}

function readYouTubeTitleFromPage() {
  const selectors = [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    'meta[name="title"]'
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector)?.content?.trim();
    if (content) return content;
  }

  const titleElement = document.querySelector(
    "h1.ytd-watch-metadata yt-formatted-string, h1 yt-formatted-string, h1"
  );
  const titleText = titleElement?.textContent?.trim();

  return titleText || document.title || "";
}

async function downloadCover(videoId, rawTitle) {
  const maxresUrl = MAXRES_TEMPLATE.replace("{id}", videoId);
  const fallbackUrl = FALLBACK_TEMPLATE.replace("{id}", videoId);
  const coverUrl = await imageExists(maxresUrl) ? maxresUrl : fallbackUrl;
  const filename = `video_cover/${buildCoverFilename(rawTitle, videoId)}.jpg`;

  pendingFilenamesByUrl.set(coverUrl, filename);

  try {
    await chrome.downloads.download({
      url: coverUrl,
      filename,
      conflictAction: "uniquify",
      saveAs: false
    });
  } finally {
    setTimeout(() => pendingFilenamesByUrl.delete(coverUrl), 30000);
  }
}

function buildCoverFilename(rawTitle, fallbackId) {
  const title = (rawTitle || "")
    .replace(/\s+-\s+YouTube(?:\s+Music)?$/i, "")
    .trim();

  const safeTitle = sanitizeFilename(title);
  return safeTitle || fallbackId;
}

function sanitizeFilename(value) {
  const filename = value
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim()
    .slice(0, 160);

  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(filename)) {
    return `${filename}_`;
  }

  return filename;
}

async function imageExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok && (response.headers.get("content-type") || "").startsWith("image/");
  } catch {
    return false;
  }
}

async function showBadge(text, color) {
  await chrome.action.setBadgeBackgroundColor({ color });
  await chrome.action.setBadgeText({ text });
  setTimeout(() => chrome.action.setBadgeText({ text: "" }), 1800);
}
