import { constants } from "../../../../constants";
import { useConfirmation } from "../../../universal/ConfirmationWindowContext";
import { useToast } from "../../../universal/Toast";
import { IGame } from "../../interface/IGame";

export const StartStop = ({
  instanceId,
  game,
}: {
  instanceId: string;
  game: IGame;
}) => {
  const confirm = useConfirmation();
  const showToast = useToast();

  const startGame = async () => {
    if (await confirm(`Sākt spēli ${game.title}?`)) {
    }
    return;
  };

  const closeGame = async () => {
    if (await confirm(`Slēgt spēli ${game.title}?`)) {
    }
    return;
  };

  const ping = async () => {
    try {
      await fetch(`${constants.baseApiUrl}/ping`);
    } catch (error) {
      console.error("Error sending ping:", error);
    }
  };

  return (
    <div className="gap-4 flex">
      <button
        onClick={ping}
        className="h-10 w-14 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all"
      >
        <i className="fa-solid fa-table-tennis-paddle-ball"></i>
      </button>
      <button
        onClick={closeGame}
        className="h-10 w-32 rounded-md bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
      >
        <i className="fa-xmark fa-solid me-2"></i>
        Slēgt spēli
      </button>
      <button
        onClick={startGame}
        className="h-10 w-32 rounded-md bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all"
      >
        <i className="fa-play fa-solid me-2"></i>
        Sākt spēli
      </button>
    </div>
  );
};
