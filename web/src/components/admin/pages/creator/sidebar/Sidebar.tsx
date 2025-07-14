import { SpinnerCircularFixed } from "spinners-react/lib/esm/SpinnerCircularFixed";
import { creatorStore } from "../../../../../stores/CreatorStore";
import { gameStore } from "../../../../../stores/GameStore";
import { SidebarRound } from "./SidebarRound";
import { SidebarQuestion } from "./SidebarQuestion";

export const Sidebar = () => {
  const {
    setSelectedGame,
    setSelectedQuestion,
    setSelectedRound,
    selectedGame,
    selectedRound,
    selectedQuestion,
  } = creatorStore();

  const { games } = gameStore();

  if (!games?.items || games.items.length < 1) {
    return (
      <div className="flex gap-2">
        Tiek veikta ielāde...
        <SpinnerCircularFixed color="#fff" size="18" thickness={210} />
      </div>
    );
  }

  const game = games.items[0];

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
        className="overflow-y-scroll flex flex-col gap-2"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {game.rounds?.map((round) => {
          return (
            <SidebarRound title={round.title} onClick={() => null}>
              {round.questions?.map((question) => {
                return <SidebarQuestion {...question} />;
              })}
            </SidebarRound>
          );
        })}
      </div>
    </div>
  );
};
