import { useEffect, useState } from "react";
import { constants } from "../../../constants";
import { PlayerLocalStorage } from "../enum/PlayerLocalStorage";
export const BuzzerView = () => {
  const [buzzerPressed, setBuzzerPressed] = useState(false);

  const handleBuzz = async () => {
    setBuzzerPressed(true);

    const player = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentPlayer) || "{}"
    );

    const instance = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentGame) || "{}"
    );

    await fetch(`${constants.baseApiUrl}/buzz`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          constants.localStorage.TOKEN
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_id: player.id,
        instance_id: instance.id,
        buzzed_at: new Date().toISOString(),
      }),
    });
    setBuzzerPressed(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleBuzz();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="bg-black fade-in-short bg-opacity-40 rounded-md place-items-center p-8 flex w-full grow m-12 flex-col gap-6">
      <p className="text-white font-semibold text-lg">
        Spied pogu vai tastatūras 'Atstarpi', lai atbildētu!
      </p>
      <button
        disabled={buzzerPressed}
        onClick={handleBuzz}
        className={`w-full bg-gradient-to-b ${
          buzzerPressed
            ? "from-slate-600 to-slate-500"
            : "from-red-600 to-red-500"
        } hover:opacity-90 transition-opacity rounded-md py-80 text-white font-bold text-2xl`}
      >
        Spied!
      </button>
    </div>
  );
};
