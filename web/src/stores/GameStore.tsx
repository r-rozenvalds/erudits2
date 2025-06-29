import { createContext, ReactNode, useContext, useState } from "react";
import { IGame } from "./interfaces/creator/IGame";
import { IRound } from "./interfaces/creator/IRound";
import { IQuestion } from "./interfaces/creator/IQuestion";
import { IAnswer } from "./interfaces/creator/IAnswer";
import { useToast } from "../components/universal/Toast";
import { localization, localizeError } from "../localization";
import { useApi } from "../components/universal/RequestBuilder";
import { IGameQueryModel } from "./interfaces/query/IGameQueryModel";

type GameStoreType = {
  game?: IGame;
  rounds?: IRound[];
  questions?: IQuestion[];
  answers?: IAnswer[];
  setGame: (game: IGame) => void;
  setRounds: (rounds: IRound[]) => void;
  setQuestions: (questions: IQuestion[]) => void;
  setAnswers: (answer: IAnswer[]) => void;
  getGame: (query: IGameQueryModel) => void;
  postGame: () => Promise<boolean>;
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

  const { get, post } = useApi();
  const showToast = useToast();

  const getGame = async (query: IGameQueryModel) => {
    const response = await get<IGame, IGameQueryModel>("/games", query);
    if (response.total_items === 0) {
      showToast(
        false,
        localizeError(localization.en.errors.gameNotFound) ?? "Unknown error"
      );
      return;
    }
    setGame(response.items[0]);
  };

  const postGame = async () => {
    if (!game) {
      showToast(false, localizeError(localization.en.errors.gameNotFound));
      return false;
    }
    return await post<boolean, IGame>("games", game);
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
        getGame,
        postGame,
      }}
    >
      {children}
    </GameStore.Provider>
  );
};
