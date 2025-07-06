import { useEffect, useState } from "react";
import { ActivationModal } from "../ui/ActivationModal";
import { AdminGameTable } from "../ui/table/AdminGameTable";
import { IGame } from "../../../stores/interfaces/creator/IGame";
import { Navbar } from "../navbar/Navbar";
import { SelectedGame } from "../ui/SelectedGame";
import { gameStore } from "../../../stores/GameStore";
import { IGameQueryModel } from "../../../stores/interfaces/query/IGameQueryModel";
import { useConfirmation } from "../../universal/ConfirmationWindowContext";
import { useNavigate } from "react-router-dom";

export const AdminGames = () => {
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<IGame | undefined>(
    undefined
  );
  const [textFilter, setTextFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    getGames,
    query,
    setQuery,
    deleteGame,
    deactivateGame,
    duplicateGame,
  } = gameStore();
  const confirm = useConfirmation();
  const navigate = useNavigate();

  const onModalClose = async (success?: boolean) => {
    setIsActivationModalOpen(false);
    if (success) {
      await getGames(query);
    }
    setIsLoading(false);
  };

  const onActivationModalOpen = (game: IGame) => {
    setIsLoading(true);
    setSelectedGame(game);
    setIsActivationModalOpen(true);
  };

  const handleDelete = async (game: IGame) => {
    setIsLoading(true);
    if (await confirm(`Tiešām dzēst spēli ${game.title}?`)) {
      await deleteGame(game.id);
      await getGames(query);
    }
    setIsLoading(false);
  };

  const handleEdit = (game: IGame) => {
    navigate(`/admin/creator/${game.id}`);
  };

  const handleDeactivate = async (game: IGame) => {
    setIsLoading(true);
    if (await confirm(`Tiešām deaktivizēt spēli ${game.title}?`)) {
      await deactivateGame(game.id);
      await getGames(query);
      setSelectedGame(undefined);
    }
    setIsLoading(false);
  };

  function handleDuplicate(game: IGame): void {
    throw new Error("Function not implemented.");
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery({ ...query, filter: textFilter });
      getGames({ ...query, filter: textFilter } as IGameQueryModel);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [textFilter]);

  return (
    <div className="flex gap-4 flex-1 flex-col">
      <Navbar sectionTitle={"Manas spēles"} />
      <div className="flex grow gap-2">
        <AdminGameTable
          onActivationModalOpen={onActivationModalOpen}
          setSelectedGame={setSelectedGame}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
        />
        <div className="flex flex-col gap-2 grow">
          <div className="w-full h-12 bg-white px-2 py-1 flex gap-2 place-items-center rounded-sm justify-center">
            <input
              className="h-full w-full p-2 outline-none font-semibold"
              placeholder="Meklē šeit..."
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
            />
            <i className="text-slate-400 fa-solid fa-magnifying-glass text-lg px-2"></i>
          </div>
          <SelectedGame
            game={selectedGame}
            onActivationModalOpen={onActivationModalOpen}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onEdit={handleEdit}
            isLoading={isLoading}
            onDeactivate={handleDeactivate}
          />
        </div>
      </div>
      {isActivationModalOpen && selectedGame && (
        <ActivationModal game={selectedGame} onClose={onModalClose} />
      )}
    </div>
  );
};
