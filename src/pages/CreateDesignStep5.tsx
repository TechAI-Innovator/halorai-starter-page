import { useCallback, useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import CreateDesignHero from "@/components/CreateDesignHero";
import StepperProgress from "@/components/StepperProgress";
import { useCreateDesign } from "@/contexts/CreateDesignContext";
import { aiGenerateFlyer } from "@/lib/api";
import { downloadFlyer } from "@/lib/downloadFlyer";
import ArcLoader from "@/components/ArcLoader";

const CreateDesignStep5 = () => {
  const [message, setMessage] = useState("");
  const hasMessage = message.trim().length > 0;
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<string>("");
  const [flyer, setFlyer] = useState<{ mimeType: string; base64: string } | null>(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { eventDetails, logos, ministers, concepts, selectedConceptId } = useCreateDesign();
  const selectedConcept = useMemo(() => concepts.find((c) => c.id === selectedConceptId) || concepts[0], [concepts, selectedConceptId]);
  const conceptDescription = selectedConcept?.description || "";
  const filenameBase = useMemo(() => {
    return eventDetails.eventName?.trim() || eventDetails.theme?.trim() || "flyer";
  }, [eventDetails.eventName, eventDetails.theme]);

  const canGenerate = useMemo(() => {
    const requiredStep1Ok =
      !!eventDetails.churchName?.trim() &&
      !!eventDetails.date?.trim() &&
      !!eventDetails.time?.trim() &&
      !!eventDetails.venue?.trim() &&
      !!eventDetails.theme?.trim();

    const step3Ok = !!conceptDescription.trim() && (selectedConceptId != null || concepts.length > 0);
    return requiredStep1Ok && step3Ok;
  }, [conceptDescription, concepts.length, eventDetails, selectedConceptId]);

  const generateFlyer = useCallback(async () => {
    if (!canGenerate) {
      setIsPreparing(false);
      setFlyer(null);
      setError("Missing required info. Please go back to Step 1 and Step 3 to complete your details and pick a concept.");
      return;
    }

    setError("");
    setFlyer(null);
    setIsPreparing(true);

    try {
      const res = await aiGenerateFlyer({
        eventDetails,
        concept: conceptDescription,
        ministersMeta: ministers.map((m) => ({ name: m.name, title: m.title })),
        logos: logos.map((l) => l.file),
        ministers: ministers.map((m) => m.avatar.file),
      });
      const first = res.images?.[0];
      if (!first?.base64) {
        setError("AI returned no image. Please retry.");
        return;
      }
      setFlyer(first);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate flyer.";
      setError(msg);
    } finally {
      setIsPreparing(false);
    }
  }, [canGenerate, conceptDescription, eventDetails, logos, ministers]);

  useEffect(() => {
    void generateFlyer();
  }, [generateFlyer]);

  const handleDownload = async (format: "png" | "jpg" | "pdf") => {
    if (!flyer) return;
    setIsDownloadOpen(false);
    setIsDownloading(true);
    try {
      await downloadFlyer({ flyer, filenameBase, format });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AppLayout>
      <CreateDesignHero title="Create Design" />
      <StepperProgress currentStep={5} />

      <div className="px-4 xs:px-0">
        <div className="border border-[hsl(0,0%,80%)] rounded-2xl p-6 md:p-8">

          <div className="grid grid-cols-1 md:grid-cols-[0.35fr_0.45fr_0.35fr] gap-6 md:gap-4">
            {/* Left Column - Analysing theme */}
            <div className=" items-center justify-center">
              <h2 className="text-lg md:text-xl font-semibold text-[hsl(0,0%,10%)] mb-6">
                Preparing Your Design
              </h2>

              <div className="my-20 pl-4">
                <ArcLoader
                  size={220}
                  label={
                    isPreparing ? (
                      <img src="/Halorai Dev/Images/checkmark.svg" alt="Preparing" className="w-6 h-6" />
                    ) : canGenerate ? (
                      "Ready"
                    ) : (
                      "Missing info"
                    )
                  }
                  spinning={isPreparing}
                  spinDurationMs={3200}
                />
              </div>
            </div>

            {/* Middle Column - Design Preview */}
            <div className="flex items-center justify-center">
              {flyer ? (
                <img
                  src={`data:${flyer.mimeType};base64,${flyer.base64}`}
                  alt="Design Preview"
                  className="w-full max-w-[280px] h-auto rounded-xl object-contain"
                />
              ) : (
                <div className="w-full max-w-[280px] aspect-[9/16] rounded-xl bg-transparent" aria-label="Design preview loading" />
              )}
            </div>

            {/* Right Column - Chat/Edit input + Buttons */}
            <div className="flex flex-col items-center h-full md:justify-center">
              <div className="w-full max-w-[420px] bg-[hsl(0,0%,97%)] border border-[hsl(0,0%,95%)] rounded-2xl p-4 flex flex-col min-h-[240px]">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Put the logo on the right hand, and Remove the..."
                  className="flex-1 w-full resize-none border-none outline-none text-sm text-[hsl(0,0%,10%)] placeholder:text-[hsl(0,0%,65%)] bg-transparent"
                />
                <div className="flex justify-end mt-2">
                  <button
                    disabled={!canGenerate}
                    className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors border-none ${
                      hasMessage
                        ? "bg-[hsl(25,100%,35%)] hover:bg-[hsl(25,100%,30%)]"
                        : "bg-[hsl(0,0%,60%)] hover:bg-[hsl(0,0%,55%)]"
                    }`}
                  >
                    <img src="/Halorai Dev/Icons/send Vector.svg" alt="Send" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {error ? (
                <div className="w-full max-w-[420px] mt-3">
                  <div className="text-xs text-[hsl(15,100%,45%)]">{error}</div>
                  {canGenerate ? (
                    <button
                      onClick={() => void generateFlyer()}
                      className="mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium bg-[hsl(0,0%,10%)] text-white hover:bg-[hsl(0,0%,20%)] transition-colors border-none"
                    >
                      Retry
                    </button>
                  ) : null}
                </div>
              ) : null}

              <div className="w-full max-w-[420px] flex items-center gap-4 mt-4">
                <button
                  disabled={!canGenerate}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-full px-6 py-3 text-sm font-regular transition-colors ${
                    !canGenerate
                      ? "bg-[hsl(0,0%,97%)] border-[hsl(0,0%,95%)] text-[hsl(0,0%,40%)] cursor-not-allowed"
                      : "bg-[hsl(0,0%,97%)] border-[hsl(0,0%,95%)] text-[hsl(0,0%,10%)] cursor-pointer hover:border-[hsl(0,0%,60%)]"
                  }`}
                >
                  <img src="/Halorai Dev/Icons/lucide_edit-3.svg" alt="Edit" className="w-4 h-4" />
                  Edit
                </button>
                <div className="flex-1 relative">
                  <button
                    disabled={!canGenerate || !flyer || isDownloading}
                    onClick={() => setIsDownloadOpen((v) => !v)}
                    className={`w-full flex items-center justify-center gap-2 border-none rounded-full px-6 py-3 text-sm font-regular transition-colors ${
                      !canGenerate || !flyer || isDownloading
                        ? "bg-[hsl(0,0%,60%)] text-white cursor-not-allowed"
                        : "bg-[hsl(0,0%,10%)] text-white cursor-pointer hover:bg-[hsl(0,0%,20%)]"
                    }`}
                  >
                    {isDownloading ? "Preparing..." : "Download"}
                    <img
                      src="/Halorai Dev/Icons/weui_arrow-outlined-forward.svg"
                      alt="Forward"
                      className="w-4 h-4 pl-1"
                    />
                  </button>

                  {isDownloadOpen && flyer ? (
                    <div className="absolute right-0 mt-2 w-full bg-white border border-[hsl(0,0%,90%)] rounded-2xl shadow-lg p-2 z-20">
                      <button
                        onClick={() => void handleDownload("png")}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-[hsl(0,0%,10%)] hover:bg-[hsl(0,0%,97%)] transition-colors"
                      >
                        PNG
                      </button>
                      <button
                        onClick={() => void handleDownload("jpg")}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-[hsl(0,0%,10%)] hover:bg-[hsl(0,0%,97%)] transition-colors"
                      >
                        JPG
                      </button>
                      <button
                        onClick={() => void handleDownload("pdf")}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-[hsl(0,0%,10%)] hover:bg-[hsl(0,0%,97%)] transition-colors"
                      >
                        PDF (clear view)
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateDesignStep5;
