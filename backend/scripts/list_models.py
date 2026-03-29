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
  return (os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or "").strip()


def main() -> int:
  _load_env()
  key = _get_key()
  if not key:
    print("Missing API key.")
    print("Add `GEMINI_API_KEY=...` to `backend/.env` (or set GOOGLE_API_KEY).")
    return 2

  try:
    from google import genai
  except Exception as e:
    print("Missing dependency: google-genai")
    print("Install: pip install -r backend/requirements.txt")
    print(f"Import error: {e}")
    return 3

  client = genai.Client(api_key=key)

  models = []
  try:
    for m in client.models.list():
      models.append(m)
  except Exception as e:
    print("Failed to list models. This usually means the key is invalid or blocked.")
    print(f"Error: {e}")
    return 4

  def name_of(m):
    return getattr(m, "name", None) or getattr(m, "id", None) or str(m)

  def supports_of(m):
    return getattr(m, "supported_actions", None) or getattr(m, "supportedActions", None)

  models_sorted = sorted(models, key=lambda m: name_of(m))

  print("=== ALL MODELS (name + supported_actions if present) ===")
  for m in models_sorted:
    n = name_of(m)
    sa = supports_of(m)
    if sa:
      print(f"- {n}  | actions={sa}")
    else:
      print(f"- {n}")

  print("\n=== LIKELY IMAGE-RELATED MODELS (name contains 'image'/'imagen') ===")
  for m in models_sorted:
    n = name_of(m)
    if "image" in n.lower() or "imagen" in n.lower():
      sa = supports_of(m)
      if sa:
        print(f"- {n}  | actions={sa}")
      else:
        print(f"- {n}")

  return 0


if __name__ == "__main__":
  raise SystemExit(main())

