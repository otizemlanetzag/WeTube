import os
import json
import base64
import csv
import io
import urllib.request
import urllib.error
from http.server import BaseHTTPRequestHandler

OWNER = "otizemlanetzag"
REPO = "WeTube"
BRANCH = "main"
DATA_PATH = "DATA.CSV"
API_ROOT = f"https://api.github.com/repos/{OWNER}/{REPO}/contents"

def archive_url(value):
    from urllib.parse import urlparse
    try:
        parsed = urlparse(value.strip())
        host = (parsed.hostname or "").lower()
        return parsed.scheme in ("http", "https") and (host == "archive.org" or host.endswith(".archive.org"))
    except Exception:
        return False

def github_request(url, token, method="GET", payload=None):
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=body,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            "User-Agent": "WeTube"
        }
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", "replace")
        raise RuntimeError(f"GitHub API error ({error.code}): {detail[:500]}")

class handler(BaseHTTPRequestHandler):
    def send_json(self, status, data):
        raw = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_POST(self):
        token = os.environ.get("GITHUB_TOKEN")
        if not token:
            return self.send_json(500, {"error": "The server is missing the GITHUB_TOKEN environment variable."})

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 20000:
                return self.send_json(400, {"error": "Invalid request body."})
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            title = str(data.get("title", "")).strip()
            video_url = str(data.get("video_url", "")).strip()
            image_url = str(data.get("image_url", "")).strip()

            if not title or len(title) > 200:
                return self.send_json(400, {"error": "Enter a title of up to 200 characters."})
            if not archive_url(video_url):
                return self.send_json(400, {"error": "The video link must be hosted by archive.org."})
            if not archive_url(image_url):
                return self.send_json(400, {"error": "The image link must be hosted by archive.org."})

            file_url = f"{API_ROOT}/{DATA_PATH}?ref={BRANCH}"
            current = github_request(file_url, token)
            old_bytes = base64.b64decode(current["content"])
            old_text = old_bytes.decode("utf-8-sig")
            rows = list(csv.reader(io.StringIO(old_text)))
            if not rows:
                rows = [["title", "video_url", "image_url"]]
            if [x.strip().lower() for x in rows[0][:3]] != ["title", "video_url", "image_url"]:
                return self.send_json(500, {"error": "DATA.CSV must begin with title,video_url,image_url."})

            rows.append([title, video_url, image_url])
            output = io.StringIO(newline="")
            writer = csv.writer(output, lineterminator="\n")
            writer.writerows(rows)
            new_content = base64.b64encode(output.getvalue().encode("utf-8")).decode("ascii")
            updated = github_request(file_url, token, "PUT", {
                "message": f"Add video: {title[:60]}",
                "content": new_content,
                "sha": current["sha"],
                "branch": BRANCH
            })
            return self.send_json(200, {"ok": True, "commit": updated.get("commit", {}).get("sha")})
        except json.JSONDecodeError:
            return self.send_json(400, {"error": "The submitted form data is not valid JSON."})
        except Exception as error:
            return self.send_json(500, {"error": str(error)})

    def do_GET(self):
        self.send_json(405, {"error": "Use POST to add content."})

    def log_message(self, format, *args):
        return
