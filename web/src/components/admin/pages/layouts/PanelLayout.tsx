import { Outlet } from "react-router-dom";

export const PanelLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden p-12 bg-gradient-to-r from-[#944760] to-[#663266] gap-6">
      <div className="flex gap-4 grow">
        <div className="w-full rounded-md font-[Manrope] bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
