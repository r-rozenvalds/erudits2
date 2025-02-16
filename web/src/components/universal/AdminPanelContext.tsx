import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import echo from "../../useEcho";
import { IPlayer } from "../admin/interface/IPlayer";
import { IQuestion } from "../admin/interface/IQuestion";
import { constants } from "../../constants";
import { IGame } from "../admin/interface/IGame";
import { IInstance } from "../admin/interface/IInstance";
import { IRound } from "../admin/interface/IRound";
import { useParams } from "react-router-dom";
import { ITitleId } from "../admin/interface/ITitleId";

export interface IPlayerAnswer {
  player_name: string;
  questions: IInstanceQuestion[];
}

interface IInstanceQuestion {
  id: string;
  title: string;
  answer: string;
  is_correct: number;
}

interface IInfo {
  players: number;
  answered_players: number;
  current_question: string;
  answer_time: number;
  current_round: string;
  started: boolean;
  round_questions: IQuestion[];
}

type AdminPanelContextType = {
  currentRound: ITitleId | undefined;
  setCurrentRound: (round: ITitleId) => void;
  currentQuestion: ITitleId | undefined;
  setCurrentQuestion: (question: ITitleId) => void;
  players: IPlayer[];
  info: IInfo | undefined;
  answers: IPlayerAnswer[];
  instanceId: string | undefined;
  fetchPlayers: () => void;
  fetchPlayerAnswers: () => void;
  fetchQuestionInfo: () => void;
  setPlayers: (players: IPlayer[]) => void;
  setAnswers: (answers: IPlayerAnswer[]) => void;
  setInfo: (info: IInfo) => void;
  game: IGame | undefined;
  instance: IInstance | undefined;
  rounds: IRound[];
  questions: IQuestion[];
  setGame: (game: IGame) => void;
  setInstance: (instance: IInstance) => void;
  setRounds: (rounds: IRound[]) => void;
  setQuestions: (questions: IQuestion[]) => void;
};

const AdminPanelContext = createContext<AdminPanelContextType | undefined>(
  undefined
);

export const useAdminPanel = () => {
  const context = useContext(AdminPanelContext);
  if (!context) {
    throw new Error(
      "AdminPanelContext must be used within a AdminPanelProvider"
    );
  }
  return context;
};

export const AdminPanelProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [answers, setAnswers] = useState<IPlayerAnswer[]>([]);
  const [info, setInfo] = useState<IInfo>();
  const [currentRound, setCurrentRound] = useState<ITitleId>();
  const [currentQuestion, setCurrentQuestion] = useState<ITitleId>();
  const [game, setGame] = useState<IGame>();
  const [instance, setInstance] = useState<IInstance>();
  const [rounds, setRounds] = useState<IRound[]>([]);
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const { instanceId } = useParams();

  useEffect(() => {
    fetchGame();
  }, []);

  useEffect(() => {
    if (!instanceId) return;
    fetchPlayerAnswers();
    fetchQuestionInfo();
  }, [instanceId]);

  useEffect(() => {
    const gameChannel = echo.channel("game-control-channel");
    const playerChannel = echo.channel("player-channel");

    gameChannel.listen(".game-control-event", (data: any) => {
      if (data.instanceId === instanceId) {
        fetchQuestionInfo();
        fetchPlayerAnswers();
      }
    });

    playerChannel.listen(".player-event", (data: any) => {
      switch (data.command) {
        case "ready":
          fetchPlayers();
          break;
        case "answered":
          fetchPlayerAnswers();
          break;
      }
    });

    return () => {
      gameChannel.stopListening(".game-control-event");
      playerChannel.stopListening(".player-event");
    };
  }, [instanceId]);

  const fetchPlayerAnswers = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/player-answers/${instanceId}`,
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
      setAnswers(data);
    }
  };

  const fetchQuestionInfo = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/question-info/${instanceId}`,
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
      setInfo(data);
    }
  };

  const fetchPlayers = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/players/${instanceId}`,
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
      setPlayers(data.players);
    }
  };

  const fetchGame = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/instance-game/${instanceId}`,
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
      setInstance(data.instance);
      setGame(data.game.game);
      setRounds(data.game.rounds);
      setQuestions(data.game.questions);
    }
  };

  return (
    <AdminPanelContext.Provider
      value={{
        players,
        info,
        answers,
        instanceId,
        fetchPlayers,
        fetchPlayerAnswers,
        fetchQuestionInfo,
        setPlayers,
        setAnswers,
        setInfo,
        currentRound,
        setCurrentRound,
        currentQuestion,
        setCurrentQuestion,
        game,
        instance,
        rounds,
        questions,
        setGame,
        setInstance,
        setRounds,
        setQuestions,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};
