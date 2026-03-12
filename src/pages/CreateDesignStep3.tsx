import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import CreateDesignHero from "@/components/CreateDesignHero";
import StepperProgress from "@/components/StepperProgress";

interface Concept {
  id: number;
  label: string;
  description: string;
}

const concepts: Concept[] = [
  { id: 1, label: "Concept 1", description: "Fierce Fire Burning on a Mountain" },
  { id: 2, label: "Concept 2", description: "Large Dove flying in cloudy background" },
  { id: 3, label: "Concept 3", description: "Fierce Fire Burning on a Mountain" },
];

const CreateDesignStep3 = () => {
  const navigate = useNavigate();
  const [selectedConcept, setSelectedConcept] = useState<number>(1);

  return (
    <AppLayout>
      <CreateDesignHero title="Create Design" />
      <StepperProgress currentStep={3} />

      <div className="px-4 xs:px-0">
        <div className="border border-[hsl(0,0%,80%)] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-semibold text-[hsl(0,0%,10%)] mb-1">
                Background Concept
              </h2>
              <p className="text-xs text-[hsl(0,0%,55%)] mb-8 max-w-[280px]">
                Please Pick a concept from the suggestions or enter your preferred concept
              </p>

              {/* Analyzing theme image */}
              <div className="flex items-center justify-center mt-auto">
                <img
                  src="/Halorai Dev/Images/analysing theme.png"
                  alt="Analyzing your theme"
                  className="w-[220px] h-[220px] md:w-[250px] md:h-[250px] object-contain"
                />
              </div>
            </div>

            {/* Right Column - Concept Cards */}
            <div className="flex flex-col gap-4">
              {concepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConcept(concept.id)}
                  className={`text-left border rounded-2xl p-5 cursor-pointer transition-all duration-150 ease-out bg-white ${
                    selectedConcept === concept.id
                      ? "border-[hsl(330,100%,85%)] shadow-[0_0_0_1px_hsl(330,100%,85%)]"
                      : "border-[hsl(0,0%,85%)] hover:border-[hsl(0,0%,70%)]"
                  }`}
                >
                  <span
                    className={`inline-block text-xs font-medium px-3 py-1.5 rounded-lg mb-3 ${
                      selectedConcept === concept.id
                        ? "bg-[hsl(330,100%,93%)] text-[hsl(0,0%,10%)]"
                        : "bg-[hsl(0,0%,95%)] text-[hsl(0,0%,40%)]"
                    }`}
                  >
                    {concept.label}
                  </span>
                  <p className="text-sm text-[hsl(0,0%,40%)]">{concept.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8">
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
              onClick={() => {}}
              className="flex items-center gap-2 bg-[hsl(0,0%,10%)] text-white border-none rounded-full px-4 py-3 text-xs font-medium cursor-pointer hover:bg-[hsl(0,0%,20%)] transition-all duration-150 ease-out hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
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
    </AppLayout>
  );
};

export default CreateDesignStep3;
