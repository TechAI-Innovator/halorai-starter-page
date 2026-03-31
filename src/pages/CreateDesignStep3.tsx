import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import CreateDesignHero from "@/components/CreateDesignHero";
import StepperProgress from "@/components/StepperProgress";
import { useCreateDesign } from "@/contexts/CreateDesignContext";
import { aiGenerateText } from "@/lib/api";
import ArcLoader from "@/components/ArcLoader";

const CreateDesignStep3 = () => {
  const navigate = useNavigate();
  const { eventDetails, concepts, setConcepts, conceptsKey, setConceptsKey, selectedConceptId, setSelectedConceptId } =
    useCreateDesign();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");

  const theme = eventDetails.theme?.trim() || "";
  const eventName = eventDetails.eventName?.trim() || "";
  const desiredKey = useMemo(() => `${theme}||${eventName}`.trim(), [eventName, theme]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!theme) {
        // If user skipped theme, we can't generate; keep empty and let them go back.
        setConcepts([]);
        setSelectedConceptId(null);
        return;
      }

      // If we already generated for this exact input, don't re-run.
      if (concepts.length === 3 && conceptsKey === desiredKey) {
        if (!selectedConceptId) setSelectedConceptId(concepts[0]?.id ?? 1);
        return;
      }

      setError("");
      setIsAnalyzing(true);
      setConcepts([]);
      setSelectedConceptId(null);

      const prompt = [
        "You are a creative director for church event flyers.",
        "Use simple, clear English. Keep sentences short. Avoid big or complex words.",
        `Theme: ${JSON.stringify(theme)}`,
        eventName ? `Event name: ${JSON.stringify(eventName)}` : "",
        "",
        "Generate EXACTLY 3 distinct background image concepts for a flyer.",
        "Each concept should be a single vivid sentence describing the background scene (no text overlays, no logos).",
        "Return STRICT JSON ONLY in this schema:",
        '[{"label":"Concept 1","description":"..."},{"label":"Concept 2","description":"..."},{"label":"Concept 3","description":"..."}]',
      ]
        .filter(Boolean)
        .join("\n");

      try {
        const res = await aiGenerateText(prompt);
        if (cancelled) return;

        const txt = (res.text || "").trim();
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(txt);
        } catch {
          parsed = null;
        }

        const asConceptArray = (value: unknown): Array<{ label?: unknown; description?: unknown; text?: unknown }> => {
          if (!Array.isArray(value)) return [];
          return value.filter((v) => v !== null && typeof v === "object") as Array<{
            label?: unknown;
            description?: unknown;
            text?: unknown;
          }>;
        };

        const next =
          asConceptArray(parsed).length
            ? asConceptArray(parsed)
                .slice(0, 3)
                .map((c, idx: number) => ({
                  id: idx + 1,
                  label: String((c.label as string | undefined) || `Concept ${idx + 1}`),
                  description: String((c.description as string | undefined) || (c.text as string | undefined) || "").trim(),
                }))
                .filter((c) => c.description)
            : txt
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean)
                .slice(0, 3)
                .map((line, idx) => ({
                  id: idx + 1,
                  label: `Concept ${idx + 1}`,
                  description: line.replace(/^[-*\d.)\s]+/, "").trim(),
                }))
                .filter((c) => c.description);

        // Ensure exactly 3 items (best-effort).
        const filled = [...next];
        while (filled.length < 3) {
          filled.push({
            id: filled.length + 1,
            label: `Concept ${filled.length + 1}`,
            description: "A premium, modern abstract background that matches the theme mood.",
          });
        }

        setConceptsKey(desiredKey);
        setConcepts(filled.slice(0, 3));
        setSelectedConceptId(filled[0]?.id ?? 1);
      } catch (e: unknown) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Failed to generate concepts.";
        setError(msg);
      } finally {
        if (!cancelled) setIsAnalyzing(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // We intentionally re-run if theme/eventName changes.
  }, [
    concepts,
    conceptsKey,
    desiredKey,
    eventName,
    setConcepts,
    setConceptsKey,
    setSelectedConceptId,
    selectedConceptId,
    theme,
  ]);

  const selected = selectedConceptId ?? concepts[0]?.id ?? null;

  return (
    <AppLayout>
      <CreateDesignHero title="Create Design" />
      <StepperProgress currentStep={3} />

      <div className="px-4 xs:px-0">
        <div className="border border-[hsl(0,0%,80%)] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[0.54fr_1fr] gap-y-8 md:gap-x-6">

            {/* Left Column */}
            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-semibold text-[hsl(0,0%,10%)] mb-1">
                Background Concept
              </h2>
              <p className="text-sm text-[hsl(0,0%,55%)] mb-8 max-w-[280px]">
                Please Pick a concept from the suggestions or enter your preferred concept
              </p>

              {/* Analyzing theme image */}
              <div className="flex items-start justify-start mt-8">
                <div className="ml-2 md:ml-4">
                  <ArcLoader size={180} label={isAnalyzing ? "Analyzing..." : "Ready"} spinning={isAnalyzing} spinDurationMs={2600} />
                </div>
              </div>
            </div>

            {/* Right Column - Concept Cards */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {error ? (
                  <div className="w-full md:max-w-[440px] border border-[hsl(0,0%,85%)] bg-[hsl(0,0%,97%)] rounded-2xl p-5 text-sm text-[hsl(0,0%,40%)]">
                    {error}
                  </div>
                ) : null}

                {!isAnalyzing
                  ? concepts.map((concept) => (
                      <button
                        key={concept.id}
                        onClick={() => setSelectedConceptId(concept.id)}
                        className={`w-full md:max-w-[440px] text-left border rounded-2xl p-5 cursor-pointer transition-all duration-150 ease-out ${
                          selected === concept.id
                            ? "border-[hsl(330,100%,85%)] shadow-[0_0_0_1px_hsl(330,100%,85%)] bg-[hsl(0,0%,100%)]"
                            : "bg-[hsl(0,0%,95%)] border-[hsl(0,0%,85%)] hover:border-[hsl(0,0%,70%)]"
                        }`}
                      >
                        <span
                          className={`inline-block text-sm font-medium px-3 py-1.5 rounded-full mb-4 ${
                            selected === concept.id
                              ? "bg-[hsl(330,100%,93%)] text-[hsl(0,0%,10%)]"
                              : "bg-white text-[hsl(0,0%,10%)]"
                          }`}
                        >
                          {concept.label}
                        </span>
                        <p className="text-sm text-[hsl(0,0%,40%)]">{concept.description}</p>
                      </button>
                    ))
                  : null}
              </div>

              {/* Navigation Buttons (kept under right column) */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => navigate("/create-design/step-2")}
                  className="flex items-center gap-2 bg-[hsl(0,0%,95%)] text-[hsl(0,0%,10%)] rounded-full px-4 py-3 text-xs font-medium cursor-pointer transition-all duration-150 ease-out hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <img
                    src="/Halorai Dev/Icons/weui_arrow-outlined.svg"
                    alt="Back"
                    className="w-3.5 h-3.5 brightness-0"
                  />
                  Go back
                </button>
                <button
                  onClick={() => navigate("/create-design/step-4")}
                  disabled={isAnalyzing || !selected}
                  className={`flex items-center gap-2 border-none rounded-full px-4 py-3 text-xs font-medium transition-all duration-150 ease-out hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] ${
                    isAnalyzing || !selected
                      ? "bg-[hsl(0,0%,60%)] text-white cursor-not-allowed"
                      : "bg-[hsl(0,0%,10%)] text-white cursor-pointer hover:bg-[hsl(0,0%,20%)]"
                  }`}
                >
                  Continue
                  <img
                    src="/Halorai Dev/Icons/weui_arrow-outlined-forward.svg"
                    alt="Forward"
                    className="w-3.5 h-3.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateDesignStep3;
