import { Outlet } from "react-router-dom";
import { AdminPanelProvider } from "../../../universal/AdminPanelContext";
import { BuzzerProvider } from "../../../universal/BuzzerContext";
import { PlayerProvider } from "../../../../stores/PlayerStore";
import { InstanceProvider } from "../../../../stores/InstanceStore";

export const PanelLayout = () => {
  return (
    <InstanceProvider>
      <AdminPanelProvider>
        <PlayerProvider>
          <BuzzerProvider>
            <Outlet />
          </BuzzerProvider>
        </PlayerProvider>
      </AdminPanelProvider>
    </InstanceProvider>
  );
};
