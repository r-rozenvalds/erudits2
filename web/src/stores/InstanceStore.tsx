import { createContext, ReactNode, useContext, useState } from "react";
import { IInstance } from "./interfaces/IInstance";

type InstanceStoreType = {
  instance?: IInstance;
  setInstance: (instance: IInstance) => void;
};

const InstanceStore = createContext<InstanceStoreType | undefined>(undefined);

export const instanceStore = () => {
  const context = useContext(InstanceStore);
  if (!context) {
    throw new Error("Context must be used within a provider!");
  }

  return context;
};

export const InstanceProvider = ({ children }: { children: ReactNode }) => {
  const [instance, setInstance] = useState<IInstance>();

  return (
    <InstanceStore.Provider value={{ instance, setInstance }}>
      {children}
    </InstanceStore.Provider>
  );
};
