import { useCallback, useEffect, useRef, useState } from "react";
import type { FlyerImage } from "@/contexts/CreateDesignContext";
import { pickSingleImageFile } from "@/lib/singleImagePick";
import {
  circleFromDrag,
  circleToMaskBlob,
  cropCirclePreviewUrl,
  layoutFromImage,
  type FlyerCircle,
  type FlyerLayout,
} from "@/lib/flyerEditGeometry";

export type PendingFlyerRegion = {
  circle: FlyerCircle;
  layout: FlyerLayout;
  maskBlob: Blob;
  previewUrl: string;
  prompt: string;
  referenceImage: File | null;
};

type Props = {
  flyerImage: FlyerImage;
  resetKey: string;
  circleMode: boolean;
  disabled?: boolean;
  onAddRegion: (region: PendingFlyerRegion) => void;
};

export default function FlyerEditCanvas({ flyerImage, resetKey, circleMode, disabled, onAddRegion }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [layout, setLayout] = useState<FlyerLayout | null>(null);
  const [draftCircle, setDraftCircle] = useState<FlyerCircle | null>(null);
  const [popup, setPopup] = useState<{
    circle: FlyerCircle;
    layout: FlyerLayout;
    maskBlob: Blob;
    previewUrl: string;
    left: number;
    top: number;
  } | null>(null);
  const [popupPrompt, setPopupPrompt] = useState("");
  const [popupRef, setPopupRef] = useState<File | null>(null);
  const [popupRefPreviewUrl, setPopupRefPreviewUrl] = useState<string | null>(null);
  const popupInsertRef = useRef<HTMLInputElement | null>(null);
  const popupRefUrlRef = useRef<string | null>(null);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dataUrl = `data:${flyerImage.mimeType};base64,${flyerImage.base64}`;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setLayout(layoutFromImage(img.naturalWidth, img.naturalHeight));
    };
    img.src = dataUrl;
  }, [dataUrl, resetKey]);

  useEffect(() => {
    setDraftCircle(null);
    setPopup(null);
    setPopupPrompt("");
    setPopupRef(null);
    if (popupRefUrlRef.current) {
      URL.revokeObjectURL(popupRefUrlRef.current);
      popupRefUrlRef.current = null;
    }
    setPopupRefPreviewUrl(null);
  }, [resetKey, circleMode]);

  const toCanvasPoint = useCallback(
    (e: React.PointerEvent, el: HTMLElement) => {
      if (!layout) return null;
      const rect = el.getBoundingClientRect();
      const scaleX = layout.w / rect.width;
      const scaleY = layout.h / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    [layout]
  );

  const closePopup = useCallback(() => {
    setPopup(null);
    setPopupPrompt("");
    setPopupRef(null);
    if (popupRefUrlRef.current) {
      URL.revokeObjectURL(popupRefUrlRef.current);
      popupRefUrlRef.current = null;
    }
    setPopupRefPreviewUrl(null);
    setDraftCircle(null);
    if (popupInsertRef.current) popupInsertRef.current.value = "";
  }, []);

  const openPopupForCircle = useCallback(
    async (circle: FlyerCircle) => {
      const img = imgRef.current;
      if (!img || !layout || !containerRef.current) return;
      const previewUrl = cropCirclePreviewUrl(img, layout, circle);
      const maskBlob = await circleToMaskBlob(layout, circle);
      if (!previewUrl || !maskBlob) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = rect.width / layout.w;
      const scaleY = rect.height / layout.h;
      const left = Math.min(
        Math.max(8, circle.cx * scaleX - 8),
        rect.width - 280
      );
      const top = Math.min(
        Math.max(8, (circle.cy - circle.r) * scaleY - 8),
        rect.height - 200
      );

      setPopup({ circle, layout, maskBlob, previewUrl, left, top });
      setPopupPrompt("");
      setPopupRef(null);
    },
    [layout]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!circleMode || disabled || !layout || popup) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = toCanvasPoint(e, e.currentTarget);
    if (!pt) return;
    dragStart.current = pt;
    drawing.current = true;
    setDraftCircle({ cx: pt.x, cy: pt.y, r: 0 });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !dragStart.current || !layout) return;
    const pt = toCanvasPoint(e, e.currentTarget);
    if (!pt) return;
    const circle = circleFromDrag(dragStart.current, pt);
    setDraftCircle(circle ?? { cx: dragStart.current.x, cy: dragStart.current.y, r: 0 });
  };

  const onPointerUp = async (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (!drawing.current || !dragStart.current) return;
    drawing.current = false;
    const pt = toCanvasPoint(e, e.currentTarget);
    const start = dragStart.current;
    dragStart.current = null;
    if (!pt) {
      setDraftCircle(null);
      return;
    }
    const circle = circleFromDrag(start, pt);
    setDraftCircle(null);
    if (!circle) return;
    await openPopupForCircle(circle);
  };

  const handleAddRequest = () => {
    if (!popup || !popupPrompt.trim()) return;
    onAddRegion({
      circle: popup.circle,
      layout: popup.layout,
      maskBlob: popup.maskBlob,
      previewUrl: popup.previewUrl,
      prompt: popupPrompt.trim(),
      referenceImage: popupRef,
    });
    closePopup();
  };

  if (!layout) return null;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {circleMode ? (
        <canvas
          width={layout.w}
          height={layout.h}
          className="pointer-events-auto absolute inset-0 h-full w-full touch-none"
          style={{ cursor: disabled ? "not-allowed" : "crosshair" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      ) : null}

      {draftCircle && circleMode && !popup ? (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${layout.w} ${layout.h}`} preserveAspectRatio="none">
          <circle
            cx={draftCircle.cx}
            cy={draftCircle.cy}
            r={Math.max(draftCircle.r, 1)}
            fill="none"
            stroke="hsl(210,100%,55%)"
            strokeWidth={Math.max(2, layout.w / 400)}
            strokeDasharray="6 4"
          />
        </svg>
      ) : null}

      {popup ? (
        <div
          className="pointer-events-auto absolute z-30 w-[min(100%,17.5rem)] rounded-2xl border border-[hsl(0,0%,90%)] bg-white p-3 shadow-lg"
          style={{ left: popup.left, top: popup.top }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {popupRefPreviewUrl ? (
            <div className="relative mb-2 inline-flex shrink-0 self-start">
              <img
                src={popupRefPreviewUrl}
                alt=""
                className="h-8 w-8 rounded-lg border border-[hsl(0,0%,88%)] object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPopupRef(null);
                  if (popupRefUrlRef.current) {
                    URL.revokeObjectURL(popupRefUrlRef.current);
                    popupRefUrlRef.current = null;
                  }
                  setPopupRefPreviewUrl(null);
                  if (popupInsertRef.current) popupInsertRef.current.value = "";
                }}
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-none bg-[hsl(15,100%,55%)]"
                aria-label="Remove image"
              >
                <img src="/Halorai Dev/Icons/cancel.svg" alt="" className="h-3 w-3 brightness-0 invert" />
              </button>
            </div>
          ) : null}
          <textarea
            value={popupPrompt}
            onChange={(e) => setPopupPrompt(e.target.value)}

            rows={2}
            placeholder="Describe what to change in this area…"
            className="mb-2 min-h-[2.75rem] w-full resize-none border-none bg-transparent text-sm text-[hsl(0,0%,10%)] outline-none placeholder:text-[hsl(0,0%,55%)]"
          />
          <input
            ref={popupInsertRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = pickSingleImageFile(e.target.files);
              e.target.value = "";
              if (!f) return;
              if (popupRefUrlRef.current) URL.revokeObjectURL(popupRefUrlRef.current);
              const url = URL.createObjectURL(f);
              popupRefUrlRef.current = url;
              setPopupRefPreviewUrl(url);
              setPopupRef(f);
            }}
          />
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              title="Insert reference image"
              onClick={() => popupInsertRef.current?.click()}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-[hsl(0,0%,96%)] hover:bg-[hsl(0,0%,92%)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88583 21.3658 3.76 20.24C2.63417 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63417 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0938 2.00916 15.15 2.00916C16.2062 2.00916 17.2194 2.42975 17.97 3.18C18.7202 3.93063 19.1408 4.94382 19.1408 6C19.1408 7.05618 18.7202 8.06937 17.97 8.82L9.37 17.42C8.99469 17.7953 8.48809 18.0056 7.96 18.0056C7.43191 18.0056 6.92531 17.7953 6.55 17.42C6.17469 17.0447 5.96438 16.5381 5.96438 16.01C5.96438 15.4819 6.17469 14.9753 6.55 14.6L15.07 6.1"
                  stroke="hsl(0,0%,20%)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              disabled={!popupPrompt.trim()}
              onClick={handleAddRequest}
              className="rounded-full border-none bg-[hsl(0,0%,10%)] px-4 py-2 text-xs font-medium text-white hover:bg-[hsl(0,0%,25%)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add Request
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
