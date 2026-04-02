import os
import json
import logging
import time
import re

from flask import Blueprint, jsonify, request, g

from .gemini_client import generate_flyer_image_base64, generate_images_base64, generate_text, recreate_image_base64
from .templates import MAX_MINISTERS, pick_template_image


ai_bp = Blueprint("ai", __name__)

DEFAULT_TEXT_MODEL = os.environ.get("AI_TEXT_MODEL") or "models/gemini-3.1-pro-preview"
# "Nano Banana 2" in your model list maps to Gemini 3.1 Flash Image (fast, production-oriented).
DEFAULT_IMAGE_MODEL = os.environ.get("AI_IMAGE_MODEL") or "models/gemini-3.1-flash-image-preview"
DEFAULT_FLYER_MODEL = os.environ.get("AI_FLYER_MODEL") or DEFAULT_IMAGE_MODEL

ai_logger = logging.getLogger("ai")


def _json_error(message: str, status: int = 400):
  return jsonify({"error": message}), status


def _preview_text(s: str, limit: int = 320) -> str:
  s = (s or "").replace("\r\n", "\n").replace("\r", "\n")
  s = " ".join(s.split())  # collapse whitespace for single-line logs
  if len(s) <= limit:
    return s
  return s[:limit] + "…"


def _rid() -> str:
  return str(getattr(g, "request_id", "") or "")


def _guess_mime(filename: str) -> str:
  ext = os.path.splitext(filename or "")[1].lower()
  if ext in [".jpg", ".jpeg"]:
    return "image/jpeg"
  if ext == ".png":
    return "image/png"
  if ext == ".webp":
    return "image/webp"
  return "application/octet-stream"


def _ai_exception_to_http(e: Exception) -> tuple[int, str]:
  """
  Convert bulky provider errors into a user-friendly message + HTTP status.
  Full details are still logged server-side for debugging.
  """
  raw = str(e) or e.__class__.__name__
  low = raw.lower()

  # Quota / rate limit.
  if (
    "resource_exhausted" in low
    or "exceeded your current quota" in low
    or "rate limit" in low
    or re.search(r"\b429\b", low)
  ):
    return 429, "AI limit reached right now. Please wait a bit and try again."

  # Auth / billing / key issues.
  if ("api key" in low and ("invalid" in low or "missing" in low)) or re.search(r"\b401\b|\b403\b", low):
    return 401, "AI is not configured correctly (missing/invalid API key)."

  # Timeouts.
  if "timeout" in low or "deadline exceeded" in low:
    return 504, "AI took too long to respond. Please try again."

  return 500, "AI request failed. Please try again."


@ai_bp.post("/api/ai/text")
def ai_text():
  payload = request.get_json(silent=True) or {}
  prompt = payload.get("prompt", "")
  model = payload.get("model") or DEFAULT_TEXT_MODEL

  t0 = time.perf_counter()
  try:
    print(
      f"[AI][{_rid()}] /api/ai/text -> model={model} promptPreview={_preview_text(str(prompt), 180)!r}",
      flush=True,
    )
  except Exception:
    pass

  try:
    text = generate_text(prompt=prompt, model=model)
  except ValueError as e:
    return _json_error(str(e), 400)
  except Exception as e:
    status, msg = _ai_exception_to_http(e)
    ai_logger.exception(
      json.dumps(
        {
          "type": "ai_error",
          "endpoint": "/api/ai/text",
          "requestId": getattr(g, "request_id", None),
          "model": model,
          "error": str(e),
        },
        ensure_ascii=False,
      )
    )
    return _json_error(msg, status)

  t_ms = int((time.perf_counter() - t0) * 1000)
  try:
    print(
      f"[AI][{_rid()}] /api/ai/text <- ok {t_ms}ms chars={len(text or '')} preview={_preview_text(text or '', 200)!r}",
      flush=True,
    )
  except Exception:
    pass

  # Log a small preview of what the model returned.
  ai_logger.info(
    json.dumps(
      {
        "type": "ai_response",
        "endpoint": "/api/ai/text",
        "requestId": getattr(g, "request_id", None),
        "model": model,
        "chars": len(text or ""),
        "preview": _preview_text(text or ""),
      },
      ensure_ascii=False,
    )
  )

  return jsonify({"model": model, "text": text})


@ai_bp.post("/api/ai/image")
def ai_image():
  payload = request.get_json(silent=True) or {}
  prompt = payload.get("prompt", "")
  model = payload.get("model") or DEFAULT_IMAGE_MODEL
  aspect_ratio = payload.get("aspectRatio")
  number_of_images = payload.get("numberOfImages", 1)
  reference_images = payload.get("referenceImages") or payload.get("images") or []

  try:
    if reference_images:
      images = recreate_image_base64(
        prompt=prompt,
        model=model,
        reference_images=reference_images,
        aspect_ratio=aspect_ratio,
        number_of_images=number_of_images,
      )
    else:
      images = generate_images_base64(
        prompt=prompt,
        model=model,
        aspect_ratio=aspect_ratio,
        number_of_images=number_of_images,
      )
  except ValueError as e:
    return _json_error(str(e), 400)
  except Exception as e:
    status, msg = _ai_exception_to_http(e)
    ai_logger.exception(
      json.dumps(
        {
          "type": "ai_error",
          "endpoint": "/api/ai/image",
          "requestId": getattr(g, "request_id", None),
          "model": model,
          "error": str(e),
        },
        ensure_ascii=False,
      )
    )
    return _json_error(msg, status)

  first = images[0] if images else None
  if first:
    b64 = (first.get("base64") or "")
    ai_logger.info(
      json.dumps(
        {
          "type": "ai_response",
          "endpoint": "/api/ai/image",
          "requestId": getattr(g, "request_id", None),
          "model": model,
          "mimeType": first.get("mimeType"),
          "base64Len": len(b64),
          "base64Prefix": b64[:48],
        },
        ensure_ascii=False,
      )
    )

  return jsonify({"model": model, "images": images})


@ai_bp.post("/api/ai/image/recreate")
def ai_image_recreate():
  payload = request.get_json(silent=True) or {}
  prompt = payload.get("prompt", "")
  model = payload.get("model") or DEFAULT_IMAGE_MODEL
  aspect_ratio = payload.get("aspectRatio")
  number_of_images = payload.get("numberOfImages", 1)
  reference_images = payload.get("referenceImages") or payload.get("images") or []

  try:
    images = recreate_image_base64(
      prompt=prompt,
      model=model,
      reference_images=reference_images,
      aspect_ratio=aspect_ratio,
      number_of_images=number_of_images,
    )
  except ValueError as e:
    return _json_error(str(e), 400)
  except Exception as e:
    status, msg = _ai_exception_to_http(e)
    ai_logger.exception(
      json.dumps(
        {
          "type": "ai_error",
          "endpoint": "/api/ai/image/recreate",
          "requestId": getattr(g, "request_id", None),
          "model": model,
          "error": str(e),
        },
        ensure_ascii=False,
      )
    )
    return _json_error(msg, status)

  first = images[0] if images else None
  if first:
    b64 = (first.get("base64") or "")
    ai_logger.info(
      json.dumps(
        {
          "type": "ai_response",
          "endpoint": "/api/ai/image/recreate",
          "requestId": getattr(g, "request_id", None),
          "model": model,
          "mimeType": first.get("mimeType"),
          "base64Len": len(b64),
          "base64Prefix": b64[:48],
        },
        ensure_ascii=False,
      )
    )

  return jsonify({"model": model, "images": images})


@ai_bp.post("/api/ai/generate")
def ai_generate():
  payload = request.get_json(silent=True) or {}
  kind = (payload.get("type") or payload.get("mode") or "text").strip().lower()

  if kind in ("text", "txt"):
    # Delegate to text handler logic.
    prompt = payload.get("prompt", "")
    model = payload.get("model") or DEFAULT_TEXT_MODEL
    try:
      text = generate_text(prompt=prompt, model=model)
    except ValueError as e:
      return _json_error(str(e), 400)
    except Exception as e:
      status, msg = _ai_exception_to_http(e)
      ai_logger.exception(
        json.dumps(
          {
            "type": "ai_error",
            "endpoint": "/api/ai/generate",
            "requestId": getattr(g, "request_id", None),
            "model": model,
            "mode": "text",
            "error": str(e),
          },
          ensure_ascii=False,
        )
      )
      return _json_error(msg, status)
    return jsonify({"type": "text", "model": model, "text": text})

  if kind in ("image", "img", "images"):
    prompt = payload.get("prompt", "")
    model = payload.get("model") or DEFAULT_IMAGE_MODEL
    aspect_ratio = payload.get("aspectRatio")
    number_of_images = payload.get("numberOfImages", 1)
    reference_images = payload.get("referenceImages") or payload.get("images") or []
    try:
      if reference_images:
        images = recreate_image_base64(
          prompt=prompt,
          model=model,
          reference_images=reference_images,
          aspect_ratio=aspect_ratio,
          number_of_images=number_of_images,
        )
      else:
        images = generate_images_base64(
          prompt=prompt,
          model=model,
          aspect_ratio=aspect_ratio,
          number_of_images=number_of_images,
        )
    except ValueError as e:
      return _json_error(str(e), 400)
    except Exception as e:
      status, msg = _ai_exception_to_http(e)
      ai_logger.exception(
        json.dumps(
          {
            "type": "ai_error",
            "endpoint": "/api/ai/generate",
            "requestId": getattr(g, "request_id", None),
            "model": model,
            "mode": "image",
            "error": str(e),
          },
          ensure_ascii=False,
        )
      )
      return _json_error(msg, status)
    return jsonify({"type": "image", "model": model, "images": images})

  return _json_error('Invalid type. Use "text" or "image".', 400)


@ai_bp.post("/api/ai/flyer")
def ai_flyer():
  """
  Multipart form endpoint.

  Fields:
  - eventDetails: JSON string
  - concept: string (optional)
  - ministersMeta: JSON string of [{name,title}, ...] aligned with ministers[] files order
  - message: string (optional; edit instructions)

  Files:
  - logos: multiple image files (0-2)
  - ministers: multiple image files
  """
  try:
    event_details_raw = request.form.get("eventDetails", "") or ""
    event_details = json.loads(event_details_raw) if event_details_raw else {}
  except Exception:
    return _json_error("Invalid eventDetails JSON", 400)

  concept = (request.form.get("concept", "") or "").strip()
  message = (request.form.get("message", "") or "").strip()
  model = (request.form.get("model", "") or "").strip() or DEFAULT_FLYER_MODEL

  try:
    ministers_meta_raw = request.form.get("ministersMeta", "") or ""
    ministers_meta = json.loads(ministers_meta_raw) if ministers_meta_raw else []
    if not isinstance(ministers_meta, list):
      ministers_meta = []
  except Exception:
    ministers_meta = []

  logos_files = request.files.getlist("logos")
  minister_files = request.files.getlist("ministers")
  minister_count = len(minister_files)

  if minister_count > MAX_MINISTERS:
    return _json_error(f"Too many ministers. Max allowed is {MAX_MINISTERS}.", 400)

  # Validation: if minister images were uploaded, each must have a title in ministersMeta.
  if minister_count > 0:
    if not isinstance(ministers_meta, list) or len(ministers_meta) != minister_count:
      return _json_error("ministersMeta must include name/title for each uploaded minister image.", 400)

    for i, meta in enumerate(ministers_meta):
      if not isinstance(meta, dict):
        return _json_error(f"Invalid ministersMeta at index {i}.", 400)
      title = (meta.get("title") or "").strip()
      if not title:
        return _json_error(f"Missing Title/Role for minister {i+1}.", 400)

  try:
    template_path, bucket = pick_template_image(minister_count)
    template_bytes = template_path.read_bytes()
    template_mime = _guess_mime(template_path.name)
  except Exception as e:
    return _json_error(str(e), 500)

  # Build prompt (simple English).
  church = (event_details.get("churchName") or "").strip()
  event_name = (event_details.get("eventName") or "").strip()
  theme = (event_details.get("theme") or "").strip()
  date = (event_details.get("date") or "").strip()
  event_time = (event_details.get("time") or "").strip()
  venue = (event_details.get("venue") or "").strip()
  other = (event_details.get("otherInfo") or "").strip()

  ministers_lines = []
  for i, meta in enumerate(ministers_meta[: len(minister_files)]):
    if not isinstance(meta, dict):
      continue
    name = (meta.get("name") or "").strip()
    title = (meta.get("title") or "").strip()
    if name and title:
      ministers_lines.append(f"- Minister {i+1}: {name} ({title})")
    elif name:
      ministers_lines.append(f"- Minister {i+1}: {name}")

  prompt_lines = [
    "Flyer Builder Prompt",
    "",
    "You are editing an existing flyer template using new inputs.",
    "You are NOT designing from scratch.",
    "",
    "GOAL:",
    "Recreate the reference flyer with very high visual similarity in layout, structure, and style.",
    "",
    "INPUTS:",
    "- Event details (title, date, time, venue, theme, other info)",
    "- Uploaded minister images (if any)",
    "- Uploaded logos (if any)",
    "- Background concept",
    "- Reference flyer template (first reference image)",
    "",
    "CORE RULE:",
    "The template layout is locked. Only replace content.",
    "",
    "----------------------------------",
    "",
    "WHAT TO PRESERVE (STRICT):",
    "- Layout and composition",
    "- Element positions and spacing",
    "- Typography style and hierarchy (same font style and emphasis)",
    "- Color grading and lighting",
    "- Effects (glow, shadows, overlays)",
    "",
    "----------------------------------",
    "",
    "WHAT TO REPLACE:",
    "",
    "1. Background",
    "- Replace the background subject/scene using the selected concept.",
    "- Match the same lighting, depth, and cinematic style as the template.",
    "",
    "2. Title and event text",
    "- Replace ALL text with the user-provided text below.",
    "- Keep the same font style, size, and placement from the template.",
    "- Text must be spelled exactly as provided (no paraphrasing).",
    "",
    "3. Minister Images",
    "- Use ONLY the uploaded minister photos.",
    "- Do NOT invent faces. Do NOT merge faces.",
    "- Match the template cropping and framing for each minister slot.",
    "- Apply the same lighting and color grading as the template so they fit naturally.",
    "",
    "4. Logos (if provided)",
    "- Place naturally based on the template style.",
    "- Maintain proper scale and clarity.",
    "",
    "----------------------------------",
    "",
    "CONSISTENCY RULE:",
    "All elements must match the same lighting, color tone, contrast, and atmosphere.",
    "",
    "----------------------------------",
    "",
    "STRICT RULES:",
    "- Do NOT change layout.",
    "- Do NOT add new elements.",
    "- Do NOT add any text that was not provided below.",
    "- Do NOT leave any template text or faces in the final output.",
    "- Do NOT add watermarks.",
    "",
    "----------------------------------",
    "",
    "VALIDATION BEFORE OUTPUT:",
    "- All text matches user input exactly.",
    "- No extra or missing elements.",
    "- No template faces or text remain.",
    "- Layout matches reference structure.",
    "",
    "If any rule fails, regenerate correctly.",
    "",
    "PRIORITY:",
    "1. Match template layout",
    "2. Use correct user content",
    "3. Maintain visual consistency",
    "4. Then enhance quality",
    "",
    "OUTPUT:",
    "- Single clean flyer image, aspect ratio 9:16.",
    "",
    "----------------------------------",
    "",
    "USER CONTENT (use exactly):",
    f"- Church/Ministry: {church}" if church else None,
    f"- Event name: {event_name}" if event_name else None,
    f"- Theme: {theme}" if theme else None,
    f"- Date: {date}" if date else None,
    f"- Time: {event_time}" if event_time else None,
    f"- Venue: {venue}" if venue else None,
    f"- Other info: {other}" if other else None,
    "",
    "Ministers (use uploaded photos only):",
    *ministers_lines,
    "",
    f"Background concept: {concept}" if concept else None,
    "",
    message and f"Edit instructions (only if provided): {message}",
  ]
  # Keep prompt tidy (no empty/None lines).
  prompt = "\n".join([l for l in prompt_lines if isinstance(l, str) and l.strip()])

  # Reference images order matters: template first, then logos, then ministers.
  refs: list[tuple[bytes, str]] = [(template_bytes, template_mime)]
  for f in logos_files:
    data = f.read()
    if data:
      refs.append((data, _guess_mime(f.filename)))
  for f in minister_files:
    data = f.read()
    if data:
      refs.append((data, _guess_mime(f.filename)))

  t0 = time.perf_counter()
  try:
    print(
      f"[AI][{_rid()}] /api/ai/flyer -> model={model} templateBucket={bucket} logos={len(logos_files)} ministers={minister_count} messageChars={len(message)} promptPreview={_preview_text(prompt, 180)!r}",
      flush=True,
    )
  except Exception:
    pass

  try:
    images = generate_flyer_image_base64(prompt=prompt, model=model, reference_images_bytes=refs, aspect_ratio="9:16", number_of_images=1)
  except Exception as e:
    status, msg = _ai_exception_to_http(e)
    ai_logger.exception(
      json.dumps(
        {
          "type": "ai_error",
          "endpoint": "/api/ai/flyer",
          "requestId": getattr(g, "request_id", None),
          "model": model,
          "templateBucket": bucket,
          "error": str(e),
        },
        ensure_ascii=False,
      )
    )
    return _json_error(msg, status)

  t_ms = int((time.perf_counter() - t0) * 1000)
  first = images[0] if images else None
  if first:
    b64 = (first.get("base64") or "")
    try:
      print(
        f"[AI][{_rid()}] /api/ai/flyer <- ok {t_ms}ms mimeType={first.get('mimeType')} base64Len={len(b64)}",
        flush=True,
      )
    except Exception:
      pass
    ai_logger.info(
      json.dumps(
        {
          "type": "ai_response",
          "endpoint": "/api/ai/flyer",
          "requestId": getattr(g, "request_id", None),
          "model": model,
          "templateBucket": bucket,
          "templateFile": template_path.name,
          "mimeType": first.get("mimeType"),
          "base64Len": len(b64),
          "base64Prefix": b64[:48],
        },
        ensure_ascii=False,
      )
    )

  return jsonify(
    {
      "model": model,
      "template": {"bucket": bucket, "file": template_path.name},
      "images": images,
    }
  )

