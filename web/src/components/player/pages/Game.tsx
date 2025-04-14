import { useState, useEffect } from "react";
import { usePlayer } from "../../universal/PlayerContext";
import { GameView } from "../ui/GameView";
import { TestGameView } from "../ui/TestGameView";
import { BuzzerView } from "../ui/BuzzerView";

export const Game = () => {
  const { round, isBuzzerMode } = usePlayer();
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    if (round || isBuzzerMode) {
      const timeout = setTimeout(() => {
        setShowGame(true);
      }, 2000);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [round]);

  if (!round) {
    return (
      <div className="flex w-screen h-screen">
        <div className="bg-red-500 h-full w-1/2 glass-effect sliding-animation-left flex place-items-center justify-end">
          <img className="absolute z-10 w-[75%] left-0" src="/tutorial1.png" />
          <img className="w-40 h-80" src="/GvG-left.png" />
        </div>
        <div className="bg-red-500 h-full w-1/2 glass-effect sliding-animation-right flex place-items-center">
          <img className="w-40 h-80" src="/GvG-right.png" />
          <img className="absolute z-10 w-[75%] right-0" src="/tutorial2.png" />
        </div>
      </div>
    );
  }

  if (showGame) {
    if (isBuzzerMode) {
      return <BuzzerView />;
    }
    if (round.is_test) {
      return <TestGameView />;
    }

    return <GameView />;
  }

  return (
    <div className="flex w-screen h-screen">
      <div className="bg-red-500 h-full w-1/2 glass-effect sliding-animation-left-backwards flex place-items-center justify-end">
        <img className="w-40 h-80" src="/GvG-left.png" />
      </div>
      <div className="bg-red-500 h-full w-1/2 glass-effect sliding-animation-right-backwards flex place-items-center">
        <img className="w-40 h-80" src="/GvG-right.png" />
      </div>
    </div>
  );
};
