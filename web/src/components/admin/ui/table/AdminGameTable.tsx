import { Game } from "../../interface/Game";
import { AdminGameTableHeader } from "./AdminGameTableHeader";
import { AdminGameTableItem } from "./AdminGameTableItem";

export const AdminGameTable = ({ games }: { games: Game[] | undefined }) => {
  return (
    <ul className="w-full gap-2 flex flex-col pb-4">
      <li>
        <AdminGameTableHeader />
      </li>
      {games &&
        games.map((game) => {
          return <AdminGameTableItem key={game.id} game={game} />;
        })}
    </ul>
  );
};
