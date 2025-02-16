import { Outlet } from "react-router-dom";
import { AdminPanelProvider } from "../../../universal/AdminPanelContext";

export const PanelLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden p-12 bg-gradient-to-r from-[#944760] to-[#663266] gap-6">
      <div className="flex gap-4 grow">
        <div className="w-full rounded-md font-[Manrope] bg-white">
          <AdminPanelProvider>
            <Outlet />
          </AdminPanelProvider>
        </div>
      </div>
    </div>
  );
};
