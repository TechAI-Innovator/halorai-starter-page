import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import CreateDesignHero from "@/components/CreateDesignHero";
import StepperProgress from "@/components/StepperProgress";

interface Minister {
  id: number;
  name: string;
  title: string;
  avatar: string;
}

const initialMinisters: Minister[] = [
  { id: 1, name: "Pastor John Michael", title: "Guest Speaker", avatar: "/Halorai Dev/Images/Ellipse 1.png" },
  { id: 2, name: "Pastor Drake Akinola", title: "Host", avatar: "/Halorai Dev/Images/Ellipse 2.png" },
  { id: 3, name: "Mrs Sonia Precious", title: "Guest Speaker", avatar: "/Halorai Dev/Images/Ellipse 3.png" },
  { id: 4, name: "Pst (Mrs) Funke Tojuola (JP)", title: "Special Guest", avatar: "/Halorai Dev/Images/Ellipse 4.png" },
];

const CreateDesignStep2 = () => {
  const navigate = useNavigate();
  const [ministers, setMinisters] = useState<Minister[]>(initialMinisters);

  const handleDeleteMinister = (id: number) => {
    setMinisters((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMinisterChange = (id: number, field: "name" | "title", value: string) => {
    setMinisters((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <AppLayout>
      <CreateDesignHero title="Create Design" />
      <StepperProgress currentStep={2} />

      {/* Form */}
      <div className="px-4 xs:px-0">
        <div className="border border-[hsl(0,0%,90%)] rounded-2xl p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-semibold text-[hsl(0,0%,10%)] mb-6">
            Upload Assets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              {/* Upload Logo */}
              <div>
                <h3 className="text-sm font-semibold text-[hsl(0,0%,10%)] mb-1">Upload Logo</h3>
                <p className="text-xs text-[hsl(0,0%,55%)] mb-3">Click the button below to upload your logo(s)</p>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 border border-[hsl(0,0%,85%)] rounded-xl px-4 py-2.5 text-xs font-medium text-[hsl(0,0%,10%)] bg-white cursor-pointer hover:border-[hsl(0,0%,60%)] transition-colors">
                    <img src="/Halorai Dev/Icons/material-symbols_upload-rounded.svg" alt="Upload" className="w-4 h-4" />
                    Upload
                  </button>
                  {/* Uploaded logo thumbnails with red X badges */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img src="/Halorai Dev/Images/Ellipse 1.png" alt="Logo 1" className="w-9 h-9 rounded-full object-cover" />
                      <button className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(15,100%,55%)] rounded-full flex items-center justify-center">
                        <img src="/Halorai Dev/Icons/blue cross.svg" alt="Remove" className="w-2 h-2 brightness-0 invert" />
                      </button>
                    </div>
                    <div className="relative">
                      <img src="/Halorai Dev/Images/Ellipse 2.png" alt="Logo 2" className="w-9 h-9 rounded-full object-cover" />
                      <button className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(15,100%,55%)] rounded-full flex items-center justify-center">
                        <img src="/Halorai Dev/Icons/blue cross.svg" alt="Remove" className="w-2 h-2 brightness-0 invert" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Ministers Pictures */}
              <div>
                <h3 className="text-sm font-semibold text-[hsl(0,0%,10%)] mb-1">Upload Ministers Pictures</h3>
                <p className="text-xs text-[hsl(0,0%,55%)] mb-3">Click the button below to upload Minister(s) pictures</p>
                <div className="border border-dashed border-[hsl(0,0%,80%)] rounded-xl p-6 flex flex-col items-center gap-3">
                  <button className="flex items-center gap-2 border border-[hsl(0,0%,85%)] rounded-xl px-4 py-2.5 text-xs font-medium text-[hsl(0,0%,10%)] bg-white cursor-pointer hover:border-[hsl(0,0%,60%)] transition-colors">
                    <img src="/Halorai Dev/Icons/material-symbols_upload-rounded.svg" alt="Upload" className="w-4 h-4" />
                    Upload
                  </button>
                  <p className="text-[11px] text-[hsl(0,0%,50%)] text-center">
                    Choose images or drag & drop it here
                  </p>
                  <p className="text-[10px] text-[hsl(0,0%,65%)] text-center -mt-2">
                    JPG, JPEG, and PNG - Max 20 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Ministers Names */}
            <div>
              <h3 className="text-sm font-semibold text-[hsl(0,0%,10%)] mb-1">Add Ministers Name</h3>
              <p className="text-xs text-[hsl(0,0%,55%)] mb-4">Enter Name and Title (Title is Optional)</p>
              <div className="flex flex-col gap-3">
                {ministers.map((minister) => (
                  <div key={minister.id} className="flex items-center gap-3">
                    <img
                      src={minister.avatar}
                      alt={minister.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <input
                      type="text"
                      value={minister.name}
                      onChange={(e) => handleMinisterChange(minister.id, "name", e.target.value)}
                      className="flex-1 border border-[hsl(0,0%,85%)] rounded-xl px-4 py-3 text-xs text-[hsl(0,0%,10%)] placeholder:text-[hsl(0,0%,70%)] outline-none focus:border-[hsl(330,100%,80%)] transition-colors bg-white min-w-0"
                    />
                    <input
                      type="text"
                      value={minister.title}
                      onChange={(e) => handleMinisterChange(minister.id, "title", e.target.value)}
                      className="w-[120px] shrink-0 border border-[hsl(0,0%,85%)] rounded-xl px-4 py-3 text-xs text-[hsl(0,0%,10%)] placeholder:text-[hsl(0,0%,70%)] outline-none focus:border-[hsl(330,100%,80%)] transition-colors bg-white"
                    />
                    <button
                      onClick={() => handleDeleteMinister(minister.id)}
                      className="w-10 h-10 shrink-0 bg-[hsl(15,100%,55%)] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[hsl(15,100%,45%)] transition-colors"
                    >
                      <img src="/Halorai Dev/Icons/weui_delete-on-filled.svg" alt="Delete" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              onClick={() => navigate("/create-design")}
              className="flex items-center gap-2 border border-[hsl(0,0%,85%)] text-[hsl(0,0%,10%)] rounded-full px-4 py-3 text-xs font-medium cursor-pointer hover:border-[hsl(0,0%,60%)] transition-all duration-150 bg-white"
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

export default CreateDesignStep2;
