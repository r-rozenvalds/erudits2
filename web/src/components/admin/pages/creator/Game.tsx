import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gameStore } from "../../../../stores/GameStore";
import { IGameQueryModel } from "../../../../stores/interfaces/query/IGameQueryModel";
import { SpinnerCircularFixed } from "spinners-react";
import { SaveDeleteButtons } from "../../ui/SaveDeleteButtons";

export const AdminGameCreator = () => {
  const [isLoaded, setIsLoaded] = useState(false); // for debounce
  const [isLoading, setIsLoading] = useState(false); // for spinner
  // const { setBreadCrumbs, clearBreadCrumbs } = useBreadCrumbs();
  const { getGame, game, setGame, postGame } = gameStore();
  const { gameId } = useParams();

  useEffect(() => {
    getGame({
      id: gameId,
      add_rounds: true,
      add_questions: true,
      add_answers: true,
      limit: 1,
      page: 1,
    } as IGameQueryModel);
  }, []);

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (await postGame()) {
      // navigate
    }
  };

  if (!game) {
    return (
      <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white place-items-center justify-center font-semibold gap-2">
        Tiek veikta ielāde...
        <SpinnerCircularFixed color="#fff" size="18" thickness={210} />
      </div>
    );
  }

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
            onChange={(e) => setGame({ ...game, title: e.target.value })}
            type="text"
            className="p-2 px-4 shadow-sm rounded-sm bg-slate-100"
            value={game.title}
          />
          <label className="text-lg font-semibold">Apraksts</label>
          <textarea
            onChange={(e) => setGame({ ...game, description: e.target.value })}
            value={game.description}
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
                {game.rounds?.map((r) => r.questions?.length)}
              </span>
            </div>
            <div>
              Izveidots
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
