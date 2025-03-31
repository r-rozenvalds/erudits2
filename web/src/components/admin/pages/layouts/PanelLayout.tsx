import { Outlet } from "react-router-dom";
import { AdminPanelProvider } from "../../../universal/AdminPanelContext";

export const PanelLayout = () => {
  return (
    <AdminPanelProvider>
      <Outlet />
    </AdminPanelProvider>
  );
};
