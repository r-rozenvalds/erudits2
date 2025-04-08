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
  setBuzzerEnabled: (buzzerEnabled: boolean) => void;
  buzzerEnabled: boolean;
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
  const [buzzerEnabled, setBuzzerEnabled] = useState(false);

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

  useEffect(() => {
    fetchBuzzedHistory();
  }, []);

  const fetchBuzzedHistory = async () => {
    const response = await fetch(
      `${constants.baseApiUrl}/buzzers/${instanceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
          )}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setBuzzerHistory(data.buzzers);
      setBuzzedPlayer(data.buzzed_player?.player_name || "");
      setBuzzerEnabled(data.instance.buzzers_enabled);
    }
  };

  return (
    <BuzzerContext.Provider
      value={{ buzzerHistory, buzzedPlayer, setBuzzerEnabled, buzzerEnabled }}
    >
      {children}
    </BuzzerContext.Provider>
  );
};
