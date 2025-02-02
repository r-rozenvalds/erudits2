import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PlayerLocalStorage } from "../../enum/PlayerLocalStorage";
import { IGameSessionStorage } from "../../interface/IGameSessionStorage";
import echo from "../../../../useEcho";
import { usePlayer } from "../../../universal/PlayerContext";

export const PlayerLayout = () => {
  const [instanceId, setInstanceId] = useState("");

  const { setIsDisqualified, playerId, isReady, isDisqualified, playerName } =
    usePlayer();

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

  useEffect(() => {
    echo
      .channel("game-control-channel")
      .listen(".game-control-event", (data: any) => {
        switch (data.command) {
          case "end":
            if (data.instanceId === instanceId) navigate("/play/end");
            break;
          case "start":
            if (isReady && data.instanceId === instanceId)
              navigate("/play/game");
            if (!isReady && data.instanceId === instanceId)
              navigate("/play/end");
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

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gradient-to-r from-[#30345f] to-[#533266] place-items-center justify-center gap-12">
      <Outlet />
    </div>
  );
};
