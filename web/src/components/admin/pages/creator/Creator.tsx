import { useEffect, useState } from "react";
import { Navbar } from "../../navbar/Navbar";
import { useParams } from "react-router-dom";
import { gameStore } from "../../../../stores/GameStore";
import { SpinnerCircularFixed } from "spinners-react/lib/esm/SpinnerCircularFixed";
import { creatorStore } from "../../../../stores/CreatorStore";
import { IGame } from "../../../../stores/interfaces/creator/IGame";
import { Sidebar } from "./sidebar/Sidebar";
import { GameCreator } from "./GameCreator";
import { QuestionCreator } from "./QuestionCreator";
import { RoundCreator } from "./RoundCreator";

export const Creator = () => {
  const { games } = gameStore();
  const { gameId } = useParams();

  const {
    setSelectedGame,
    setSelectedQuestion,
    setSelectedRound,
    selectedGame,
    selectedRound,
    selectedQuestion,
    fetchCurrentGame,
  } = creatorStore();

  useEffect(() => {
    if (gameId) fetchCurrentGame(gameId);
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
    if (!games?.items || games.items.length < 1 || !gameId) {
      return (
        <div className="flex gap-2">
          Tiek veikta ielāde...
          <SpinnerCircularFixed color="#fff" size="18" thickness={210} />
        </div>
      );
    }
    if (selectedGame) {
      return <GameCreator game={selectedGame} />;
    }
    if (selectedRound) {
      return <RoundCreator round={selectedRound} />;
    }
    if (selectedQuestion) {
      return <QuestionCreator question={selectedQuestion} />;
    }
  };

  return (
    <div className="flex gap-4 flex-1 flex-col">
      <Navbar sectionTitle={"Spēles veidotājs"} />
      <div className="flex gap-4 h-full">
        <div className="w-[500px] px-4 py-2 h-full overflow-hidden rounded-md font-[Manrope] grow bg-white">
          <Sidebar />
        </div>
        <div className="flex w-full rounded-md font-[Manrope] grow bg-white font-semibold gap-2">
          {renderCreator()}
        </div>
      </div>
    </div>
  );
};
