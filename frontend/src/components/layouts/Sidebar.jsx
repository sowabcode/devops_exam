import clsx from "clsx";

import { useContext } from "react";
import {
  FaBookmark,
  FaBookOpen,
  FaBuildingColumns,
  FaUsers,
} from "react-icons/fa6";

import LayoutContext from "../../contexts/LayoutContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSidebar } = useContext(LayoutContext);

  return (
    <div
      className={clsx(
        "fixed top-0 w-[250px] px-4 py-4 bg-[#014455] flex flex-col items-center justify-between bg-primary h-screen transition-all delay-150 duration-150",
        {
          "-left-[240px]": showSidebar,
          "left-0": !showSidebar,
        },
      )}
    >
      <div className="w-full">
        <div className="flex items-center gap-4">
          <span className="grid place-items-center rounded-md bg-[#235766] p-2">
            <FaBuildingColumns size={22} className="text-white" />
          </span>

          <h1 className="font-semibold text-2xl text-white">DIT-Library</h1>
        </div>

        <div className="w-full flex flex-col items-start gap-2 transition-all delay-150 duration-150 mt-20">
          <Link
            to="/livres"
            className={`w-full flex items-center gap-4 rounded px-2 py-2 cursor-pointer text-white hover:bg-[#235766] hover:text-white ${
              location.pathname === "/livres" && "bg-[#235766]"
            }`}
          >
            <FaBookOpen size={20} />
            <span>Livres</span>
          </Link>
          <Link
            to="/emprunts"
            className={`w-full flex items-center gap-4 rounded px-2 py-2 cursor-pointer text-white hover:bg-[#235766] hover:text-white ${
              location.pathname === "/emprunts" && "bg-[#235766]"
            }`}
          >
            <FaBookmark size={20} />
            <span>Emprunts</span>
          </Link>
          <Link
            to="/utilisateurs"
            className={`w-full flex items-center gap-4 rounded px-2 py-2 cursor-pointer text-white hover:bg-[#235766] hover:text-white ${
              location.pathname === "/utilisateurs" && "bg-[#235766]"
            }`}
          >
            <FaUsers size={20} />
            <span>Utilisateurs</span>
          </Link>
        </div>
      </div>

      <div className="flex items-end justify-end w-full bg-[#235766] rounded-lg h-40 px-1.5 py-2">
        <button
          onClick={() => navigate("/")}
          className="w-full bg-red-100 text-red-700 py-2 rounded-lg cursor-pointer"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
