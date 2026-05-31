const MAXRES_TEMPLATE = "https://i.ytimg.com/vi/{id}/maxresdefault.jpg";
const FALLBACK_TEMPLATE = "https://i.ytimg.com/vi/{id}/hqdefault.jpg";

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const videoId = extractYouTubeVideoId(tab.url || "");

    if (!videoId) {
      await showBadge("!", "#d93025");
      return;
    }

    await downloadCover(videoId);
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

async function downloadCover(videoId) {
  const maxresUrl = MAXRES_TEMPLATE.replace("{id}", videoId);
  const fallbackUrl = FALLBACK_TEMPLATE.replace("{id}", videoId);
  const coverUrl = await imageExists(maxresUrl) ? maxresUrl : fallbackUrl;

  await chrome.downloads.download({
    url: coverUrl,
    filename: `video_cover/${videoId}.jpg`,
    conflictAction: "uniquify",
    saveAs: false
  });
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
