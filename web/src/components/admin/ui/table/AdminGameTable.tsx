import { IGame } from "../../interface/IGame";
import { AdminGameTableHeader } from "./AdminGameTableHeader";
import { AdminGameTableItem } from "./AdminGameTableItem";

export const AdminGameTable = ({ games = [] }: { games?: IGame[] }) => {
  return (
    <ul className="w-full gap-2 flex flex-col pb-4">
      <li>
        <AdminGameTableHeader />
      </li>
      {games.map((game) => {
        return <AdminGameTableItem key={game.id} game={game} />;
      })}
    </ul>
  );
};
