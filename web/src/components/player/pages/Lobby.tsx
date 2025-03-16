import { useEffect, useState } from "react";
import { SpinnerCircularFixed } from "spinners-react";
import { PlayerLocalStorage } from "../enum/PlayerLocalStorage";
import { IGameSessionStorage } from "../interface/IGameSessionStorage";
import { constants } from "../../../constants";

import { usePlayer } from "../../universal/PlayerContext";

export const Lobby = () => {
  const [error, setError] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    playerName,
    setPlayerName,
    setPlayerId,
    setIsReady,
    isReady,
    playerId,
  } = usePlayer();

  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const gameSessionStorage = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentGame) ?? "{}"
    ) as IGameSessionStorage;
    setInstanceId(gameSessionStorage.id);

    if (gameSessionStorage?.title) {
      setGameTitle(gameSessionStorage.title);
    }
  }, []);

  useEffect(() => {
    setAgreed(isReady);
  }, [isReady]);

  const readyPlayer = async () => {
    setIsLoading(true);
    setError("");
    if (!agreed) {
      setError("Lūdzu, atzīmējiet, ka piekrītat noteikumiem!");
      setIsLoading(false);
      return;
    }
    if (playerName === "") {
      setError("Lūdzu, ievadiet spēlētāja nosaukumu!");
      setIsLoading(false);
      return;
    }
    if (await createPlayer()) {
      setIsReady(true);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const createPlayer = async () => {
    const response = await fetch(`${constants.baseApiUrl}/create-player`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_name: playerName,
        instance_id: instanceId,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(
        PlayerLocalStorage.currentPlayer,
        JSON.stringify({
          id: data.id,
          name: data.name,
        })
      );
      setPlayerName(data.name);
      setPlayerId(data.id);
      return true;
    }
    setError(data?.error ?? "Kļūda veidojot spēlētāju");
    return false;
  };

  const changeAgreed = (value: boolean) => {
    setError("");
    setAgreed(value);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col place-items-center justify-center text-white drop-shadow-lg">
        <p className="font-semibold text-lg">Jūs esat pievienojušies spēlei</p>
        <p className="font-bold text-4xl">"{gameTitle}"</p>
      </div>
      <div className="flex place-items-center flex-col gap-4">
        <label
          htmlFor="playername"
          className="font-semibold text-white drop-shadow-lg"
        >
          Lūdzu, ievadiet spēlētāja nosaukumu:
        </label>
        <input
          disabled={isReady}
          id="playername"
          className="w-full h-12 bg-white rounded-md text-2xl px-4 text-center shadow-md"
          placeholder="Pēteris"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <div className="flex gap-2 place-items-center justify-center">
          <input
            className="h-5 w-5 accent-[#E63946] shadow-md"
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={(e) => changeAgreed(e.target.checked)}
            disabled={isReady}
          />
          <label htmlFor="agreement" className="text-white">
            Es piekrītu neizmantot palīgierīces spēles laikā.
          </label>
        </div>
        {!isReady && !isLoading && (
          <button
            onClick={readyPlayer}
            className={`text-white w-32 h-12 rounded-md text-2xl shadow-md hover:opacity-70 ${
              agreed ? "bg-[#E63946]" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <i className="fa-solid fa-check"></i>
          </button>
        )}
        {isLoading && (
          <button className="text-white w-32 h-12 rounded-md text-2xl shadow-md  bg-[#E63946] cursor-not-allowed">
            <div className="mx-auto w-8">
              <SpinnerCircularFixed color="#ffffff" size={32} thickness={180} />
            </div>
          </button>
        )}
        {isReady && (
          <button
            disabled
            className="text-white bg-slate-400 w-32 h-12 rounded-md text-2xl shadow-md"
          >
            <div className="mx-auto w-8">
              <SpinnerCircularFixed color="#ffffff" size={32} thickness={180} />
            </div>
          </button>
        )}
        <p
          className={`font-semibold ${
            error.length > 0 ? "text-red-600" : "text-white"
          } drop-shadow-lg`}
        >
          {isReady ? "Lūdzu, gaidiet spēles sākumu!" : ""}
          {error.length > 0 ? error : ""}
        </p>
      </div>
    </div>
  );
};
