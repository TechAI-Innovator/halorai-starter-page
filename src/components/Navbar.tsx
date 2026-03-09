const Navbar = () => {
  return (
    <nav
      className="flex items-center justify-between px-4 md:px-6 xl:px-12 py-3 sticky top-0 z-50 border-b border-[hsl(0,0%,94%)]"
      style={{
        backgroundImage: "url('/Halorai Dev/Halorai Background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <div className="flex items-center gap-0.5">
        <img src="/Halorai Dev/Logos/Halorai Logo-.png" alt="Halorai Logo" className="h-7" />
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        <span className="text-[15px] font-normal text-[hsl(0,0%,10%)] cursor-pointer hidden md:inline">Pricing</span>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <img
              src="/Halorai Dev/Images/user avatar.png"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[15px] font-normal text-[hsl(0,0%,10%)] hidden md:inline">Johnny Adams</span>
        </div>
        <button className="bg-[#FCFCFC] border-none rounded-full cursor-pointer p-1 flex items-center">
          <img src="/Halorai Dev/Icons/material-symbols_dark-mode.svg" alt="Dark mode" className="w-4 h-4" />
        </button>
        <button className="hidden md:flex items-center gap-2 bg-[hsl(0,0%,10%)] text-white border-none rounded-3xl px-5 py-2.5 text-sm font-normal cursor-pointer">
          <img src="/Halorai Dev/Icons/cuida_logout-outline.svg" alt="Logout" className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
