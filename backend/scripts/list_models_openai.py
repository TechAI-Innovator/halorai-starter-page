import os
import sys


def _load_env():
  try:
    from dotenv import load_dotenv
  except Exception:
    return

  here = os.path.dirname(os.path.abspath(__file__))
  backend_dir = os.path.abspath(os.path.join(here, ".."))
  load_dotenv(os.path.join(backend_dir, ".env"), override=False)


def _get_key() -> str:
  return (os.environ.get("OPENAI_API_KEY") or "").strip()


TEXT_PREFERENCE = [
  # Prefer newest general text models first (if available on your account).
  "gpt-5.4",
  "gpt-5.4-mini",
  "gpt-5.3-chat-latest",
  "gpt-5.2-chat-latest",
  "gpt-5.1-chat-latest",
  "gpt-5-chat-latest",
  "gpt-5.4-pro",
  "gpt-5.2-pro",
  "gpt-5-pro",
  "gpt-5.4-mini-2026-03-17",
  "gpt-5.4-2026-03-05",
  "gpt-5.2-2025-12-11",
  "gpt-5-2025-08-07",
  "gpt-5-mini",
  "gpt-5-nano",
  # Safe older fallbacks
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4o",
  "gpt-4o-mini",
]

IMAGE_PREFERENCE = [
  # Image generation/editing models (these are the right ones for images).
  "gpt-image-1.5",
  "gpt-image-1",
  "gpt-image-1-mini",
  "chatgpt-image-latest",
  "dall-e-3",
  "dall-e-2",
]


def _pick(preferred: list[str], available: set[str]) -> str:
  for m in preferred:
    if m in available:
      return m
  # Fallback heuristics.
  for m in sorted(available):
    if any(k in m for k in ["gpt-image", "chatgpt-image", "gpt-5", "gpt-4", "gpt-4o"]):
      return m
  return sorted(available)[0] if available else ""


def main() -> int:
  _load_env()
  key = _get_key()
  if not key:
    print("Missing OPENAI_API_KEY.")
    print("Add `OPENAI_API_KEY=...` to `backend/.env`.")
    return 2

  try:
    from openai import OpenAI
  except Exception as e:
    print("Missing dependency: openai")
    print("Install: pip install -r backend/requirements.txt")
    print(f"Import error: {e}")
    return 3

  client = OpenAI(api_key=key)

  try:
    models = list(client.models.list())
  except Exception as e:
    print("Failed to list models. This usually means the key is invalid or blocked.")
    print(f"Error: {e}")
    return 4

  ids = []
  for m in models:
    mid = getattr(m, "id", None) or getattr(m, "name", None) or str(m)
    ids.append(str(mid))

  available = set(ids)
  best_text = _pick(TEXT_PREFERENCE, available)
  best_image = _pick(IMAGE_PREFERENCE, available)

  print("=== OPENAI MODELS (ids) ===")
  for mid in sorted(ids):
    print(f"- {mid}")

  print("\n=== RECOMMENDED (best-effort heuristics) ===")
  print(f"- best_text:  {best_text or '(none found)'}")
  print(f"- best_image: {best_image or '(none found)'}")

  print("\nTip: set in backend/.env")
  print(f"OPENAI_TEXT_MODEL={best_text or 'gpt-5.4'}")
  print(f"OPENAI_IMAGE_MODEL={best_image or 'gpt-image-1.5'}")
  return 0


if __name__ == "__main__":
  raise SystemExit(main())

