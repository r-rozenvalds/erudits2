import { useState } from "react";
import { Game } from "../../interface/Game";
import { useNavigate } from "react-router-dom";

export const AdminGameTableItem = ({ game }: { game: Game }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  console.log("game", game);

  return (
    <li className="flex flex-col font-[Manrope] bg-white rounded-md">
      <div className="flex w-full ">
        <div
          onClick={() => (expanded ? setExpanded(false) : setExpanded(true))}
          className="rounded-s-md  p-2 px-8 grow hover:cursor-pointer"
        >
          <div className="flex gap-6">
            <span className="w-80 font-semibold">{game.title}</span>
            <div className="w-[1px] bg-gray-400"></div>
            <span>{game.created_at.slice(0, 10)}</span>
          </div>
          <div></div>
        </div>
        <button className="w-32 text-lg bg-[#E63946] text-white font-semibold hover:bg-opacity-50 transition-all hover:cursor-pointer">
          Spēlēt
        </button>
        <div
          onClick={() => (expanded ? setExpanded(false) : setExpanded(true))}
          className="hover:cursor-pointer rounded-e-md bg-white p-2 px-8"
        >
          {!expanded && (
            <i className="fa-solid fa-chevron-down text-gray-400"></i>
          )}
          {expanded && <i className="fa-solid fa-chevron-up text-gray-400"></i>}
        </div>
      </div>
      {expanded && (
        <div className="pb-6 px-8 pt-2 flex justify-between h-full">
          <div className="flex flex-col gap-4">
            <span>{game.description}</span>
            <table className="text-center">
              <thead>
                <tr>
                  <th className="pe-4">Pēdējoreiz spēlēta</th>
                  <th className="pe-4">Kārtas</th>
                  <th className="pe-4">Jautājumi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pe-4">{game.updated_at.slice(0, 10)}</td>
                  <td className="pe-4">6</td>
                  <td className="pe-4">28</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex place-items-end">
            <button
              onClick={() => navigate(`creator/${game.id}`)}
              className="hover:cursor-pointer group w-8 h-8"
            >
              <i className="fa-solid fa-gear text-2xl text-gray-400 group-hover:text-black"></i>
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
