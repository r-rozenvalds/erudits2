import { PlayerList } from "../../ui/panel/PlayerList";
import { StartStop } from "../../ui/panel/StartStop";
import { RoundControl } from "../../ui/panel/RoundControl";
import { useAdminPanel } from "../../../universal/AdminPanelContext";
import { SpinnerCircularFixed } from "spinners-react";
import { constants } from "../../../../constants";
import { useToast } from "../../../universal/Toast";

export const Panel = () => {
  const { game, instanceId, instance, isBuzzerMode, setIsBuzzerMode } =
    useAdminPanel();

  const showToast = useToast();

  if (!instance) {
    return (
      <div className="mx-auto mt-10 w-10">
        <SpinnerCircularFixed size={40} color="#E63946" thickness={180} />
      </div>
    );
  }

  const openBuzzerView = async () => {
    const response = await fetch(constants.baseApiUrl + "/buzzer-start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(
          constants.localStorage.TOKEN
        )}`,
      },
      body: JSON.stringify({
        instance_id: instanceId,
      }),
    });

    if (response.ok) {
      window.open(`buzzer/${instanceId}`, "_blank");
    }
  };

  const cancelBuzzer = async () => {
    const response = await fetch(constants.baseApiUrl + "/buzzer-stop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(
          constants.localStorage.TOKEN
        )}`,
      },
      body: JSON.stringify({
        instance_id: instanceId,
      }),
    });

    if (response.ok) {
      setIsBuzzerMode(false);
    }
  };

  const clearBuzzers = async () => {
    const response = await fetch(constants.baseApiUrl + "/buzzer-clear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(
          constants.localStorage.TOKEN
        )}`,
      },
      body: JSON.stringify({
        instance_id: instanceId,
      }),
    });

    if (response.ok) {
      showToast(true, "Aktīvie notīrīti");
    }
  };

  return (
    <div className="flex flex-col h-screen gap-4 p-4">
      {isBuzzerMode && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 glass-effect w-full h-full">
          <div className="flex gap-4 place-items-center flex-col absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={openBuzzerView}
              className="h-10 px-4 w-56 rounded-sm bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
            >
              <i className="fa-solid fa-arrow-up-right-from-square me-2"></i>
              Atvērt skatu
            </button>
            <button
              onClick={clearBuzzers}
              className="h-10 px-4 w-56 rounded-sm bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
            >
              <i className="fa-solid fa-xmark me-2"></i>
              Notīrīt aktīvos
            </button>
            <button
              onClick={cancelBuzzer}
              className="h-10 px-4 w-56 rounded-sm bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
            >
              <i className="fa-solid fa-xmark me-2"></i>
              Atcelt
            </button>
          </div>
        </div>
      )}
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
          onClick={() => setIsBuzzerMode(!isBuzzerMode)}
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
