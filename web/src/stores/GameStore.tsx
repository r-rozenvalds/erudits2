import { createContext, ReactNode, useContext, useState } from "react";
import { IGame } from "./interfaces/creator/IGame";
import { IRound } from "./interfaces/creator/IRound";
import { IQuestion } from "./interfaces/creator/IQuestion";
import { IAnswer } from "./interfaces/creator/IAnswer";
import { useApi } from "../components/universal/RequestBuilder";
import { IGameQueryModel } from "./interfaces/query/IGameQueryModel";
import { IPagedResult } from "./interfaces/IPagedResult";
import { IActivateGameRequestModel } from "./interfaces/request/IActivateGameRequestModel";

type GameStoreType = {
  games?: IPagedResult<IGame>;
  query: IGameQueryModel;
  getGames: (query?: IGameQueryModel) => Promise<void>;
  postGame: (game: IGame) => Promise<boolean>;
  postRound: (round: IRound) => Promise<boolean>;
  postQuestion: (question: IQuestion) => Promise<boolean>;
  postAnswer: (answer: IAnswer) => Promise<boolean>;
  setQuery: (query: IGameQueryModel) => void;
  deleteGame: (id: string) => Promise<boolean>;
  activateGame: (request: IActivateGameRequestModel) => Promise<boolean>;
  deactivateGame: (id: string) => Promise<boolean>;
  duplicateGame: (id: string) => Promise<boolean>;
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
  const [games, setGames] = useState<IPagedResult<IGame>>();
  const [query, setQuery] = useState<IGameQueryModel>({
    page: 1,
    limit: 15,
  } as IGameQueryModel);
  const { get, post } = useApi();

  const getGames = async (query?: IGameQueryModel) => {
    setGames(await get<IGame, IGameQueryModel>("/games", query));
  };

  const postGame = async (game: IGame) => {
    return await post<boolean, IGame>("/games", game);
  };

  const postRound = async (round: IRound) => {
    return await post<boolean, IRound>("/rounds", round);
  };

  const postQuestion = async (question: IQuestion) => {
    return await post<boolean, IQuestion>("/questions", question);
  };

  const postAnswer = async (answer: IAnswer) => {
    return await post<boolean, IAnswer>("/questions", answer);
  };

  const deleteGame = async (id: string) => {
    return await post<boolean>(`/games/delete/${id}`);
  };

  const activateGame = async (request: IActivateGameRequestModel) => {
    return await post<boolean, IActivateGameRequestModel>("/activate", request);
  };

  const deactivateGame = async (id: string) => {
    return await post<boolean>(`/deactivate/${id}`);
  };

  const duplicateGame = async (id: string) => {
    return await post<boolean>(`/duplicate-game/${id}`);
  };

  return (
    <GameStore.Provider
      value={{
        games,
        query,
        getGames,
        postGame,
        postRound,
        postQuestion,
        postAnswer,
        setQuery,
        deleteGame,
        activateGame,
        deactivateGame,
        duplicateGame,
      }}
    >
      {children}
    </GameStore.Provider>
  );
};
