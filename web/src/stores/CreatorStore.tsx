import { createContext, ReactNode, useContext, useState } from "react";
import { IGame } from "./interfaces/creator/IGame";
import { IRound } from "./interfaces/creator/IRound";
import { IQuestion } from "./interfaces/creator/IQuestion";
import { IGameQueryModel } from "./interfaces/query/IGameQueryModel";
import { gameStore } from "./GameStore";

type CreatorStoreType = {
  selectedGame?: IGame;
  selectedRound?: IRound;
  selectedQuestion?: IQuestion;

  setSelectedGame: (game: IGame | undefined) => void;
  setSelectedRound: (round: IRound | undefined) => void;
  setSelectedQuestion: (question: IQuestion | undefined) => void;

  fetchCurrentGame: (gameId: string) => Promise<void>;
};

const CreatorStore = createContext<CreatorStoreType | undefined>(undefined);

export const creatorStore = () => {
  const context = useContext(CreatorStore);
  if (!context) {
    throw new Error("Context must be used within a provider!");
  }

  return context;
};

export const CreatorProvider = ({ children }: { children: ReactNode }) => {
  const [selectedGame, setSelectedGame] = useState<IGame | undefined>(
    undefined
  );
  const [selectedRound, setSelectedRound] = useState<IRound | undefined>(
    undefined
  );
  const [selectedQuestion, setSelectedQuestion] = useState<
    IQuestion | undefined
  >(undefined);

  const { getGames } = gameStore();

  const fetchCurrentGame = async (gameId: string) => {
    await getGames({
      id: gameId,
      add_rounds: true,
      add_questions: true,
      add_answers: true,
      limit: 1,
      page: 1,
    } as IGameQueryModel);
  };

  return (
    <CreatorStore.Provider
      value={{
        selectedGame,
        selectedRound,
        selectedQuestion,
        //gameId,
        setSelectedGame,
        setSelectedQuestion,
        setSelectedRound,
        fetchCurrentGame,
      }}
    >
      {children}
    </CreatorStore.Provider>
  );
};
