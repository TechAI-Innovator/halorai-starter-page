import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import CreateDesignHero from "@/components/CreateDesignHero";
import StepperProgress from "@/components/StepperProgress";
import { useCreateDesign } from "@/contexts/CreateDesignContext";
import ArcLoader from "@/components/ArcLoader";

const CreateDesignStep3ii = () => {
  const navigate = useNavigate();
  const { customConceptText, setCustomConceptText } = useCreateDesign();
  const [message, setMessage] = useState(customConceptText || "");

  return (
    <AppLayout>
      <CreateDesignHero title="Create Design" />
      <StepperProgress currentStep={3} />

      <div className="px-4 xs:px-0">
        <div className="border border-[hsl(0,0%,80%)] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[0.45fr_1fr] gap-y-8 md:gap-x-6">

            {/* Left Column - Analyzer + icons */}
            <div className="flex flex-col items-center bg-[hsl(0,0%,97%)] rounded-2xl py-8 px-4">
              <div className="flex-1 flex items-center justify-center">
                <ArcLoader
                  size={200}
                  label={
                    <span>
                      Analyzing
                      <br />
                      your theme...
                    </span>
                  }
                  spinning={true}
                  spinDurationMs={2600}
                />
              </div>

              {/* Revert & Download icons */}
              <div className="flex items-center gap-4 mt-6">
                <button className="p-1 cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity">
                  <img
                    src="/Halorai Dev/Icons/grommet-icons_revert.svg"
                    alt="Revert"
                    className="w-7 h-7"
                  />
                </button>
                <button className="p-1 cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity">
                  <img
                    src="/Halorai Dev/Icons/material-symbols-light_download.svg"
                    alt="Download"
                    className="w-7 h-7"
                  />
                </button>
              </div>
            </div>

            {/* Right Column - Create Background Concept */}
            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-bold text-[hsl(0,0%,10%)] mb-2">
                Create Background Concept
              </h2>
              <p className="text-sm text-[hsl(0,0%,55%)] mb-6 max-w-[420px]">
                Prompt it, edit it, upload images, and shape the background exactly how you imagine it
              </p>

              {/* Chat-style textarea */}
              <div className="w-full max-w-[500px] bg-[hsl(0,0%,97%)] border border-[hsl(0,0%,92%)] rounded-2xl p-4 flex flex-col min-h-[220px]">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g A wall of fire... add fire sparks, flames"
                  className="flex-1 w-full resize-none border-none outline-none text-sm text-[hsl(0,0%,10%)] placeholder:text-[hsl(0,0%,55%)] bg-transparent"
                />
                <div className="flex items-center justify-end gap-3 mt-2">
                  <button className="p-1 cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88583 21.3658 3.76 20.24C2.63417 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63417 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0938 2.00916 15.15 2.00916C16.2062 2.00916 17.2194 2.42975 17.97 3.18C18.7202 3.93063 19.1408 4.94382 19.1408 6C19.1408 7.05618 18.7202 8.06937 17.97 8.82L9.37 17.42C8.99469 17.7953 8.48809 18.0056 7.96 18.0056C7.43191 18.0056 6.92531 17.7953 6.55 17.42C6.17469 17.0447 5.96438 16.5381 5.96438 16.01C5.96438 15.4819 6.17469 14.9753 6.55 14.6L15.07 6.1" stroke="hsl(0,0%,20%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors border-none bg-[hsl(25,100%,35%)] hover:bg-[hsl(25,100%,30%)]"
                  >
                    <img src="/Halorai Dev/Icons/send Vector.svg" alt="Send" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => navigate("/create-design/step-3")}
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
                  onClick={() => {
                    setCustomConceptText(message);
                    navigate("/create-design/step-4");
                  }}
                  className="flex items-center gap-2 border-none rounded-full px-4 py-3 text-xs font-medium bg-[hsl(0,0%,10%)] text-white cursor-pointer transition-all duration-150 ease-out hover:bg-[hsl(0,0%,20%)] hover:scale-[1.01] active:scale-[0.99]"
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

export default CreateDesignStep3ii;
