import { useCallback, useEffect, useState } from "react";
import { constants } from "../../../../constants";
import { useConfirmation } from "../../../universal/ConfirmationWindowContext";
import { useToast } from "../../../universal/Toast";
import echo from "../../../../useEcho";
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

  const [isPinging, setIsPinging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(!!instance.round_started_at);

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

  const handlePingResponse = useCallback(
    (data: any) => {
      const serverTimestamp = new Date(data.receivedAt).getTime();
      const pingTimestamp = data.pingTime;
      const timeTaken = serverTimestamp - pingTimestamp;
      showToast(true, "Ping: " + timeTaken + "ms");
      setIsPinging(false);
    },
    [showToast, setIsPinging]
  );

  useEffect(() => {
    echo.channel("ping-channel").listen(".ping-event", handlePingResponse);

    return () => {
      echo
        .channel("ping-channel")
        .stopListening(".ping-event", handlePingResponse);
    };
  }, [handlePingResponse]);

  const ping = async () => {
    setIsPinging(true);
    const pingTimestamp = Date.now();

    try {
      const response = await fetch(
        `${constants.baseApiUrl}/ping?ping_time=${pingTimestamp}`
      );
      if (!response.ok) throw new Error("Ping request failed");
    } catch (error) {
      showToast(false, "Ping failed: " + error);
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="gap-4 flex">
      <button
        onClick={ping}
        disabled={isPinging}
        className={`h-10 w-14 rounded-md ${
          isPinging ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white font-bold  transition-all`}
      >
        <i className="fa-solid fa-table-tennis-paddle-ball"></i>
      </button>
      <button
        disabled={isLoading}
        onClick={closeGame}
        className={`h-10 w-32 rounded-md ${
          isLoading ? "bg-slate-400" : " bg-red-500 hover:bg-red-600"
        } text-white font-bold transition-all`}
      >
        <i className="fa-xmark fa-solid me-2"></i>
        Slēgt spēli
      </button>
      <button
        disabled={isLoading || gameStarted}
        onClick={startGame}
        className={`h-10 w-32 rounded-md ${
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
