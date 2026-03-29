import base64
import json
import os
import sys
import urllib.request
from pathlib import Path


def _post_json(url: str, payload: dict) -> dict:
  body = json.dumps(payload).encode("utf-8")
  req = urllib.request.Request(
    url,
    data=body,
    headers={"Content-Type": "application/json"},
    method="POST",
  )
  with urllib.request.urlopen(req, timeout=240) as resp:
    raw = resp.read().decode("utf-8")
  return json.loads(raw)


def _guess_mime(path: Path) -> str:
  ext = path.suffix.lower()
  if ext in (".jpg", ".jpeg"):
    return "image/jpeg"
  if ext == ".png":
    return "image/png"
  if ext == ".webp":
    return "image/webp"
  return "application/octet-stream"


def main(argv: list[str]) -> int:
  if len(argv) < 2:
    print("Usage: python backend/scripts/test_ai_image_recreate.py <image_path> [prompt] [output_path]")
    return 2

  image_path = Path(argv[1]).expanduser()
  prompt = (
    argv[2]
    if len(argv) >= 3
    else "Recreate this as a clean 9:16 event flyer. Keep the person consistent, improve colors and lighting, add premium modern style. Do NOT add any text."
  )
  output_path = Path(argv[3]) if len(argv) >= 4 else Path("backend/storage/ai-output.png")

  if not image_path.exists():
    print(f"File not found: {image_path}")
    return 3

  url = os.environ.get("AI_IMAGE_URL") or "http://localhost:5000/api/ai/image/recreate"
  model = os.environ.get("AI_IMAGE_MODEL") or "models/gemini-3.1-flash-image-preview"

  img_bytes = image_path.read_bytes()
  b64 = base64.b64encode(img_bytes).decode("ascii")
  mime = _guess_mime(image_path)

  try:
    out = _post_json(
      url,
      {
        "prompt": prompt,
        "model": model,
        "aspectRatio": "9:16",
        "numberOfImages": 1,
        "referenceImages": [{"mimeType": mime, "base64": b64}],
      },
    )
  except Exception as e:
    print(f"Request failed: {e}")
    print("Make sure the backend is running: python backend/app.py")
    return 4

  images = out.get("images") or []
  if not images:
    print("No images returned. Full response:")
    print(json.dumps(out, indent=2))
    return 5

  first = images[0]
  out_b64 = (first.get("base64") or "").strip()
  out_mime = first.get("mimeType") or "image/png"
  if not out_b64:
    print("Image returned but base64 was empty. Full response:")
    print(json.dumps(out, indent=2))
    return 6

  output_path.parent.mkdir(parents=True, exist_ok=True)
  output_path.write_bytes(base64.b64decode(out_b64))

  print("Saved generated image:")
  print(f"- output: {output_path.resolve()}")
  print(f"- mimeType: {out_mime}")
  print(f"- model: {out.get('model')}")
  return 0


if __name__ == "__main__":
  raise SystemExit(main(sys.argv))

