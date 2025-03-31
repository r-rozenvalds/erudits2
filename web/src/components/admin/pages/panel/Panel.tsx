import { PlayerList } from "../../ui/panel/PlayerList";
import { StartStop } from "../../ui/panel/StartStop";
import { RoundControl } from "../../ui/panel/RoundControl";
import { useAdminPanel } from "../../../universal/AdminPanelContext";
import { SpinnerCircularFixed } from "spinners-react";

export const Panel = () => {
  const { game, instanceId, instance } = useAdminPanel();

  if (!instance) {
    return (
      <div className="mx-auto mt-10 w-10">
        <SpinnerCircularFixed size={40} color="#E63946" thickness={180} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <div className="flex justify-between place-items-center">
        <div className="flex place-items-center gap-6">
          <button
            onClick={() => window.location.assign("/admin/games")}
            className="h-10 w-28 rounded-sm bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
          >
            <i className="fa-solid fa-arrow-left-long me-2"></i>
            Atpakaļ
          </button>
          <img src="/maxwell-cat.gif" width="60" />
        </div>
        <div className="flex gap-4">
          <h1 className="font-bold text-2xl">{game?.title}</h1>
          <div className="px-2 py-1 bg-slate-200 rounded-sm text-lg font-semibold">
            Kods: {instance?.code}
          </div>
        </div>
        {game && instanceId && instance && (
          <StartStop instance={instance} game={game} instanceId={instanceId} />
        )}
      </div>
      <div className="flex grow justify-between gap-8">
        <PlayerList />

        <RoundControl />
      </div>
      <div className="flex gap-4 place-items-center">
        <button
          onClick={() => window.location.assign("/admin/games")}
          className="h-10 px-4 rounded-sm bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
        >
          <i className="fa-solid fa-circle-dot me-2"></i>
          Mainīt spēles veidu
        </button>
        <button
          onClick={() => window.location.assign("/admin/games")}
          className="h-10 px-4 rounded-sm bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
        >
          <i className="fa-solid fa-table me-2"></i>
          Atvērt spēlētāju sarakstu
        </button>
      </div>
    </div>
  );
};
