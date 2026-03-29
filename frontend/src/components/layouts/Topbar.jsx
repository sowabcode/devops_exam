import { useContext } from "react";
import { HiMenuAlt2 } from "react-icons/hi";

import LayoutContext from "../../contexts/LayoutContext";

import user_profile from "../../assets/images.jpeg";

const Topbar = () => {
  const { showSidebar, setShowSidebar } = useContext(LayoutContext);

  return (
    <div
      className={`fixed top-0 h-[70px] flex items-center justify-between gap-10 border-b border-slate-100 px-5 transition-all delay-150 duration-150 z-10 ${
        !showSidebar
          ? "left-[250px] w-[calc(100%-250px)]"
          : "left-2.5 w-[calc(100%-10px)]"
      }`}
    >
      <span
        onClick={() => setShowSidebar(!showSidebar)}
        className="grid place-items-center rounded-full hover:bg-slate-200 w-12 h-12 cursor-pointer"
      >
        <HiMenuAlt2 size={24} />
      </span>

      <div className="border border-slate-300 rounded-full w-12 h-12 cursor-pointer">
        <img
          src={user_profile}
          alt="IMG_PROFILE"
          className="w-full h-full bg-cover rounded-full"
        />
      </div>
    </div>
  );
};

export default Topbar;
