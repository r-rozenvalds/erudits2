import { createContext, ReactNode, useContext, useState } from "react";
import { IGame } from "./interfaces/creator/IGame";
import { IRound } from "./interfaces/creator/IRound";
import { IQuestion } from "./interfaces/creator/IQuestion";

type CreatorStoreType = {
  selectedGame?: IGame;
  selectedRound?: IRound;
  selectedQuestion?: IQuestion;

  setSelectedGame: (game: IGame) => void;
  setSelectedRound: (round: IRound) => void;
  setSelectedQuestion: (question: IQuestion) => void;
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

  return (
    <CreatorStore.Provider
      value={{
        selectedGame,
        selectedRound,
        selectedQuestion,
        setSelectedGame,
        setSelectedQuestion,
        setSelectedRound,
      }}
    >
      {children}
    </CreatorStore.Provider>
  );
};
