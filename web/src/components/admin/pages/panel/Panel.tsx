import { PlayerList } from "../../ui/panel/PlayerList";
import { StartStop } from "../../ui/panel/StartStop";
import { RoundControl } from "../../ui/panel/RoundControl";
import { useAdminPanel } from "../../../universal/AdminPanelContext";
import { SpinnerCircularFixed } from "spinners-react";
import { constants } from "../../../../constants";
import { useToast } from "../../../universal/Toast";
import { useState } from "react";
import { useBuzzer } from "../../../universal/BuzzerContext";

export const Panel = () => {
  const { game, instanceId, instance, isBuzzerMode, setIsBuzzerMode } =
    useAdminPanel();
  const { buzzerEnabled, setBuzzerEnabled, buzzedPlayer } = useBuzzer();
  const [loading, setLoading] = useState(false);

  const showToast = useToast();

  if (!instance) {
    return (
      <div className="mx-auto mt-10 w-10">
        <SpinnerCircularFixed size={40} color="#E63946" thickness={180} />
      </div>
    );
  }

  const openBuzzerView = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const cancelBuzzer = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const clearBuzzers = async () => {
    setLoading(true);
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
      setBuzzerEnabled(true);
      showToast(true, "Aktīvie notīrīti");
    }
    setLoading(false);
  };

  const toggleBuzzers = async () => {
    setLoading(true);
    const response = await fetch(constants.baseApiUrl + "/buzzers-toggle", {
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
      setBuzzerEnabled(!buzzerEnabled);
      showToast(true, "Darbība izpildīta");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen gap-4 p-4">
      {!!isBuzzerMode && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  glass-effect w-full h-full">
          <div className="flex gap-4 place-items-center flex-col absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-12 rounded-md">
            <h1 className="font-bold text-3xl text-white">Buzzers</h1>
            <p className="text-white font-semibold text-center">
              Pēdējais nospiedis pogu: <br />
              <span className="font-bold">{buzzedPlayer ?? "-"}</span>
            </p>
            <button
              onClick={openBuzzerView}
              disabled={loading}
              className={`h-10 px-4 w-56 rounded-sm ${
                loading ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white font-bold transition-all flex gap-2 place-items-center justify-center`}
            >
              {loading ? (
                <SpinnerCircularFixed color="#fff" thickness={200} size={24} />
              ) : (
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              )}
              Atvērt skatu
            </button>
            <button
              onClick={clearBuzzers}
              disabled={loading}
              className={`h-10 px-4 w-56 rounded-sm ${
                loading ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white font-bold transition-all flex gap-2 place-items-center justify-center`}
            >
              {loading ? (
                <SpinnerCircularFixed color="#fff" thickness={200} size={24} />
              ) : (
                <i className="fa-solid fa-xmark"></i>
              )}
              Notīrīt aktīvos
            </button>
            <label
              className={`inline-flex items-center ${
                loading ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <input
                key={buzzerEnabled?.toString()}
                onChange={toggleBuzzers}
                checked={!buzzerEnabled}
                disabled={loading}
                type="checkbox"
                value=""
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              <span className="ms-3 font-bold text-white">Bloķēt pogas</span>
            </label>
            <button
              disabled={loading}
              onClick={cancelBuzzer}
              className={`h-10 px-4 w-56 rounded-sm ${
                loading ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white font-bold transition-all flex gap-2 place-items-center justify-center`}
            >
              {loading ? (
                <SpinnerCircularFixed color="#fff" thickness={200} size={24} />
              ) : (
                <i className="fa-solid fa-xmark"></i>
              )}
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
