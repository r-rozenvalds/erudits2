import { SpinnerCircularFixed } from "spinners-react/lib/esm/SpinnerCircularFixed";
import { creatorStore } from "../../../../../stores/CreatorStore";
import { gameStore } from "../../../../../stores/GameStore";
import { SidebarRound } from "./SidebarRound";
import { SidebarQuestion } from "./SidebarQuestion";
import { IRound } from "../../../../../stores/interfaces/creator/IRound";
import { IQuestion } from "../../../../../stores/interfaces/creator/IQuestion";
import { IGame } from "../../../../../stores/interfaces/creator/IGame";
import { useParams } from "react-router-dom";
import { useReducer, useState } from "react";

export const Sidebar = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(false);
  const [isRoundLoading, setIsRoundLoading] = useState<boolean>(false);
  const {
    setSelectedGame,
    setSelectedQuestion,
    setSelectedRound,
    selectedGame,
    selectedRound,
    selectedQuestion,
    fetchCurrentGame,
  } = creatorStore();

  const { gameId } = useParams();

  const { games, postRound, postQuestion } = gameStore();

  if (!games?.items || games.items.length < 1 || !gameId) {
    return (
      <div className="flex gap-2">
        Tiek veikta ielāde...
        <SpinnerCircularFixed color="#fff" size="18" thickness={210} />
      </div>
    );
  }

  const game = games.items[0];

  const selectComponent = <T,>(
    component: T,
    setter: (component: T) => void
  ) => {
    setSelectedGame(undefined);
    setSelectedRound(undefined);
    setSelectedQuestion(undefined);

    setter(component);
  };

  const handleCreateNewRound = async () => {
    setIsRoundLoading(true);
    const request = {
      title: "Jauna kārta",
      disqualify_amount: 0,
      answer_time: 30,
      points: 1,
      is_additional: false,
      game_id: game.id,
    } as IRound;

    if (await postRound(request)) {
      await fetchCurrentGame(gameId);
    }
    setIsRoundLoading(false);
  };

  const handleCreateNewQuestion = async (round: IRound) => {
    setIsQuestionLoading(true);
    const request = {
      title: "Jauns jautājums",
      round_id: round.id,
    } as IQuestion;

    if (await postQuestion(request)) {
      await fetchCurrentGame(gameId);
    }
    setIsQuestionLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-between place-items-center h-12 px-2 gap-2">
        <input
          className="w-full h-full outline-none font-semibold"
          type="text"
          placeholder="Meklēt..."
        />
        <i className="fa-solid fa-magnifying-glass text-slate-400 text-xl"></i>
      </div>
      <hr className="border-slate-300 my-2" />

      <div
        className="overflow-y-scroll flex flex-col gap-2 px-2"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <button
          onClick={() => selectComponent<IGame>(game, setSelectedGame)}
          className={`min-h-8 bg-slate-200 rounded-sm hover:underline ${
            selectedGame?.id === game.id && "font-bold"
          }`}
        >
          {game.title}
        </button>
        {game.rounds?.map((round) => {
          return (
            <SidebarRound
              isSelected={selectedRound?.id === round.id}
              title={round.title}
              onClick={() => selectComponent<IRound>(round, setSelectedRound)}
            >
              {round.questions?.map((question) => {
                return (
                  <SidebarQuestion
                    isSelected={selectedQuestion?.id === question.id}
                    question={question}
                    onClick={() =>
                      selectComponent<IQuestion>(question, setSelectedQuestion)
                    }
                  />
                );
              })}
              <button
                disabled={isQuestionLoading}
                onClick={() => handleCreateNewQuestion(round)}
                className="w-full min-h-8 bg-slate-200 rounded-sm font-semibold hover:bg-slate-300"
              >
                {!isQuestionLoading && (
                  <p>
                    Jauns jautājums <i className="ms-2 fa-solid fa-plus "></i>
                  </p>
                )}
                {isQuestionLoading && (
                  <div className="mx-auto w-5">
                    <SpinnerCircularFixed
                      color="#fff"
                      size="18"
                      thickness={210}
                    />
                  </div>
                )}
              </button>
            </SidebarRound>
          );
        })}
        <button
          disabled={isRoundLoading}
          onClick={handleCreateNewRound}
          className="w-full min-h-12 bg-slate-200 rounded-sm font-semibold hover:bg-slate-300"
        >
          {!isRoundLoading && (
            <p>
              Jauna kārta<i className="ms-2 fa-solid fa-plus "></i>
            </p>
          )}
          {isRoundLoading && (
            <div className="mx-auto w-5">
              <SpinnerCircularFixed color="#fff" size="18" thickness={210} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
