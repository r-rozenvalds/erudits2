import { useEffect } from "react";
import { constants } from "../../../constants";
import { PlayerLocalStorage } from "../enum/PlayerLocalStorage";
import { usePlayer } from "../../universal/PlayerContext";
export const BuzzerView = () => {
  const { buzzerEnabled, setBuzzerEnabled } = usePlayer();

  const handleBuzz = async () => {
    if (!buzzerEnabled) return;
    setBuzzerEnabled(false);

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
        buzzed_at: new Date().getTime(),
      }),
    });
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
        key={buzzerEnabled?.toString()}
        disabled={!buzzerEnabled}
        onClick={handleBuzz}
        className={`w-full bg-gradient-to-b ${
          !buzzerEnabled
            ? "from-slate-600 to-slate-500"
            : "from-red-600 to-red-500 hover:opacity-90"
        } transition-opacity rounded-md py-80 text-white font-bold text-2xl`}
      >
        {!!buzzerEnabled && "Spied!"}
      </button>
    </div>
  );
};
