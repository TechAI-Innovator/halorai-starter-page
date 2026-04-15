import os
import sys


def _backend_dir() -> str:
  here = os.path.dirname(os.path.abspath(__file__))
  return os.path.abspath(os.path.join(here, ".."))


def _ensure_backend_on_path() -> None:
  # Running `python scripts/test_openai_text.py` puts `scripts/` on sys.path, not `backend/`.
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
  prompt = "Generate 3 flyer background concepts for theme: 'Resilience'. Use simple English."
  if len(argv) >= 2:
    prompt = argv[1]

  try:
    from ai.openai_client import generate_text
  except Exception as e:
    print("Failed to import ai.openai_client.")
    print(f"Error: {e}")
    return 2

  model = (os.environ.get("OPENAI_TEXT_MODEL") or "").strip() or "gpt-5.4"
  try:
    out = generate_text(prompt=prompt, model=model)
  except Exception as e:
    print(f"OpenAI text request failed: {e}")
    return 3

  print("=== OK ===")
  print(f"model: {model}")
  print(out)
  return 0


if __name__ == "__main__":
  raise SystemExit(main(sys.argv))

