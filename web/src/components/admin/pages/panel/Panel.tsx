import { PlayerList } from "../../ui/panel/PlayerList";
import { StartStop } from "../../ui/panel/StartStop";
import { RoundControl } from "../../ui/panel/RoundControl";
import { useAdminPanel } from "../../../universal/AdminPanelContext";

export const Panel = () => {
  const { game, instanceId, instance } = useAdminPanel();

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between place-items-center bg-slate-100 p-4 rounded-t-md">
        <div className="flex place-items-center gap-6">
          <button
            onClick={() => window.location.assign("/admin/games")}
            className="h-10 w-28 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
          >
            <i className="fa-solid fa-arrow-left-long me-2"></i>
            Atpakaļ
          </button>
          <img src="/maxwell-cat.gif" width="60" />
        </div>
        <div className="flex gap-4">
          <h1 className="font-bold text-2xl">{game?.title}</h1>
          <div className="px-2 py-1 bg-slate-200 rounded-md text-lg font-semibold">
            Kods: {instance?.code}
          </div>
        </div>
        {game && instanceId && instance && (
          <StartStop instance={instance} game={game} instanceId={instanceId} />
        )}
      </div>
      <div className="flex gap-6 mt-2 mx-4">
        <PlayerList />

        <RoundControl />
      </div>
    </div>
  );
};
