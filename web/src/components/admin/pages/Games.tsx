import { useNavigate } from "react-router-dom";
import { constants } from "../../../constants";
import { AdminSessionStorage } from "../enum/AdminSessionStorage";
import { AdminGameTable } from "../ui/table/AdminGameTable";
import { useEffect, useState } from "react";
import { IGame } from "../interface/IGame";
import { SpinnerCircularFixed } from "spinners-react";

export const AdminGames = () => {
  const [games, setGames] = useState<IGame[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    clearSessionStorage();
    fetchGames();
  }, []);

  const clearSessionStorage = () => {
    sessionStorage.removeItem(AdminSessionStorage.gameCreator);
    sessionStorage.removeItem(AdminSessionStorage.roundCreator);
    sessionStorage.removeItem(AdminSessionStorage.questionCreator);
    sessionStorage.removeItem(AdminSessionStorage.sidebarGame);
    sessionStorage.removeItem(AdminSessionStorage.sidebarQuestions);
    sessionStorage.removeItem(AdminSessionStorage.sidebarRounds);
    sessionStorage.removeItem(AdminSessionStorage.breadCrumbs);
    sessionStorage.removeItem(AdminSessionStorage.gameId);
  };

  const logout = async () => {
    setIsLoading(true);
    const response = await fetch(`${constants.baseApiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    });

    if (response.ok) {
      sessionStorage.removeItem(constants.sessionStorage.TOKEN);
      navigate("/");
    }
    setIsLoading(false);
  };

  const createGame = async () => {
    clearSessionStorage();
    setIsLoading(true);
    try {
      const response = await fetch(`${constants.baseApiUrl}/create-game`, {
        method: "GET",
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
          JSON.stringify({
            id: data.game.id,
            title: data.game.title,
            description: data.game.description,
            user_id: data.game.user_id,
          })
        );
        navigate(`creator/game/${data.game.id}`);
      } else {
        console.error("Failed to create game:", response.statusText);
      }
    } catch (error) {
      console.error("Error during game creation:", error);
    }
    setIsLoading(false);
  };

  const fetchGames = async () => {
    const response = await fetch(`${constants.baseApiUrl}/games`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setGames(data.games);
      return;
    }

    navigate("/admin/login");
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
              disabled={isLoading}
              className={`${
                isLoading ? "bg-slate-500" : "bg-white hover:bg-slate-200"
              } px-6 rounded-sm shadow-sm py-2 flex place-items-center gap-2`}
              onClick={logout}
            >
              <span className="font-[Manrope] font-semibold">Beigt darbu</span>
              {!isLoading && <i className="fa-solid fa-right-from-bracket"></i>}
              {isLoading && (
                <SpinnerCircularFixed
                  color="#ffffff"
                  size={20}
                  thickness={150}
                />
              )}
            </button>
            <button
              onClick={createGame}
              disabled={isLoading}
              className={`${
                isLoading
                  ? "bg-slate-500"
                  : "bg-emerald-400 hover:bg-emerald-300 "
              } px-6 rounded-sm shadow-sm py-2 flex place-items-center gap-2`}
            >
              <span className="font-[Manrope] font-semibold">Jauna spēle</span>
              {!isLoading && <i className="fa-solid fa-plus"></i>}
              {isLoading && (
                <SpinnerCircularFixed
                  color="#ffffff"
                  size={20}
                  thickness={150}
                />
              )}
            </button>
          </div>
        </div>
        <AdminGameTable games={games} />
      </div>
    </div>
  );
};
