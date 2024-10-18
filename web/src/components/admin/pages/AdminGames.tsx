import { useNavigate } from "react-router-dom";
import { constants } from "../../../constants";
import { AdminSessionStorage } from "../enum/AdminSessionStorage";
import { AdminGameTable } from "../ui/table/AdminGameTable";
import { useEffect, useState } from "react";
import { Game } from "../interface/Game";

export const AdminGames = () => {
  const [games, setGames] = useState<Game[]>();

  const navigate = useNavigate();
  useEffect(() => {
    fetchGames();
  }, []);

  const logout = async () => {
    await fetch(`${constants.baseApiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        sessionStorage.removeItem(constants.sessionStorage.TOKEN);
        navigate("/");
      }
    });
  };

  const createGame = async () => {
    try {
      const response = await fetch(`${constants.baseApiUrl}/games`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            constants.sessionStorage.TOKEN
          )}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem(
          AdminSessionStorage.gameCreator,
          JSON.stringify({ title: data.title, description: data.description })
        );
        console.log("SessionStorage updated. Now navigating...");
        console.log(data);
        navigate(`creator/${data.id}`);
      } else {
        console.error("Failed to create game:", response.statusText);
      }
    } catch (error) {
      console.error("Error during game creation:", error);
    }
  };

  const fetchGames = async () => {
    await fetch(`${constants.baseApiUrl}/games`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    }).then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        setGames(data);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266]">
      <div className="flex flex-col w-screen h-screen p-12 gap-12">
        <div className="flex justify-between">
          <span className="font-[Manrope] font-semibold text-white text-3xl">
            Izveidotās spēles
          </span>
          <div className="flex gap-4">
            <button
              className="bg-white px-6 rounded-sm shadow-sm hover:cursor-pointer hover:bg-opacity-80 py-2"
              onClick={() => logout()}
            >
              <span className="font-[Manrope] font-semibold">Beigt darbu</span>
              <i className="fa-solid fa-right-from-bracket ms-6"></i>
            </button>
            <button
              onClick={createGame}
              className="bg-emerald-400 px-6 rounded-sm shadow-sm hover:cursor-pointer hover:bg-emerald-300 py-2"
            >
              <span className="font-[Manrope] font-semibold">Jauna spēle</span>
              <i className="fa-solid fa-plus ms-6"></i>
            </button>
          </div>
        </div>
        <AdminGameTable games={games} />
      </div>
    </div>
  );
};
