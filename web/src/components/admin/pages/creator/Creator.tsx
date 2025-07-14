import { useEffect, useState } from "react";
import { Navbar } from "../../navbar/Navbar";
import { useParams } from "react-router-dom";
import { gameStore } from "../../../../stores/GameStore";
import { IGameQueryModel } from "../../../../stores/interfaces/query/IGameQueryModel";
import { SpinnerCircularFixed } from "spinners-react/lib/esm/SpinnerCircularFixed";
import { creatorStore } from "../../../../stores/CreatorStore";
import { IGame } from "../../../../stores/interfaces/creator/IGame";
import { Sidebar } from "./sidebar/Sidebar";

enum Components {
  GAME = "GAME",
  ROUND = "ROUND",
  QUESTION = "QUESTION",
}

export const Creator = () => {
  const [selectedComponent, setSelectedComponent] = useState<Components>(
    Components.GAME
  );

  const { getGames, games } = gameStore();
  const { gameId } = useParams();

  const {
    setSelectedGame,
    setSelectedQuestion,
    setSelectedRound,
    selectedGame,
    selectedRound,
    selectedQuestion,
  } = creatorStore();

  useEffect(() => {
    if (gameId) {
      getGames({
        id: gameId,
        add_rounds: true,
        add_questions: true,
        add_answers: true,
        limit: 1,
        page: 1,
      } as IGameQueryModel);
    }
  }, []);

  useEffect(() => {
    if (games?.items && games.items.length > 0) {
      setSelectedGame(games?.items[0]);
    } else {
      setSelectedGame({
        title: "Jauna spēle",
        description: "Spēles apraksts",
      } as IGame);
    }
  }, [games?.items]);

  const renderCreator = () => {
    if (!games?.items || games.items.length < 1) {
      return (
        <div className="flex gap-2">
          Tiek veikta ielāde...
          <SpinnerCircularFixed color="#fff" size="18" thickness={210} />
        </div>
      );
    }
  };

  const getNavbarTitle = () => {
    switch (selectedComponent) {
      case Components.GAME: {
        return selectedGame ? selectedGame.title : "Jauna spēle";
      }
      case Components.ROUND: {
        return selectedRound ? selectedRound.title : "Jauna kārta";
      }
      case Components.QUESTION: {
        return selectedQuestion ? selectedQuestion.title : "Jauns jautājums";
      }
      default: {
        return "Spēles veidotājs";
      }
    }
  };

  return (
    <div className="flex gap-4 flex-1 flex-col">
      <Navbar sectionTitle={getNavbarTitle()} />
      <div className="flex gap-4 h-full">
        <div className="w-[500px] p-4 h-full overflow-hidden rounded-md font-[Manrope] grow bg-white">
          <Sidebar />
        </div>
        <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white place-items-center justify-center font-semibold gap-2">
          {renderCreator()}
        </div>
      </div>
    </div>
  );
};
