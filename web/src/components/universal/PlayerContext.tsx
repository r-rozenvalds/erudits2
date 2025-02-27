import {
  ReactNode,
  useContext,
  useState,
  createContext,
  useEffect,
} from "react";
import { PlayerLocalStorage } from "../player/enum/PlayerLocalStorage";
import { constants } from "../../constants";
import { IPlayer } from "../admin/interface/IPlayer";
import echo from "../../useEcho";
import { IGameSessionStorage } from "../player/interface/IGameSessionStorage";
import { useNavigate } from "react-router-dom";
import { IQuestion } from "../admin/interface/IQuestion";
import { IRound } from "../admin/interface/IRound";

type PlayerContextType = {
  playerId: string;
  setPlayerId: (playerId: string) => void;
  isDisqualified: boolean;
  setIsDisqualified: (isDisqualified: boolean) => void;
  playerName: string;
  setPlayerName: (playerName: string) => void;
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
  questions: IQuestion[];
  fetchQuestions: () => void;
  round: IRound | undefined;
  answers: IAnswerDto[];
  selectedAnswers: Map<string, string> | undefined;
  setSelectedAnswers: (answers: Map<string, string>) => void;
  postAnswers: (questionId: string) => void;
  roundFinished: boolean;
  setRoundFinished: (roundFinished: boolean) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

interface IAnswerDto {
  id: string;
  text?: string;
  question_id: string;
}

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playerId, setPlayerId] = useState<string>("");
  const [isDisqualified, setIsDisqualified] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);
  const [roundFinished, setRoundFinished] = useState<boolean>(false);
  const [instanceId, setInstanceId] = useState<string>("");
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<IAnswerDto[]>([]);
  const [round, setRound] = useState<IRound>();
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    const player = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentPlayer) ?? "{}"
    ) as IPlayer;
    if (player?.id && player.id.length === 36) {
      setPlayerId(player.id);
      fetchPlayer(player.id);
    }

    const storedData = localStorage.getItem(PlayerLocalStorage.answers);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const mapData = new Map<string, string>(
        Object.entries(parsedData).map(([key, value]) => [key, value as string])
      );
      setSelectedAnswers(mapData);
    }
  }, []);

  const fetchPlayer = async (id: string) => {
    const response = await fetch(`${constants.baseApiUrl}/player/${id}`);
    if (response.ok) {
      const data = await response.json();
      setPlayerId(data.player.id);
      setPlayerName(data.player.player_name);
      setIsDisqualified(data.player.is_disqualified);
      setRoundFinished(data.player.round_finished);
      setIsReady(true);
    }
  };

  useEffect(() => {
    const gameSessionStorage = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentGame) ?? "{}"
    ) as IGameSessionStorage;

    if (
      gameSessionStorage?.id &&
      (!gameSessionStorage?.end_date ||
        new Date(gameSessionStorage.end_date) > new Date())
    ) {
      setInstanceId(gameSessionStorage.id);
      return;
    }

    localStorage.removeItem(PlayerLocalStorage.currentGame);
    window.location.assign("/");
  }, []);

  useEffect(() => {
    if (isDisqualified) {
      window.location.assign("/play/disqualified");
    }
  }, []);

  const navigate = useNavigate();

  const disqualifyPlayer = (player: string) => {
    if (player === playerId) {
      setIsDisqualified(true);
      navigate("/play/disqualified");
    }
  };

  const requalifyPlayer = (player: string) => {
    if (player === playerId) {
      setIsDisqualified(false);
      navigate("/play/lobby");
    }
  };

  const fetchQuestions = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/round-questions/${instanceId}`
    );
    if (response.ok) {
      const data = await response.json();
      setQuestions(data.questions);
      setAnswers(data.answers);
      setRound(data.round);
      setAnswers(data.answers);
    }
  };

  useEffect(() => {
    echo
      .channel("game-control-channel")
      .listen(".game-control-event", (data: any) => {
        switch (data.command) {
          case "end":
            if (data.instanceId === instanceId) navigate("/play/end");
            break;
          case "start":
            if (isReady && data.instanceId === instanceId) {
              fetchQuestions();
              navigate("/play/game");
            } //maybe send signal that player is loaded?
            if (!isReady && data.instanceId === instanceId)
              navigate("/play/end");
            break;
          case "next-round":
            if (data.instanceId === instanceId) {
              setRoundFinished(false);
              fetchQuestions();
              navigate("/play/game");
            }
            break;
        }
      });
    echo.channel("player-channel").listen(".player-event", (data: any) => {
      switch (data.command) {
        case "disqualified":
          disqualifyPlayer(data.player);
          break;
        case "requalified":
          requalifyPlayer(data.player);
          break;
      }
    });

    return () => {
      echo.leaveChannel("game-control-channel");
      echo.leaveChannel("player-channel");
    };
  }, [playerId]);

  const postAnswers = async (questionId: string) => {
    const answer = selectedAnswers.get(questionId);

    fetch(`${constants.baseApiUrl}/player-answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_id: playerId,
        question_id: questionId,
        answer: answer,
        round_id: round?.id,
      }),
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        playerId,
        setPlayerId,
        isDisqualified,
        setIsDisqualified,
        playerName,
        setPlayerName,
        isReady,
        setIsReady,
        questions,
        fetchQuestions,
        round,
        answers,
        selectedAnswers,
        setSelectedAnswers,
        postAnswers,
        roundFinished,
        setRoundFinished,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
