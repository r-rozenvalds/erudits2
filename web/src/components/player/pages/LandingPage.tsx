import { useNavigate } from "react-router-dom";
import InstanceCard from "../../ui/InstanceCard";
import { useEffect, useState } from "react";
import { useToast } from "../../universal/Toast";
import { constants } from "../../../constants";
import { SpinnerCircularFixed } from "spinners-react";
import { PlayerLocalStorage } from "../enum/PlayerLocalStorage";
import { IGameSessionStorage } from "../interface/IGameSessionStorage";
import { localizeError, localizeSuccess } from "../../../localization";
import { PlayModal } from "../ui/PlayModal";
import { GameBrowserModal } from "../ui/GameBrowserModal";
import { playerInstanceStore } from "../stores/PlayerInstanceStore";

interface IGameInstance {
  title: string;
  description: string;
  code: string;
}

export const LandingPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingGameCode, setExistingGameCode] = useState("");
  const [gameInstances, setGameInstances] = useState<IGameInstance[]>([]);
  const [version, setVersion] = useState<string>();
  const [isPlayModalOpen, setIsPlayModalOpen] = useState<boolean>(false);
  const [isGamesModalOpen, setIsGamesModalOpen] = useState<boolean>(false);
  const [isAuthenticationModalOpen, setIsAuthenticationModalOpen] =
    useState<boolean>(false);

  const instanceStore = playerInstanceStore();

  const { getInstances, query } = instanceStore;

  const handleJoin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    if (code.length < 3 && !existingGameCode) {
      showToast(false, "Kods nedrīkst būt īsāks par 3 rakstzīmēm");
      setIsLoading(false);
      return;
    }

    await postJoin(code);

    setIsLoading(false);
  };

  const handleJoinExisting = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);

    await postJoin(existingGameCode);

    setIsLoading(false);
  };

  const postJoin = async (gameCode: string) => {
    const currentPlayer = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentPlayer) ?? "{}"
    );

    const currentGame = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentGame) ?? "{}"
    );

    const response = await fetch(`${constants.baseApiUrl}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: gameCode,
        player_id: currentPlayer?.id,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      if (data.id !== currentGame.id) {
        localStorage.removeItem(PlayerLocalStorage.answers);
        localStorage.removeItem(PlayerLocalStorage.currentGame);
        localStorage.removeItem(PlayerLocalStorage.currentPlayer);
      }

      localStorage.setItem(
        PlayerLocalStorage.currentGame,
        JSON.stringify({
          id: data.id,
          end_date: data.end_date,
          title: data.title,
        })
      );

      showToast(true, localizeSuccess(data.message));
      navigate("/play/lobby");
      setIsLoading(false);
      return;
    }

    showToast(false, localizeError(data?.error) ?? "Kļūda meklējot spēli");
  };

  useEffect(() => {
    getInstances(query);
    getVersion();
  }, []);

  const getVersion = async () => {
    const response = await fetch(`${constants.baseApiUrl}/version`);

    const data = await response.json();
    setVersion(data.version);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#31587A] to-[#3C3266] font-[Manrope] overflow-hidden">
      {!!existingGameCode && (
        <div className="bg-white slide-down flex flex-col gap-3 lg:w-1/6 w-[90%] place-items-center justify-center shadow-lg rounded-b-md fixed top-0 left-0 right-0 mx-auto pt-4 z-50">
          <div className="flex gap-2 mx-8">
            <i className="fa-solid fa-circle-info text-xl text-[#E63946]"></i>
            <p className="font-semibold text-lg">Jums ir iesākta spēle</p>
          </div>
          <button
            onClick={handleJoinExisting}
            className="font-[Manrope] w-full px-2 py-1 bg-[#E63946] rounded-b-md shadow-lg text-white text-md font-bold hover:bg-opacity-80 transition-all hover:cursor-pointer"
          >
            Pievienoties
          </button>
        </div>
      )}
      <div className="absolute right-20 top-10 text-white font-semibold flex gap-2 place-items-center">
        Čau, (vārds)!
        <img
          className="rounded-full border-2 border-white w-10 h-10 shadow-md"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnPZUpjr7jMHQyQ0LYFDEVPGL8emUKRvUGAw&s"
          width={40}
          height={40}
        />
      </div>
      <div className="flex flex-col w-screen h-screen place-items-center justify-center gap-8">
        <p className="text-white text-3xl font-[Manrope]">Sistēma "Erudīts"</p>
        <div className="flex gap-6">
          <button
            onClick={() => setIsPlayModalOpen(true)}
            className="w-48 h-48 shadow-md rounded-md bg-opacity-20 bg-black hover:bg-opacity-30 transition-all group"
          >
            <i className="fa-solid fa-play text-white border-4 border-white w-24 h-24 rounded-full text-6xl pt-3.5 pl-1 group-hover:text-[#E63946] group-hover:border-[#E63946] transition-all"></i>
            <p className="text-2xl font-bold text-white mt-4 group-hover:text-[#E63946] transition-all">
              Spēlēt
            </p>
          </button>
          <button
            onClick={() => setIsGamesModalOpen(true)}
            className="w-48 h-48 shadow-md rounded-md bg-opacity-20 bg-black hover:bg-opacity-30 transition-all group"
          >
            <i className="fa-solid fa-list text-white border-4 border-white w-24 h-24 rounded-full text-5xl pt-5 group-hover:text-[#E63946] group-hover:border-[#E63946] transition-all"></i>
            <p className="text-2xl font-bold text-white mt-4 group-hover:text-[#E63946] transition-all">
              Meklēt
            </p>
          </button>
          <button
            onClick={() => navigate("/admin/games")}
            className="w-48 h-48 shadow-md rounded-md bg-opacity-20 bg-black hover:bg-opacity-30 transition-all group"
          >
            <i className="fa-solid fa-pencil text-white border-4 border-white w-24 h-24 rounded-full text-5xl pt-5 group-hover:text-[#E63946] group-hover:border-[#E63946] transition-all"></i>
            <p className="text-2xl font-bold text-white mt-4 group-hover:text-[#E63946] transition-all">
              Veidot
            </p>
          </button>
        </div>
        <div className="flex gap-4 text-white text-xs place-items-center mx-auto">
          <button
            className="hover:underline hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            INFO
          </button>
          <span className="bg-white w-1 h-1 rounded-full"></span>
          <span>{version}</span>
        </div>
      </div>
      {isPlayModalOpen && (
        <PlayModal onCancel={() => setIsPlayModalOpen(false)} />
      )}
      {isGamesModalOpen && (
        <GameBrowserModal
          onCancel={() => setIsGamesModalOpen(false)}
          instanceStore={instanceStore}
        />
      )}
    </div>
  );
};
