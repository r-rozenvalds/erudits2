import { Sidebar } from "../../ui/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { BreadCrumbs } from "../../../universal/BreadCrumbs";
import { AdminSidebarProvider } from "../../../universal/AdminGameSidebarContext";
import { GameProvider } from "../../../../stores/GameStore";

export const CreatorLayout = () => {
  return (
    <AdminSidebarProvider>
      <GameProvider>
        <div className="flex flex-col min-h-screen overflow-x-hidden p-12 bg-gradient-to-r from-[#31587A] to-[#3C3266] gap-6">
          <BreadCrumbs />
          <div className="flex gap-4 grow">
            <div className="w-1/4 p-4 rounded-md font-[Manrope] bg-white max-h-[46rem]">
              <Sidebar />
            </div>

            <Outlet />
          </div>
        </div>
      </GameProvider>
    </AdminSidebarProvider>
  );
};
