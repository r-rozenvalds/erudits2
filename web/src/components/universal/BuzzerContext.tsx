import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import echo from "../../useEcho";
import { constants } from "../../constants";

type BuzzerType = {
  id: number;
  player: string;
  buzzed_at: string;
};

type BuzzerContextType = {
  buzzerHistory: BuzzerType[];
  buzzedPlayer: string;
};

const BuzzerContext = createContext<BuzzerContextType | undefined>(undefined);

export const useBuzzer = () => {
  const context = useContext(BuzzerContext);
  if (!context) {
    throw new Error(
      "BuzzerContext must be used within a AdminGameSidebarProvider"
    );
  }
  return context;
};

export const BuzzerProvider = ({ children }: { children: ReactNode }) => {
  const [buzzerHistory, setBuzzerHistory] = useState<BuzzerType[]>([]);
  const [buzzedPlayer, setBuzzedPlayer] = useState<string>("");

  const { instanceId } = useParams();

  useEffect(() => {
    const gameChannel = echo.channel(`buzzer.${instanceId}`);

    gameChannel.listen(".buzzer-event", (data: any) => {
      setBuzzedPlayer(data.playerName);
      fetchBuzzedHistory();
    });

    return () => {
      gameChannel.stopListening(".buzzer-event");
    };
  }, [instanceId]);

  const fetchBuzzedHistory = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/buzzers/${instanceId}`
    );

    if (response.ok) {
      const data = await response.json();
      setBuzzerHistory(data);
    }
  };

  return (
    <BuzzerContext.Provider value={{ buzzerHistory, buzzedPlayer }}>
      {children}
    </BuzzerContext.Provider>
  );
};
