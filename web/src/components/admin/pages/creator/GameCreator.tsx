import { FormEvent, useState } from "react";
import { gameStore } from "../../../../stores/GameStore";
import { SaveDeleteButtons } from "../../ui/SaveDeleteButtons";
import { IGame } from "../../../../stores/interfaces/creator/IGame";

interface IGameCreator {
  game: IGame;
}

export const GameCreator = ({ game }: IGameCreator) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState<string>(game.title);
  const [description, setDescription] = useState<string>(game.description);

  const { postGame } = gameStore();

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const request = {
      ...game,
      title,
      description,
    } as IGame;

    await postGame(request);
  };

  const handleDelete = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
      <form
        onSubmit={(e) => onFormSubmit(e)}
        className="flex flex-col gap-2 w-full justify-between"
      >
        <div className="flex flex-col gap-2 h-full">
          <label className="text-lg font-semibold">Spēles nosaukums</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="p-2 px-4 shadow-sm rounded-sm bg-slate-100"
            value={title}
          />
          <label className="text-lg font-semibold">Apraksts</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="p-2 px-4 shadow-sm rounded-sm bg-slate-100 resize-none grow"
          />
          <label className="text-lg font-semibold">Papildu informācija</label>
          <div className="flex justify-around mt-2">
            <div>
              Kārtas
              <span className="px-4 py-2 rounded-sm bg-slate-200 font-semibold ms-2">
                {game.rounds?.length}
              </span>
            </div>
            <div>
              Jautājumi
              <span className="px-4 py-2 rounded-sm bg-slate-200 font-semibold ms-2">
                {game.rounds?.reduce(
                  (total, round) => total + (round.questions?.length || 0),
                  0
                )}
              </span>
            </div>
            <div>
              Izveidota
              <span className="px-4 py-2 rounded-sm bg-slate-200 font-semibold ms-2">
                {new Date(game.created_at).toLocaleString("lv-lv")}
              </span>
            </div>
            <div>
              Pēdējoreiz spēlēta
              <span className="px-4 py-2 rounded-sm bg-slate-200 font-semibold ms-2">
                {game.last_activation
                  ? new Date(game.last_activation).toLocaleString("lv-lv")
                  : "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mt-8">
          <SaveDeleteButtons
            showSpinner={isLoading}
            onDelete={handleDelete}
            showNavigationButtons
          />
        </div>
      </form>
    </div>
  );
};
