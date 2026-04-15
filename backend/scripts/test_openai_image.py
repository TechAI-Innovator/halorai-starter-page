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


def main(argv: list[str]) -> int:
  _ensure_backend_on_path()
  _load_env()

  prompt = "A cinematic, premium church flyer background. Dramatic lighting. No text."
  if len(argv) >= 2:
    prompt = argv[1]

  default_out = Path(_backend_dir()) / "storage" / "ai-output-openai.png"
  output_path = Path(argv[2]) if len(argv) >= 3 else default_out

  try:
    from ai.openai_client import generate_images_base64
  except Exception as e:
    print("Failed to import ai.openai_client.")
    print(f"Error: {e}")
    return 2

  model = (os.environ.get("OPENAI_IMAGE_MODEL") or "").strip() or "gpt-image-1.5"
  try:
    images = generate_images_base64(prompt=prompt, model=model, size="1024x1536", number_of_images=1)
  except Exception as e:
    print(f"OpenAI image request failed: {e}")
    return 3

  if not images or not images[0].get("base64"):
    print("No image returned.")
    print(images)
    return 4

  b64 = images[0]["base64"]
  output_path.parent.mkdir(parents=True, exist_ok=True)
  output_path.write_bytes(base64.b64decode(b64))

  print("=== OK ===")
  print(f"model: {model}")
  print(f"saved: {output_path.resolve()}")
  return 0


if __name__ == "__main__":
  raise SystemExit(main(sys.argv))

