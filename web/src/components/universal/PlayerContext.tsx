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

type PlayerContextType = {
  playerId: string;
  setPlayerId: (playerId: string) => void;
  isDisqualified: boolean;
  setIsDisqualified: (isDisqualified: boolean) => void;
  playerName: string;
  setPlayerName: (playerName: string) => void;
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playerId, setPlayerId] = useState<string>("");
  const [isDisqualified, setIsDisqualified] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const player = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentPlayer) ?? "{}"
    ) as IPlayer;
    if (player?.id && player.id.length === 36) {
      setPlayerId(player.id);
      fetchPlayer(player.id);
    }
  }, []);

  const fetchPlayer = async (id: string) => {
    const response = await fetch(`${constants.baseApiUrl}/player/${id}`);
    if (response.ok) {
      const data = await response.json();
      setPlayerId(data.player.id);
      setPlayerName(data.player.player_name);
      setIsDisqualified(data.player.is_disqualified);
      setIsReady(true);
    }
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
