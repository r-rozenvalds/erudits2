import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { PlayerSessionStorage } from "../../enum/PlayerSessionStorage";
import { IGameSessionStorage } from "../../interface/IGameSessionStorage";

export const PlayerLayout = () => {
  const [instanceId, setInstanceId] = useState("");

  useEffect(() => {
    const gameSessionStorage = JSON.parse(
      sessionStorage.getItem(PlayerSessionStorage.currentGame) ?? "{}"
    ) as IGameSessionStorage;

    if (
      gameSessionStorage?.id &&
      (!gameSessionStorage?.end_date ||
        new Date(gameSessionStorage.end_date) > new Date())
    ) {
      setInstanceId(gameSessionStorage.id);
      return;
    }

    sessionStorage.removeItem(PlayerSessionStorage.currentGame);
    window.location.assign("/");
  }, []);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gradient-to-r from-[#30345f] to-[#533266] place-items-center justify-center gap-12">
      <Outlet />
    </div>
  );
};
