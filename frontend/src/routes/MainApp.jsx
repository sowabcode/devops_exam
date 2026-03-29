import { Outlet } from "react-router-dom";

import Sidebar from "../components/layouts/Sidebar";
import Topbar from "../components/layouts/Topbar";

const MainApp = ({ children }) => {
  return (
    <div>
      <Sidebar />

      <Topbar />

      {children}

      <Outlet />
    </div>
  );
};

export default MainApp;
