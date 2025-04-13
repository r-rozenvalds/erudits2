import { useState } from "react";
import { constants } from "../../../../constants";
import { useAdminPanel } from "../../../universal/AdminPanelContext";
import { useBuzzer } from "../../../universal/BuzzerContext";
import { useToast } from "../../../universal/Toast";
import { IPlayer } from "../../interface/IPlayer";
import { SpinnerCircularFixed } from "spinners-react";

export const BuzzerModal = () => {
  const { instanceId, setIsBuzzerMode, players, setPlayers } = useAdminPanel();

  const { buzzedPlayer } = useBuzzer();
  const [loading, setLoading] = useState(false);

  const showToast = useToast();

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
      showToast(true, "Aktīvie notīrīti");
      //@ts-ignore
      setPlayers((prevPlayers) =>
        prevPlayers.map((player: IPlayer) => ({
          ...player,
          buzzer_enabled: true,
        }))
      );
    }
    setLoading(false);
  };

  const toggleBuzzers = async (playerId: string) => {
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
        player_id: playerId,
      }),
    });
    if (response.ok) {
      showToast(true, "Darbība izpildīta");
      //@ts-ignore
      setPlayers((prevPlayers) =>
        prevPlayers.map((player: { id: string; buzzer_enabled: any }) =>
          player.id === playerId
            ? { ...player, buzzer_enabled: !player.buzzer_enabled }
            : player
        )
      );
    }
    setLoading(false);
  };
  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  glass-effect w-full h-full">
      <div className="w-screen h-screen flex place-items-center justify-center gap-4">
        <div className="flex gap-4 place-items-center flex-col bg-black bg-opacity-80 p-12 rounded-md">
          <h1 className="font-bold text-3xl text-white">Buzzers</h1>
          <p className="text-white font-semibold text-center">
            Pēdējais nospiedis pogu: <br />
            <span className="font-bold">{buzzedPlayer.title ?? "-"}</span>
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
        <div className="flex gap-4 place-items-center flex-col bg-black bg-opacity-80 p-12 rounded-md">
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
          <ul>
            {players.map((player) => {
              if (player.is_disqualified) return;
              return (
                <li
                  key={player.id}
                  className="text-white font-semibold my-2 flex gap-2 place-items-center w-"
                >
                  <p className="w-32">{player.player_name}</p>
                  <label
                    className={`inline-flex items-center ${
                      loading ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <input
                      key={player.buzzer_enabled.toString()}
                      onChange={() => toggleBuzzers(player.id)}
                      checked={player.buzzer_enabled}
                      disabled={loading}
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 font-bold text-white">Ieslēgts?</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
