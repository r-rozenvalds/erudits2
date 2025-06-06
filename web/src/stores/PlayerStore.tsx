import { IPlayer } from "./interfaces/IPlayer";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IPlayerQueryModel } from "./interfaces/query/IPlayerQueryModel";
import { IPagedResult } from "./interfaces/IPagedResult";
import { useApi } from "../components/universal/RequestBuilder";
import { IPlayerRequestModel } from "./interfaces/request/IPlayerRequestModel";
import { IPlayerPointsRequestModel } from "./interfaces/request/IPlayerPointsRequestModel";
import echo from "../useEcho";
import { instanceStore } from "./InstanceStore";

type PlayerStoreType = {
  playerItems?: IPagedResult<IPlayer>;
  selectedAnswers?: Map<string, string>;

  setSelectedAnswers: (answers: Map<string, string>) => void;
  fetchPlayerItems: (query: IPlayerQueryModel) => void;
  postTiebreak: (request: IPlayerRequestModel) => Promise<boolean>;
  postDelete: (request: IPlayerRequestModel) => Promise<boolean>;
  postDisqualify: (request: IPlayerRequestModel) => Promise<boolean>;
  postRequalify: (request: IPlayerRequestModel) => Promise<boolean>;
  postPoints: (request: IPlayerPointsRequestModel) => Promise<boolean>;
};

const PlayerStore = createContext<PlayerStoreType | undefined>(undefined);

export const playerStore = () => {
  const context = useContext(PlayerStore);
  if (!context) {
    throw new Error("Context must be used within a provider!");
  }

  return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playerItems, setPlayerItems] = useState<IPagedResult<IPlayer>>();
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string>>();

  const { get, post } = useApi();
  const { instance } = instanceStore();

  const fetchPlayerItems = async (query: IPlayerQueryModel) => {
    const playerData = await get<IPlayer, IPlayerQueryModel>("/players", query);
    setPlayerItems(playerData);
  };

  const postTiebreak = async (
    request: IPlayerRequestModel
  ): Promise<boolean> => {
    return await post<boolean, IPlayerRequestModel>("/tiebreak", request);
  };

  const postDelete = async (request: IPlayerRequestModel): Promise<boolean> => {
    return await post<boolean, IPlayerRequestModel>("/delete-players", request);
  };

  const postDisqualify = async (
    request: IPlayerRequestModel
  ): Promise<boolean> => {
    return await post<boolean, IPlayerRequestModel>(
      "/disqualify-players",
      request
    );
  };

  const postRequalify = async (
    request: IPlayerRequestModel
  ): Promise<boolean> => {
    return await post<boolean, IPlayerRequestModel>(
      "/requalify-players",
      request
    );
  };

  const postPoints = async (
    request: IPlayerPointsRequestModel
  ): Promise<boolean> => {
    return await post<boolean, IPlayerPointsRequestModel>(
      "/adjust-points",
      request
    );
  };

  useEffect(() => {
    if (!instance?.id) return;
    const playerChannel = echo.channel(`refresh-players.${instance.id}`);
    const tiebreakAnswerChannel = echo.channel(
      `tiebreak-answer.${instance.id}`
    );

    playerChannel.listen(".refresh-players-event", () => {
      fetchPlayerItems({ instance_id: instance.id } as IPlayerQueryModel);
    });

    // tiebreakAnswerChannel.listen(
    //   ".tiebreak-answer-event",
    //   (data: TiebreakAnswer) => {
    //     setTiebreakAnswers((prevTiebreakAnswers) => {
    //       const filteredAnswers = prevTiebreakAnswers.filter(
    //         (answer) => answer.player_id !== data.player_id
    //       );
    //       return [...filteredAnswers, data];
    //     });
    //   }
    // );

    return () => {
      tiebreakAnswerChannel.stopListening(".tiebreak-answer-event");
      playerChannel.stopListening(".refresh-players-event");
    };
  }, [instance]);

  return (
    <PlayerStore.Provider
      value={{
        playerItems,
        selectedAnswers,
        setSelectedAnswers,
        fetchPlayerItems,
        postTiebreak,
        postDelete,
        postDisqualify,
        postRequalify,
        postPoints,
      }}
    >
      {children}
    </PlayerStore.Provider>
  );
};
