import { useState } from "react";
import { constants } from "../../../../constants";
import { useConfirmation } from "../../../universal/ConfirmationWindowContext";
import { useToast } from "../../../universal/Toast";
import { IGame } from "../../interface/IGame";
import { IInstance } from "../../interface/IInstance";
import { useNavigate } from "react-router-dom";

export const StartStop = ({
  game,
  instance,
  instanceId,
}: {
  game: IGame;
  instance: IInstance;
  instanceId: string;
}) => {
  const confirm = useConfirmation();
  const showToast = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(!!instance.game_started);

  const startGame = async () => {
    setIsLoading(true);
    const confirmed = await confirm(`Sākt spēli ${game.title}?`);
    if (!confirmed) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${constants.baseApiUrl}/game-control`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
          )}`,
        },
        body: JSON.stringify({
          command: "start",
          instance_id: instanceId,
        }),
      });

      if (!response.ok) throw new Error("Game start failed");
      showToast(true, "Spēle sākta");
      setGameStarted(true);
    } catch (error) {
      showToast(false, "Kļūda: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeGame = async () => {
    setIsLoading(true);
    if (await confirm(`Slēgt spēli ${game.title}?`)) {
      try {
        await fetch(`${constants.baseApiUrl}/game-control`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              constants.localStorage.TOKEN
            )}`,
          },
          body: JSON.stringify({
            command: "end",
            instance_id: instanceId,
          }),
        });
        showToast(true, "Spēle slēgta");
        navigate("/admin/games");
      } catch (error) {
        showToast(false, "Kļūda:" + error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="gap-4 flex">
      <button
        disabled={isLoading}
        onClick={closeGame}
        className={`h-10 w-32 rounded-sm ${
          isLoading ? "bg-slate-400" : " bg-red-500 hover:bg-red-600"
        } text-white font-bold transition-all`}
      >
        <i className="fa-xmark fa-solid me-2"></i>
        Slēgt spēli
      </button>
      <button
        disabled={isLoading || gameStarted}
        onClick={startGame}
        className={`h-10 w-32 rounded-sm ${
          isLoading || gameStarted
            ? "bg-slate-400"
            : "bg-emerald-500 hover:bg-emerald-600"
        }  text-white font-bold  transition-all`}
      >
        <i className="fa-play fa-solid me-2"></i>
        Sākt spēli
      </button>
    </div>
  );
};
