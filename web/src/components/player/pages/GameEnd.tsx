import { PlayerLocalStorage } from "../enum/PlayerLocalStorage";

export const GameEnd = () => {
  const exitGame = () => {
    localStorage.removeItem(PlayerLocalStorage.currentGame);
    window.location.assign("/");
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      <p className="px-12 py-6 bg-black bg-opacity-50 rounded-md text-center mx-auto text-white font-bold text-4xl">
        Spēle ir noslēgusies.
      </p>
      <button
        onClick={exitGame}
        className="bg-black bg-opacity-50 text-white h-10 w-40 mx-auto rounded-md font-semibold hover:bg-opacity-60"
      >
        Atgriezties
      </button>
    </div>
  );
};
