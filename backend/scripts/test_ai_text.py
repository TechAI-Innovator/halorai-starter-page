import json
import os
import sys
import urllib.request


def _post_json(url: str, payload: dict) -> dict:
  body = json.dumps(payload).encode("utf-8")
  req = urllib.request.Request(
    url,
    data=body,
    headers={"Content-Type": "application/json"},
    method="POST",
  )
  with urllib.request.urlopen(req, timeout=120) as resp:
    raw = resp.read().decode("utf-8")
  return json.loads(raw)


def main(argv: list[str]) -> int:
  prompt = "Generate 3 flyer concepts for theme: 'Flames of Fire'. Return JSON array of 3 items with title + short_description + color_palette."
  if len(argv) >= 2:
    prompt = argv[1]

  url = os.environ.get("AI_TEXT_URL") or "http://localhost:5000/api/ai/text"
  model = os.environ.get("AI_TEXT_MODEL") or "models/gemini-3.1-pro-preview"

  try:
    out = _post_json(url, {"prompt": prompt, "model": model})
  except Exception as e:
    print(f"Request failed: {e}")
    print("Make sure the backend is running: python backend/app.py")
    return 2

  print(json.dumps(out, indent=2))
  return 0


if __name__ == "__main__":
  raise SystemExit(main(sys.argv))

