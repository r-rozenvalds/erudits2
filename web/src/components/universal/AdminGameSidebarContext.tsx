import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IGame } from "../admin/interface/IGame";
import { IRound } from "../admin/interface/IRound";
import { IQuestion } from "../admin/interface/IQuestion";
import { AdminSessionStorage } from "../admin/enum/AdminSessionStorage";

type AdminSidebarContextType = {
  game: IGame | undefined;
  rounds: IRound[] | undefined;
  questions: IQuestion[] | undefined;
  setGame: (game: IGame) => void;
  setRounds: (rounds: IRound[]) => void;
  setQuestions: (questions: IQuestion[]) => void;
  clearSidebar: () => void;
};

const AdminGameSidebarContext = createContext<
  AdminSidebarContextType | undefined
>(undefined);

export const useSidebar = () => {
  const context = useContext(AdminGameSidebarContext);
  if (!context) {
    throw new Error(
      "AdminGameSidebarContext must be used within a AdminGameSidebarProvider"
    );
  }
  return context;
};

export const AdminSidebarProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<IGame | undefined>(undefined);
  const [roundsState, setRoundsState] = useState<IRound[] | undefined>(
    undefined
  );
  const [questionsState, setQuestionsState] = useState<IQuestion[] | undefined>(
    undefined
  );

  const setGame = (game: IGame) => {
    setGameState(game);
  };
  const setRounds = (rounds: IRound[]) => {
    setRoundsState(rounds);
  };
  const setQuestions = (questions: IQuestion[]) => {
    setQuestionsState(questions);
  };

  const clearSidebar = () => {
    setGameState(undefined);
    setRoundsState(undefined);
    setQuestionsState(undefined);
  };

  useEffect(() => {
    if (gameState) {
      sessionStorage.setItem(
        AdminSessionStorage.sidebarGame,
        JSON.stringify(gameState)
      );
    }
  }, [gameState]);

  useEffect(() => {
    if (questionsState) {
      sessionStorage.setItem(
        AdminSessionStorage.sidebarQuestions,
        JSON.stringify(questionsState)
      );
    }
  }, [questionsState]);

  useEffect(() => {
    if (roundsState) {
      sessionStorage.setItem(
        AdminSessionStorage.sidebarRounds,
        JSON.stringify(roundsState)
      );
    }
  }, [roundsState]);

  useEffect(() => {
    const game = JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.sidebarGame) || "[]"
    ) as IGame;
    const rounds = JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.sidebarRounds) || "[]"
    ) as IRound[];
    const questions = JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.sidebarQuestions) || "[]"
    ) as IQuestion[];

    if (Object.keys(game).length > 0) {
      setGameState(game);
    }
    if (rounds.length > 0) {
      setRoundsState(rounds);
    }
    if (questions.length > 0) {
      setQuestionsState(questions);
    }
  }, []);

  return (
    <AdminGameSidebarContext.Provider
      value={{
        game: gameState,
        rounds: roundsState,
        questions: questionsState,
        setGame,
        setRounds,
        setQuestions,
        clearSidebar,
      }}
    >
      {children}
    </AdminGameSidebarContext.Provider>
  );
};
