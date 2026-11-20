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


## Add content from the website

The home page includes an **Add content** form. Submissions are written to `DATA.CSV` through the server-side `/api/add_video` endpoint.

For this to work when deployed on Vercel:

1. Open the project's Vercel settings.
2. Add an environment variable named `GITHUB_TOKEN`.
3. Use a GitHub token that has **Contents: Read and write** access to `otizemlanetzag/WeTube`.
4. Redeploy the project so the function receives the new environment variable.

The token is read only by the serverless function. It is not placed in the browser code or sent back to visitors. The form accepts only video and thumbnail URLs hosted on `archive.org` or its subdomains.
