import { useConfirmation } from "../../../universal/ConfirmationWindowContext";
import { IGame } from "../../interface/IGame";

export const StartStop = ({ game }: { game: IGame | null }) => {
  const confirm = useConfirmation();

  const startGame = async () => {
    if (await confirm(`Sākt spēli ${game?.title}?`)) {
    }
    return;
  };

  const closeGame = async () => {
    if (await confirm(`Slēgt spēli ${game?.title}?`)) {
    }
    return;
  };

  return (
    <div className="gap-4 flex">
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
