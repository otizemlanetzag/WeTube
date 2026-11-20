# WeTube

A lightweight video gallery that reads its entries from `DATA.CSV`.

## Adding videos

Add one row per video to `DATA.CSV`, in this exact column order:

1. `title` — text shown under the thumbnail
2. `video_url` — the video page URL or a direct video file URL
3. `image_url` — the thumbnail image URL

steps:
* host your video on [internet archive](https://archive.org)
* go to the vieos page
* find the "download mp4" link
* click on it
* you will be redirected to a page with the video - copy its URL
* paste the URL in DATA.CSV file and add video name and info 

Keep the first header row. Fields containing commas should be wrapped in double quotes. The gallery is displayed on `index.html`; selecting a thumbnail opens `watch.html`.

# IMPORTANT! ONLY REAL PUBLIC DOMAIN CONTENT IS ALOWED. USING URLS FROM SITES EXCEPT INTERNET ARCHIVE OR CONTENT FROM THE ARCHIVE THAT ISN'T TRULY IN THE PUBLIC DOMAIN - WILL BE REMOVED WHEN WE NOTICE IT.
