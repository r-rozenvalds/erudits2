import { useNavigate } from "react-router-dom";
import InstanceCard from "./components/ui/InstanceCard";
import { useEffect, useState } from "react";
import { useToast } from "./components/universal/Toast";
import { constants } from "./constants";
import { SpinnerCircularFixed } from "spinners-react";
import { PlayerSessionStorage } from "./components/player/enum/PlayerSessionStorage";
import { IGameSessionStorage } from "./components/player/interface/IGameSessionStorage";

function App() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingGame, setHasExistingGame] = useState(false);

  const handleJoin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    if (code.length < 3) {
      showToast(false, "Kods nedrīkst būt īsāks par 3 rakstzīmēm");
      setIsLoading(false);
      return;
    }

    const response = await fetch(`${constants.baseApiUrl}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      sessionStorage.setItem(
        PlayerSessionStorage.currentGame,
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

    setIsLoading(false);
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
    const existingGame = JSON.parse(
      sessionStorage.getItem(PlayerSessionStorage.currentGame) ?? "{}"
    ) as IGameSessionStorage;
    if (
      existingGame?.id &&
      (!existingGame?.end_date || new Date(existingGame.end_date) > new Date())
    ) {
      setHasExistingGame(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#31587A] to-[#3C3266]">
      {hasExistingGame && (
        <div className="bg-white slide-down flex flex-col gap-3 w-1/6 place-items-center justify-center shadow-lg rounded-b-md fixed top-0 left-0 right-0 mx-auto pt-4 z-50">
          <div className="flex gap-2 mx-8">
            <i className="fa-solid fa-circle-info text-xl text-[#E63946]"></i>
            <p className="font-semibold text-lg">Jums ir iesākta spēle!</p>
          </div>
          <button
            onClick={() => navigate("/play/lobby")}
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

        <div className="text-center animate-bounce">
          <p className="text-white font-semibold text-2xl">Lokālās spēles</p>
          <i className="fa-solid fa-chevron-down text-3xl text-white"></i>
        </div>
      </form>
      <div className="bg-black bg-opacity-25 h-auto p-12">
        <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-12">
          <InstanceCard />
        </div>
        <div className="w-full text-center">
          <h1 className="text-white text-2xl font-[Manrope]">
            Pašlaik nav lokālas spēles. :(
          </h1>
        </div>
      </div>
      <div className="bg-black bg-opacity-30 flex h-24 p-12 place-items-center justify-between">
        <p className="text-white font-semibold">Veidoja: Roberts R.; 2024</p>
        <button
          onClick={() => navigate("/admin/login")}
          className="w-24 py-1 bg-[#E63946] rounded-md text-center shadow-lg text-white font-semibold hover:bg-opacity-50 transition-all lg:block hidden hover:cursor-pointer"
        >
          <span className="text-center h-8">Admin</span>
        </button>
      </div>
    </div>
  );
}

export default App;
