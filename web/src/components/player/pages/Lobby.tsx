import { useState } from "react";
import { SpinnerCircularFixed } from "spinners-react";

export const Lobby = () => {
  const [playerName, setPlayerName] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);

  const readyPlayer = () => {
    setIsError(false);
    if (playerName === "") {
      setIsError(true);
      return;
    }
    setIsReady(true);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col place-items-center justify-center text-white drop-shadow-lg">
        <p className="font-semibold text-lg">Jūs esat pievienojušies spēlei</p>
        <p className="font-bold text-4xl ">"Gudrs, vēl gudrāks 2025"</p>
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
        {!isReady && (
          <button
            onClick={readyPlayer}
            className="text-white bg-[#E63946] w-32 h-12 rounded-md text-2xl shadow-md hover:opacity-70"
          >
            <i className="fa-solid fa-check"></i>
          </button>
        )}
        {isReady && (
          <button
            disabled
            className="text-white bg-slate-400 w-32 h-12 rounded-md text-2xl shadow-md"
          >
            <div className="mx-auto w-8">
              <SpinnerCircularFixed color="#ffffff" size={32} thickness={280} />
            </div>
          </button>
        )}
        <p
          className={`font-semibold ${
            isError ? "text-red-600" : "text-white"
          } drop-shadow-lg`}
        >
          {isReady ? "Lūdzu, gaidiet spēles sākumu!" : ""}
          {isError ? "Lūdzu, ievadiet spēlētāja nosaukumu!" : ""}
        </p>
      </div>
    </div>
  );
};
