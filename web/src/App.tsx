import { useNavigate } from "react-router-dom";
import InstanceCard from "./components/ui/InstanceCard";
import { useEffect, useState } from "react";
import { useToast } from "./components/universal/Toast";
import { constants } from "./constants";
import { SpinnerCircularFixed } from "spinners-react";
import { PlayerLocalStorage } from "./components/player/enum/PlayerLocalStorage";
import { IGameSessionStorage } from "./components/player/interface/IGameSessionStorage";

interface IGameInstance {
  title: string;
  description: string;
  code: string;
}

function App() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingGameCode, setExistingGameCode] = useState("");
  const [gameInstances, setGameInstances] = useState<IGameInstance[]>([]);

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

      showToast(true, data.message);
      navigate("/play/lobby");
      setIsLoading(false);
      return;
    }

    showToast(false, data?.error ?? "Kļūda meklējot spēli");
  };

  const setCodeValue = (e: {
    target: {
      value: string;
    };
  }) => {
    if (
      e.target.value === "" ||
      (/^[a-zA-Z0-9]+$/.test(e.target.value) && e.target.value.length <= 6)
    ) {
      setCode(e.target.value.toUpperCase());
    }
  };

  useEffect(() => {
    getInstancesAndPlayerStatus();
  }, []);

  const getInstancesAndPlayerStatus = async () => {
    const currentInstance = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentGame) ?? "{}"
    ) as IGameSessionStorage;

    const currentPlayer = JSON.parse(
      localStorage.getItem(PlayerLocalStorage.currentPlayer) ?? "{}"
    );

    const response = await fetch(`${constants.baseApiUrl}/instance-index`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instance_id: currentInstance?.id,
        player_id: currentPlayer?.id,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setGameInstances(data.game_instances);
      setExistingGameCode(data.started_game_code);
      return;
    }
    showToast(false, "Kļūda atlasot pieejamās spēles");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#31587A] to-[#3C3266]">
      {!!existingGameCode && (
        <div className="bg-white slide-down flex flex-col gap-3 w-1/6 place-items-center justify-center shadow-lg rounded-b-md fixed top-0 left-0 right-0 mx-auto pt-4 z-50">
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
      <form onSubmit={handleJoin} className="flex flex-col w-screen h-screen">
        <div className="flex flex-col w-full h-full place-items-center justify-center gap-8">
          <p className="text-white lg:text-5xl text-3xl font-[Manrope]">
            Sistēma "Erudīts v2.0"
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 place-items-center">
              <input
                placeholder="Spēles kods"
                type="text"
                className="font-[Manrope] h-14 lg:rounded-e-none rounded-md shadow-lg lg:text-4xl text-2xl font-semibold px-6 text-center focus:outline-none"
                value={code}
                onChange={setCodeValue}
              />
              {!isLoading && (
                <input
                  className="font-[Manrope] w-32 h-14 bg-[#E63946] lg:rounded-s-none rounded-md shadow-lg text-white text-2xl font-bold hover:bg-opacity-80 transition-all hover:cursor-pointer"
                  type="submit"
                  value="Spēlēt"
                />
              )}
              {isLoading && (
                <button
                  disabled
                  className="w-32 h-14 bg-slate-400 lg:rounded-e-md shadow-lg"
                >
                  <div className="w-10 mx-auto">
                    <SpinnerCircularFixed
                      size={40}
                      thickness={180}
                      color="#fff"
                    ></SpinnerCircularFixed>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {gameInstances.length > 0 && (
          <div className="text-center animate-bounce">
            <p className="text-white font-semibold text-2xl">
              Pieejamās spēles
            </p>
            <i className="fa-solid fa-chevron-down text-3xl text-white"></i>
          </div>
        )}
      </form>
      <div className="bg-black bg-opacity-25 h-auto p-12">
        <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-12">
          {gameInstances?.map((instance, index) => (
            <InstanceCard
              key={index}
              title={instance.title}
              description={instance.description}
              code={instance.code}
              postJoin={postJoin}
            />
          ))}
        </div>
        {gameInstances.length < 1 && (
          <div className="w-full text-center">
            <h1 className="text-white text-2xl font-[Manrope]">
              Pašlaik nav pieejamas spēles :(
            </h1>
          </div>
        )}
      </div>
      <div className="bg-black bg-opacity-30 flex h-24 p-12 place-items-center justify-between">
        <p className="text-white font-semibold">Veidoja: Roberts R.; 2024</p>
        <button
          onClick={() => navigate("/admin/games")}
          className="px-4 py-2 bg-[#E63946] rounded-md text-center shadow-lg text-white font-semibold hover:bg-opacity-50 transition-all lg:block hidden hover:cursor-pointer"
        >
          <i className="fa-solid fa-right-to-bracket me-2"></i>
          <span className="text-center h-8">Administratora panelis</span>
        </button>
      </div>
    </div>
  );
}

export default App;
