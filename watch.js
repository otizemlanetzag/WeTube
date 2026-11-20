const params = new URLSearchParams(location.search);
const videoUrl = params.get("video");
const title = params.get("title") || "Video";
const player = document.getElementById("player");
document.getElementById("video-title").textContent = title;
document.title = title + " — WeTube";

function showError(message) {
  player.replaceChildren();
  const error = document.getElementById("watch-error");
  error.hidden = false;
  error.textContent = message;
}

function getEmbedUrl(raw) {
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ? "https://www.youtube.com/embed/" + encodeURIComponent(id) : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = url.searchParams.get("v");
    if (id) return "https://www.youtube.com/embed/" + encodeURIComponent(id);
    const match = url.pathname.match(/^\/(embed|shorts)\/([^/]+)/);
    if (match) return "https://www.youtube.com/embed/" + encodeURIComponent(match[2]);
  }
  if (host === "vimeo.com") {
    const id = url.pathname.match(/\/(\d+)/)?.[1];
    if (id) return "https://player.vimeo.com/video/" + id;
  }
  return url.href;
}

if (!videoUrl) {
  showError("No video link was provided. Return to the video gallery and choose a video.");
} else {
  const safeUrl = getEmbedUrl(videoUrl);
  if (!safeUrl) {
    showError("This video link is invalid or uses an unsupported URL scheme.");
  } else {
    const path = new URL(safeUrl).pathname.toLowerCase();
    if (/\.(mp4|webm|ogg|ogv|mov|m4v)$/.test(path)) {
      const video = document.createElement("video");
      video.src = safeUrl;
      video.controls = true;
      video.autoplay = false;
      video.playsInline = true;
      player.replaceChildren(video);
    } else {
      const frame = document.createElement("iframe");
      frame.src = safeUrl;
      frame.title = title;
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      player.replaceChildren(frame);
    }
  }
}