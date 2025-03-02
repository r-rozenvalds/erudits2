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
import { useNavigate, useParams } from "react-router-dom";
import { ITitleId } from "../admin/interface/ITitleId";

export interface IPlayerAnswer {
  player_name: string;
  questions: IInstanceQuestion[];
  round_finished: boolean;
}

interface IInstanceQuestion {
  id: string;
  title: string;
  answer: string;
  is_correct: number;
}

interface IInstanceInfo {
  players: number;
  answered_players: number;
  current_question: string;
  answer_time: number;
  current_round: string;
  round_started_at: string;
  round_questions: IQuestion[];
  is_test: boolean;
}

export interface IGameController {
  instance_info: IInstanceInfo;
  player_answers: IPlayerAnswer[];
}

type AdminPanelContextType = {
  currentRound: ITitleId | undefined;
  setCurrentRound: (round: ITitleId) => void;
  currentQuestion: ITitleId | undefined;
  setCurrentQuestion: (question: ITitleId) => void;
  players: IPlayer[];
  gameController: IGameController | undefined;
  instanceId: string | undefined;
  fetchPlayers: () => void;
  fetchQuestionInfo: () => void;
  setPlayers: (players: IPlayer[]) => void;
  setGameController: (gameController: IGameController) => void;
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
  const [gameController, setGameController] = useState<IGameController>();
  const [currentRound, setCurrentRound] = useState<ITitleId>();
  const [currentQuestion, setCurrentQuestion] = useState<ITitleId>();
  const [game, setGame] = useState<IGame>();
  const [instance, setInstance] = useState<IInstance>();
  const [rounds, setRounds] = useState<IRound[]>([]);
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const { instanceId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchGame();
  }, []);

  useEffect(() => {
    if (!instanceId) return;
    fetchQuestionInfo();
  }, [instanceId]);

  useEffect(() => {
    const gameChannel = echo.channel(`game.${instanceId}`);
    const playerChannel = echo.channel(`player-ready.${instanceId}`);

    gameChannel.listen(".game-control-event", (data: any) => {
      fetchQuestionInfo();
    });

    playerChannel.listen(".player-ready-event", (data: any) => {
      setPlayers([...players, data.player]);
    });

    return () => {
      gameChannel.stopListening(".game-control-event");
      playerChannel.stopListening(".player-ready-event");
    };
  }, [instanceId]);

  const fetchQuestionInfo = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/game-controller-info/${instanceId}`,
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
      setGameController(data);
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
      return;
    }

    navigate("/");
  };

  return (
    <AdminPanelContext.Provider
      value={{
        players,
        gameController,
        instanceId,
        fetchPlayers,
        fetchQuestionInfo,
        setPlayers,
        setGameController,
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
