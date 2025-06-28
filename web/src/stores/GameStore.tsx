import { createContext, ReactNode, useContext, useState } from "react";
import { IGame } from "./interfaces/creator/IGame";
import { IRound } from "./interfaces/creator/IRound";
import { IQuestion } from "./interfaces/creator/IQuestion";
import { IAnswer } from "./interfaces/creator/IAnswer";
import { useToast } from "../components/universal/Toast";
import { localization, localizeError } from "../localization";

type GameStoreType = {
  game?: IGame;
  rounds?: IRound[];
  questions?: IQuestion[];
  answers?: IAnswer[];
  setGame: (game: IGame) => void;
  setRounds: (rounds: IRound[]) => void;
  setQuestions: (questions: IQuestion[]) => void;
  setAnswers: (answer: IAnswer[]) => void;
};

const GameStore = createContext<GameStoreType | undefined>(undefined);

export const gameStore = () => {
  const context = useContext(GameStore);
  if (!context) {
    throw new Error("Context must be used within a provider!");
  }

  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<IGame>();
  const [rounds, setRounds] = useState<IRound[]>([]);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<IAnswer[]>([]);

  // const { get, post } = useApi();
  const showToast = useToast();

  const getGame = (id: string) => {
    try {
      if (!id) {
        throw new Error(localization.en.errors.gameNotFound);
      }
    } catch (error: any) {
      showToast(false, localizeError(error?.message) ?? "Unknown error");
    }
  };

  const postGame = () => {
    try {
      if (!game) {
        throw new Error(localization.en.errors.savingGame);
      }
    } catch (error: any) {
      showToast(false, localizeError(error?.message) ?? "Unknown error");
    }
  };

  const postRounds = () => {
    try {
      if (!game) {
        throw new Error(localization.en.errors.savingRound);
      }
    } catch (error: any) {
      showToast(false, localizeError(error?.message) ?? "Unknown error");
    }
  };

  const postQuestions = () => {
    try {
      if (!game) {
        throw new Error(localization.en.errors.savingQuestion);
      }
    } catch (error: any) {
      showToast(false, localizeError(error?.message) ?? "Unknown error");
    }
  };

  const postAnswers = () => {
    try {
      if (!game) {
        throw new Error(localization.en.errors.savingAnswer);
      }
    } catch (error: any) {
      showToast(false, localizeError(error?.message) ?? "Unknown error");
    }
  };

  return (
    <GameStore.Provider
      value={{
        game,
        rounds,
        questions,
        answers,
        setGame,
        setRounds,
        setQuestions,
        setAnswers,
      }}
    >
      {children}
    </GameStore.Provider>
  );
};
