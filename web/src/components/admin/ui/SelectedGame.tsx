import { IGame } from "../../../stores/interfaces/creator/IGame";

interface ISelectedGameProps {
  game?: IGame;
  onActivationModalOpen: (game: IGame) => void;
  onEdit: (game: IGame) => void;
  onDuplicate: (game: IGame) => void;
  onDelete: (game: IGame) => void;
  onDeactivate: (game: IGame) => void;
  isLoading: boolean;
}

export const SelectedGame = ({
  game,
  onActivationModalOpen,
  onEdit,
  onDuplicate,
  onDelete,
  onDeactivate,
  isLoading,
}: ISelectedGameProps) => {
  return game ? (
    <div className="flex flex-col bg-white grow p-4 rounded-sm justify-between">
      <div>
        <span className="font-semibold text-xl">{game.title}</span>
        <p className="text-sm font-medium mt-2">{game.description}</p>
      </div>
      <div className="flex gap-4">
        {game.is_active ? (
          <button
            onClick={() => onDeactivate(game)}
            disabled={isLoading}
            className={`${
              isLoading ? "bg-slate-400" : "bg-[#E63946]"
            } rounded-md text-white font-semibold flex-1 aspect-square max-h-28 hover:bg-red-400 transition-all`}
          >
            <i className="fa-solid fa-stop text-3xl mb-2"></i>
            <br />
            <span className="text-xl">Deaktivizēt</span>
          </button>
        ) : (
          <button
            onClick={() => onActivationModalOpen(game)}
            disabled={isLoading}
            className={`${
              isLoading ? "bg-slate-400" : "bg-[#E63946]"
            } rounded-md text-white font-semibold flex-1 aspect-square max-h-28 hover:bg-red-400 transition-all`}
          >
            <i className="fa-solid fa-play text-3xl mb-2"></i>
            <br />
            <span className="text-xl">Aktivizēt</span>
          </button>
        )}
        <button
          onClick={() => onEdit(game)}
          disabled={isLoading}
          className={`${
            isLoading ? "bg-slate-400" : "bg-[#E63946]"
          } rounded-md text-white font-semibold flex-1 aspect-square max-h-28 hover:bg-red-400 transition-all`}
        >
          <i className="fa-solid fa-wrench text-3xl mb-2"></i>
          <br />
          <span className="text-xl">Labot</span>
        </button>
        <button
          onClick={() => onDuplicate(game)}
          disabled={isLoading}
          className={`${
            isLoading ? "bg-slate-400" : "bg-[#E63946]"
          } rounded-md text-white font-semibold flex-1 aspect-square max-h-28 hover:bg-red-400 transition-all`}
        >
          <i className="fa-solid fa-clone text-3xl mb-2"></i>
          <br />
          <span className="text-xl">Dublicēt</span>
        </button>
        <button
          onClick={() => onDelete(game)}
          disabled={isLoading}
          className={`${
            isLoading ? "bg-slate-400" : "bg-[#E63946]"
          } rounded-md text-white font-semibold flex-1 aspect-square max-h-28 hover:bg-red-400 transition-all`}
        >
          <i className="fa-solid fa-trash-can text-3xl mb-2"></i>
          <br />
          <span className="text-xl">Dzēst</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col bg-white grow p-4 rounded-sm justify-center place-items-center text-slate-400">
      <i className="fa-solid fa-cube text-5xl mb-4"></i>
      <br />
      <span className="font-semibold text-xl">Atlasi kādu spēli!</span>
    </div>
  );
};
