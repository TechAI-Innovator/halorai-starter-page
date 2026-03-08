import { useState } from "react";

const categories = ["Fellowship", "Love", "Prayer Retreat", "Conference", "Birthday"];

const communityDesigns = [
  { id: 1, image: "/Halorai Dev/Images/1.png", alt: "Design 1" },
  { id: 2, image: "/Halorai Dev/Images/2.png", alt: "Design 2" },
  { id: 3, image: "/Halorai Dev/Images/3.png", alt: "Design 3" },
  { id: 4, image: "/Halorai Dev/Images/4.png", alt: "Design 4" },
  { id: 5, image: "/Halorai Dev/Images/5.png", alt: "Design 5" },
];

const HaloRAI = () => {
  const [activeCategory, setActiveCategory] = useState("Prayer Retreat");

  return (
    <div className="font-['Google_Sans',_'Segoe_UI',_system-ui,_sans-serif] min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-12 py-3 sticky top-0 z-50 border-b border-[hsl(0,0%,94%)]"
        style={{
          backgroundImage: "url('/Halorai Dev/Halorai Background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="flex items-center gap-0.5">
          <img src="/Halorai Dev/Logos/Halorai Logo-.png" alt="Halorai Logo" className="h-7" />
        </div>
        <div className="flex items-center gap-5">
          <span className="text-[15px] font-medium text-[hsl(0,0%,10%)] cursor-pointer">Pricing</span>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img
                src="/Halorai Dev/Images/user avatar.png"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[15px] font-medium text-[hsl(0,0%,10%)]">Johnny Adams</span>
          </div>
          <button className="bg-[#FCFCFC] border-none rounded-full cursor-pointer p-1 flex items-center">
            <img src="/Halorai Dev/Icons/material-symbols_dark-mode.svg" alt="Dark mode" className="w-[16px] h-[16px]" />
          </button>
          <button className="flex items-center gap-2 bg-[hsl(0,0%,10%)] text-white border-none rounded-3xl px-5 py-2.5 text-sm font-medium cursor-pointer">
            <img src="/Halorai Dev/Icons/cuida_logout-outline.svg" alt="Logout" className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 gap-6 pr-8 pt-4 pb-8 bg-white min-h-0">
        {/* Sidebar */}
        <aside className="w-[220px] min-w-[220px] p-5 pt-7 flex flex-col justify-between bg-[#F8F8F8] rounded-3xl">
          <div className="flex flex-col">
            <h2 className="text-[22px] font-bold text-[hsl(0,0%,10%)] leading-tight mb-7">
              Welcome back,<br />Johnny
            </h2>
            <nav className="flex flex-col gap-1">
              <a href="#" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] text-[15px] font-medium text-[hsl(0,0%,10%)] bg-[hsl(0,0%,96%)] border-b-2 border-[hsl(0,0%,10%)] rounded-b-none no-underline">
                <img src="/Halorai Dev/Icons/solar_home-2-linear.svg" alt="Home" className="w-5 h-5" />
                Home
              </a>
              <a href="#" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] text-[15px] text-[hsl(0,0%,58%)] no-underline hover:bg-[hsl(0,0%,96%)] transition-colors">
                <img src="/Halorai Dev/Icons/lsicon_folder-files-filled.svg" alt="Projects" className="w-5 h-5" />
                Your Projects
              </a>
              <a href="#" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] text-[15px] text-[hsl(0,0%,58%)] no-underline hover:bg-[hsl(0,0%,96%)] transition-colors">
                <img src="/Halorai Dev/Icons/hugeicons_chat-feedback.svg" alt="Feedback" className="w-5 h-5" />
                Give Feedback
              </a>
            </nav>
          </div>

          {/* Upgrade Card */}
          <div className="bg-[hsl(0,0%,98%)] border border-[hsl(0,0%,94%)] rounded-2xl p-5">
            <div className="w-14 h-14 bg-[hsl(16,100%,93%)] rounded-[14px] flex items-center justify-center mb-3.5">
              <img src="/Halorai Dev/Icons/material-symbols_crown-rounded.svg" alt="Crown" className="w-8 h-8" />
            </div>
            <h3 className="text-[17px] font-bold text-[hsl(0,0%,10%)] mb-3">Upgrade to Pro</h3>
            <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-2">
              <li className="flex items-center gap-2 text-[13px] text-[hsl(0,0%,40%)]">
                <img src="/Halorai Dev/Icons/pepicons-pencil_checkmark-filled.svg" alt="Check" className="w-3.5 h-3.5" />
                Premium Design
              </li>
              <li className="flex items-center gap-2 text-[13px] text-[hsl(0,0%,40%)]">
                <img src="/Halorai Dev/Icons/pepicons-pencil_checkmark-filled.svg" alt="Check" className="w-3.5 h-3.5" />
                High Export for Print
              </li>
              <li className="flex items-center gap-2 text-[13px] text-[hsl(0,0%,40%)]">
                <img src="/Halorai Dev/Icons/pepicons-pencil_checkmark-filled.svg" alt="Check" className="w-3.5 h-3.5" />
                Advance Editing
              </li>
            </ul>
            <button className="w-full bg-[hsl(0,0%,10%)] text-white border-none rounded-3xl py-2.5 text-[13px] font-medium cursor-pointer">
              Coming soon
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-h-0 rounded-3xl">
          {/* Hero Section */}
          <section
            className="rounded-3xl px-12 py-10 flex items-center justify-between mb-10 min-h-[300px] relative overflow-hidden"
            style={{
              backgroundImage: "url('/Halorai Dev/Halorai Background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            
            <div className="flex-1 max-w-[420px] relative z-10">
              <h1 className="text-4xl font-bold text-[hsl(0,0%,10%)] leading-tight mb-8 tracking-tight">
                Design Your Next Event Today
              </h1>
              <button className="border-none bg-transparent p-0 cursor-pointer">
                <img
                  src="/Halorai Dev/Icons/Create Design button.png"
                  alt="Create Design"
                  className="h-16"
                />
              </button>
            </div>
            <div className="relative z-10 w-[450px] h-full flex items-center justify-center">
              <img
                src="/Halorai Dev/Images/Group 1000006715.png"
                alt="Event flyer 1"
                className="w-full h-full object-contain object-right"
              />
            </div>
          </section>

          {/* Community Section */}
          <section className="mt-2">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-[22px] font-bold text-[hsl(0,0%,10%)]">Results from our Community</h2>
              <div className="flex gap-2.5 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`px-5 py-2.5 rounded-[28px] text-sm cursor-pointer transition-all ${
                      activeCategory === cat
                        ? "bg-[hsl(0,0%,10%)] text-white border border-[hsl(0,0%,10%)]"
                        : "bg-white text-[hsl(0,0%,33%)] border border-[hsl(0,0%,88%)] hover:border-[hsl(0,0%,60%)]"
                    }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {communityDesigns.map((design) => (
                <div
                  key={design.id}
                  className="rounded-2xl overflow-hidden aspect-[3/4] shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform"
                >
                  <img src={design.image} alt={design.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HaloRAI;
