import { useEffect, useState } from "react";
import { IGame } from "../../interface/IGame";
import { IQuestion } from "../../interface/IQuestion";
import { IRound } from "../../interface/IRound";
import { constants } from "../../../../constants";
import { useParams } from "react-router-dom";
import { PlayerList } from "../../ui/panel/PlayerList";
import { StartStop } from "../../ui/panel/StartStop";
import { IInstance } from "../../interface/IInstance";

export const Panel = () => {
  const [game, setGame] = useState<IGame | null>(null);
  const [rounds, setRounds] = useState<IRound[] | null>(null);
  const [questions, setQuestions] = useState<IQuestion[] | null>(null);
  const [instance, setInstance] = useState<IInstance | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { gameId } = useParams();

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${constants.baseApiUrl}/instance-game/${gameId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
          )}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setInstance(data.instance);
      setGame(data.game.game);
      setRounds(data.game.rounds);
      setQuestions(data.game.questions);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between place-items-center bg-slate-100 p-4 rounded-t-md">
        <div className="flex place-items-center gap-6">
          <button
            onClick={() => window.location.assign("/admin/games")}
            className="h-10 w-28 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
          >
            <i className="fa-solid fa-arrow-left-long me-2"></i>
            Atpakaļ
          </button>
          <img src="/maxwell-cat.gif" width="60" />
        </div>
        <h1 className="font-bold text-2xl">{game?.title}</h1>
        {game && gameId && instance && (
          <StartStop instanceId={gameId} game={game} instance={instance} />
        )}
      </div>
      <div className="flex mt-2 mx-4">
        {gameId && <PlayerList gameId={gameId} />}
      </div>
    </div>
  );
};
