import { useEffect, useState } from "react";
import { constants } from "../../../../constants";
import { useConfirmation } from "../../../universal/ConfirmationWindowContext";
import { useToast } from "../../../universal/Toast";
import { IGame } from "../../interface/IGame";
import echo from "../../../../useEcho";
import { IInstance } from "../../interface/IInstance";

export const StartStop = ({
  instanceId,
  game,
  instance,
}: {
  instanceId: string;
  game: IGame;
  instance: IInstance;
}) => {
  const confirm = useConfirmation();
  const showToast = useToast();
  const [isPinging, setIsPinging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(instance.current_round !== null);

  const startGame = async () => {
    setIsLoading(true);
    if (await confirm(`Sākt spēli ${game.title}?`)) {
      try {
        await fetch(`${constants.baseApiUrl}/game-control`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            command: "start",
            instance_id: instanceId,
          }),
        });
        setIsStarted(true);
        showToast(true, "Spēle sākta");
      } catch (error) {
        showToast(false, "Kļūda:" + error);
      } finally {
        setIsLoading(false);
      }
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
          },
          body: JSON.stringify({
            command: "end",
            instance_id: instanceId,
          }),
        });
        showToast(true, "Spēle slēgta");
        setTimeout(() => {
          window.location.assign("/admin/games");
        }, 2000);
      } catch (error) {
        showToast(false, "Kļūda:" + error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handlePingResponse = (data: any) => {
      const serverTimestamp = new Date(data.receivedAt).getTime();
      const pingTimestamp = data.pingTime;
      const timeTaken = serverTimestamp - pingTimestamp;
      showToast(true, "Ping: " + timeTaken + "ms");
      setIsPinging(false);
    };

    echo.channel("ping-channel").listen(".ping-event", handlePingResponse);

    return () => {
      echo
        .channel("ping-channel")
        .stopListening(".ping-event", handlePingResponse);
    };
  }, []); // Only run this effect once, on component mount

  const ping = async () => {
    setIsPinging(true);
    const pingTimestamp = Date.now();

    await fetch(`${constants.baseApiUrl}/ping?ping_time=${pingTimestamp}`);

    setIsPinging(false);
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
        disabled={isLoading || isStarted}
        onClick={startGame}
        className={`h-10 w-32 rounded-md ${
          isLoading || isStarted
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
