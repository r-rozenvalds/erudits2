import { Outlet } from "react-router-dom";

export const PlayerLayout = () => {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gradient-to-r from-[#30345f] to-[#533266] place-items-center justify-center gap-12">
      <Outlet />
    </div>
  );
};
