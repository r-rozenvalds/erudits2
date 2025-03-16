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
import { constants } from "../../constants";
import { useParams } from "react-router-dom";

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
  const [game, setGame] = useState<IGame | undefined>(undefined);
  const [rounds, setRounds] = useState<IRound[] | undefined>(undefined);
  const [questions, setQuestions] = useState<IQuestion[] | undefined>(
    undefined
  );

  const { gameId } = useParams();

  const getGameData = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/full-game/${gameId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
          )}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setGame(data.game);
      setRounds(data.rounds);
      setQuestions(data.questions);
    }
  };

  const clearSidebar = () => {
    setGame(undefined);
    setRounds(undefined);
    setQuestions(undefined);
  };

  useEffect(() => {
    getGameData();
  }, []);

  return (
    <AdminGameSidebarContext.Provider
      value={{
        game,
        rounds,
        questions,
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
