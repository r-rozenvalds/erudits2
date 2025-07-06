import { Outlet } from "react-router-dom";
import { GameProvider } from "../../../../stores/GameStore";

export const AdminLayout = () => {
  return (
    <GameProvider>
      <div className="flex gap-4 p-4 min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266]">
        <Outlet />
      </div>
    </GameProvider>
  );
};
