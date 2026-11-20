# WeTube

A lightweight video gallery that reads its entries from `DATA.CSV`.

## Adding videos

Add one row per video to `DATA.CSV`, in this exact column order:

1. `title` — text shown under the thumbnail
2. `video_url` — the video page URL or a direct video file URL
3. `image_url` — the thumbnail image URL

Example:

```csv
title,video_url,image_url
"Example video",https://www.youtube.com/watch?v=dQw4w9WgXcQ,https://example.com/thumbnail.jpg
```

Keep the first header row. Fields containing commas should be wrapped in double quotes. The gallery is displayed on `index.html`; selecting a thumbnail opens `watch.html`.
