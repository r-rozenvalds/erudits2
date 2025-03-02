import { useEffect, useState } from "react";
import { TestGameView } from "../ui/TestGameView";
import { GameView } from "../ui/GameView";

export const Game = () => {
  // const [intro, setIntro] = useState(true);
  // const [countdown, setCountdown] = useState(3);

  // useEffect(() => {
  //   if (intro) {
  //     const countdownInterval = setInterval(() => {
  //       setCountdown((prevCountdown) => prevCountdown - 1);
  //     }, 1000);

  //     const introTimeout = setTimeout(() => {
  //       setIntro(false);
  //       clearInterval(countdownInterval);
  //     }, 3500);

  //     return () => {
  //       clearInterval(countdownInterval);
  //       clearTimeout(introTimeout);
  //     };
  //   }
  // }, [intro]);

  // if (intro) {
  //   return (
  //     <div className="text-center select-none">
  //       <p className="text-white font-semibold text-2xl drop-shadow-md mb-4">
  //         Gatavojieties!
  //       </p>
  //       <div className="bg-black w-40 h-40 bg-opacity-50 rounded-full shadow-lg">
  //         <p className="text-white font-semibold text-8xl drop-shadow-md pt-6">
  //           {countdown}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return <GameView />;
};
