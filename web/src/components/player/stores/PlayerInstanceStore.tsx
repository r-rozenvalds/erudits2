import { createContext, ReactNode, useContext, useState } from "react";
import { useApi } from "../../universal/RequestBuilder";
import { IInstanceQueryModel } from "../interface/IInstanceQueryModel";
import { IPagedResult } from "../../../stores/interfaces/IPagedResult";
import { IPlayerInstance } from "../interface/IPlayerInstance";

export type PlayerInstanceStoreType = {
  instances?: IPagedResult<IPlayerInstance>;
  getInstances: (query?: IInstanceQueryModel) => Promise<void>;
  query: IInstanceQueryModel;
  setQuery: (query: IInstanceQueryModel) => void;
};

const PlayerInstanceStore = createContext<PlayerInstanceStoreType | undefined>(
  undefined
);

export const playerInstanceStore = () => {
  const context = useContext(PlayerInstanceStore);
  if (!context) {
    throw new Error("Context must be used within a provider!");
  }

  return context;
};

export const PlayerInstanceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [query, setQuery] = useState<IInstanceQueryModel>({
    page: 1,
    limit: 15,
  } as IInstanceQueryModel);
  const { get, post } = useApi();
  const [instances, setInstances] = useState<IPagedResult<IPlayerInstance>>();

  const getInstances = async (query?: IInstanceQueryModel) => {
    setInstances(
      await get<IPlayerInstance, IInstanceQueryModel>(
        "/player-instances",
        query
      )
    );
  };

  return (
    <PlayerInstanceStore.Provider
      value={{ instances, getInstances, query, setQuery }}
    >
      {children}
    </PlayerInstanceStore.Provider>
  );
};
