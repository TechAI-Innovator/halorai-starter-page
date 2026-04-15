"""
Edit an existing image with OpenAI (Images API: edit).

Usage (from backend/):
  python scripts/test_openai_image_edit.py <image_path> [prompt] [output_path]

Example:
  python scripts/test_openai_image_edit.py ./storage/sample.png "Warm cinematic lighting, keep composition"
"""
import base64
import os
import sys
from pathlib import Path


def _backend_dir() -> str:
  here = os.path.dirname(os.path.abspath(__file__))
  return os.path.abspath(os.path.join(here, ".."))


def _ensure_backend_on_path() -> None:
  bd = _backend_dir()
  if bd not in sys.path:
    sys.path.insert(0, bd)


def _load_env():
  try:
    from dotenv import load_dotenv
  except Exception:
    return
  load_dotenv(os.path.join(_backend_dir(), ".env"), override=False)


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
  _ensure_backend_on_path()
  _load_env()

  if len(argv) < 2:
    print("Usage: python scripts/test_openai_image_edit.py <image_path> [prompt] [output_path]")
    print("Example: python scripts/test_openai_image_edit.py ./photo.jpg \"Add soft golden hour light, no text\"")
    return 2

  image_path = Path(argv[1]).expanduser().resolve()
  prompt = (
    argv[2]
    if len(argv) >= 3
    else "Improve colors and lighting while keeping the subject and layout. Do not add text."
  )
  default_out = Path(_backend_dir()) / "storage" / "ai-edit-openai.png"
  output_path = Path(argv[3]).expanduser() if len(argv) >= 4 else default_out

  if not image_path.exists():
    print(f"File not found: {image_path}")
    return 3

  try:
    from ai.openai_client import recreate_image_base64
  except Exception as e:
    print("Failed to import ai.openai_client.")
    print(f"Error: {e}")
    return 4

  img_bytes = image_path.read_bytes()
  mime = _guess_mime(image_path)
  b64 = base64.b64encode(img_bytes).decode("ascii")

  model = (os.environ.get("OPENAI_IMAGE_MODEL") or "").strip() or "gpt-image-1.5"
  try:
    images = recreate_image_base64(
      prompt=prompt,
      model=model,
      reference_images=[{"mimeType": mime, "base64": b64}],
      number_of_images=1,
    )
  except Exception as e:
    print(f"OpenAI image edit failed: {e}")
    return 5

  if not images or not images[0].get("base64"):
    print("No image returned.")
    print(images)
    return 6

  out_b64 = images[0]["base64"]
  output_path.parent.mkdir(parents=True, exist_ok=True)
  output_path.write_bytes(base64.b64decode(out_b64))

  print("=== OK (edit) ===")
  print(f"model: {model}")
  print(f"input:  {image_path}")
  print(f"output: {output_path.resolve()}")
  return 0


if __name__ == "__main__":
  raise SystemExit(main(sys.argv))
