import type { FlyerImage } from "@/contexts/CreateDesignContext";

export const FLYER_EDIT_MAX_W = 1024;
export const FLYER_EDIT_MIN_CIRCLE_R = 12;

export type FlyerLayout = { w: number; h: number };

export type FlyerCircle = { cx: number; cy: number; r: number };

export function layoutFromImage(nw: number, nh: number): FlyerLayout | null {
  if (!nw || !nh) return null;
  const w = Math.min(FLYER_EDIT_MAX_W, nw);
  const h = Math.round((w * nh) / nw);
  return { w, h };
}

export function circleFromDrag(
  start: { x: number; y: number },
  end: { x: number; y: number }
): FlyerCircle | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const r = Math.sqrt(dx * dx + dy * dy);
  if (r < FLYER_EDIT_MIN_CIRCLE_R) return null;
  return { cx: start.x, cy: start.y, r };
}

export function circleToMaskBlob(layout: FlyerLayout, circle: FlyerCircle): Promise<Blob | null> {
  const out = document.createElement("canvas");
  out.width = layout.w;
  out.height = layout.h;
  const ctx = out.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, layout.w, layout.h);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
  ctx.fill();
  return new Promise((resolve) => out.toBlob((b) => resolve(b), "image/png", 1));
}

export function cropCirclePreviewUrl(
  img: HTMLImageElement,
  layout: FlyerLayout,
  circle: FlyerCircle,
  size = 88
): string | null {
  const pad = 4;
  const x0 = Math.max(0, Math.floor(circle.cx - circle.r - pad));
  const y0 = Math.max(0, Math.floor(circle.cy - circle.r - pad));
  const x1 = Math.min(layout.w, Math.ceil(circle.cx + circle.r + pad));
  const y1 = Math.min(layout.h, Math.ceil(circle.cy + circle.r + pad));
  const sw = Math.max(1, x1 - x0);
  const sh = Math.max(1, y1 - y0);

  const src = document.createElement("canvas");
  src.width = layout.w;
  src.height = layout.h;
  const sctx = src.getContext("2d");
  if (!sctx) return null;
  sctx.drawImage(img, 0, 0, layout.w, layout.h);

  const thumb = document.createElement("canvas");
  thumb.width = size;
  thumb.height = size;
  const tctx = thumb.getContext("2d");
  if (!tctx) return null;
  tctx.save();
  tctx.beginPath();
  tctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  tctx.closePath();
  tctx.clip();
  tctx.drawImage(src, x0, y0, sw, sh, 0, 0, size, size);
  tctx.restore();
  return thumb.toDataURL("image/png");
}

export async function flyerImageToPngBlob(img: FlyerImage): Promise<Blob> {
  const binary = atob(img.base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: img.mimeType || "image/png" });
}
