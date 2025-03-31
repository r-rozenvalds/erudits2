import { useState, useEffect } from "react";
import { usePlayer } from "../../universal/PlayerContext";
import { GameView } from "../ui/GameView";
import { TestGameView } from "../ui/TestGameView";
import { BuzzerView } from "../ui/BuzzerView";

export const Game = () => {
  const { round } = usePlayer();
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    if (round) {
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
          <img className="w-40 h-64" src="/GvG-left.png" />
        </div>
        <div className="bg-red-500 h-full w-1/2 glass-effect sliding-animation-right flex place-items-center">
          <img className="w-40 h-64" src="/GvG-right.png" />
        </div>
      </div>
    );
  }

  if (showGame) {
    return <BuzzerView />;
    if (round.is_test) {
      return <TestGameView />;
    }

    return <GameView />;
  }

  return (
    <div className="flex w-screen h-screen">
      <div className="bg-red-500 h-full w-1/2 glass-effect sliding-animation-left-backwards flex place-items-center justify-end">
        <img className="w-40 h-64" src="/GvG-left.png" />
      </div>
      <div className="bg-red-500 h-full w-1/2 glass-effect sliding-animation-right-backwards flex place-items-center">
        <img className="w-40 h-64" src="/GvG-right.png" />
      </div>
    </div>
  );
};
