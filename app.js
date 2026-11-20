// DATA.CSV columns: title,video URL,thumbnail image URL
function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"' && quoted && next === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell.trim()); cell = "";
      if (row.some(value => value !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some(value => value !== "")) rows.push(row);
  return rows;
}

function isHeader(row) {
  return /title|name/i.test(row[0] || "") &&
    /video|url|link/i.test(row[1] || "") &&
    /image|thumb|photo/i.test(row[2] || "");
}

async function loadVideos() {
  const grid = document.getElementById("video-grid");
  try {
    const response = await fetch("DATA.CSV", { cache: "no-store" });
    if (!response.ok) throw new Error("DATA.CSV could not be loaded.");
    const rows = parseCSV((await response.text()).replace(/^\uFEFF/, ""));
    if (rows.length && isHeader(rows[0])) rows.shift();
    const videos = rows
      .filter(row => row.length >= 3 && row[0] && row[1] && row[2])
      .map(row => ({ title: row[0], url: row[1], image: row[2] }));
    grid.replaceChildren();
    if (!videos.length) {
      grid.innerHTML = '<p class="empty">No videos yet. Add entries to DATA.CSV to show them here.</p>';
      return;
    }
    for (const video of videos) {
      const card = document.createElement("a");
      card.className = "video-card";
      card.href = "watch.html?video=" + encodeURIComponent(video.url) +
        "&title=" + encodeURIComponent(video.title);
      const image = document.createElement("img");
      image.src = video.image;
      image.alt = video.title;
      image.loading = "lazy";
      image.onerror = () => { image.style.visibility = "hidden"; };
      const title = document.createElement("h2");
      title.textContent = video.title;
      card.append(image, title);
      grid.append(card);
    }
  } catch (error) {
    grid.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty";
    message.textContent = error.message;
    grid.append(message);
  }
}
loadVideos();