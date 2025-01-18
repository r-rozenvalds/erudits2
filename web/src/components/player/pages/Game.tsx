import { useEffect, useState } from "react";

export const Game = () => {
  const [intro, setIntro] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(0);

  useEffect(() => {
    if (intro) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      const introTimeout = setTimeout(() => {
        setIntro(false);
        clearInterval(countdownInterval);
      }, 3500);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(introTimeout);
      };
    }
  }, [intro]);

  if (intro) {
    return (
      <div className="text-center select-none">
        <p className="text-white font-semibold text-2xl drop-shadow-md mb-4">
          Gatavojieties!
        </p>
        <div className="bg-black w-40 h-40 bg-opacity-50 rounded-full shadow-lg">
          <p className="text-white font-semibold text-8xl drop-shadow-md pt-6">
            {countdown}
          </p>
        </div>
      </div>
    );
  }

  const answerOption = () => {
    return (
      <div
        onClick={() => setSelectedAnswer(1)}
        className={`bg-slate-200 group h-full rounded-md hover:bg-white shadow-lg transition-all place-self-end flex place-items-center ${
          selectedAnswer !== 0 ? "w-80 px-0 " : "w-full px-8"
        }`}
      >
        <div
          className={` border-8 w-48 h-48 rounded-full shadow-lg  group-hover:shadow-none p-4 ${
            selectedAnswer !== 0
              ? "mx-auto border-[#d88098]"
              : "mx-0 group-hover:border-[#d88098] border-white"
          }`}
        >
          <img
            src="/rose.png"
            className={`${
              selectedAnswer !== 0 ? "rose-filter" : "group-hover:rose-filter"
            }`}
          ></img>
        </div>
        {!selectedAnswer && (
          <p className="text-4xl text-slate-700 font-bold ms-12 group-hover:text-[#d88098] drop-shadow-lg">
            HELLO THIS IS ANSWER
          </p>
        )}
      </div>
    );
  };

  const answerOption2 = () => {
    return (
      <div
        onClick={() => setSelectedAnswer(1)}
        className={`bg-slate-200 group h-full rounded-md hover:bg-white shadow-lg transition-all place-self-start flex place-items-center place-content-around ${
          selectedAnswer !== 0 ? "w-80 px-0 " : "w-full px-8"
        }`}
      >
        {!selectedAnswer && (
          <p className="text-4xl text-slate-700 font-bold ms-12 group-hover:text-[#d88098] drop-shadow-lg">
            HELLO THIS IS ANSWER
          </p>
        )}
        <div
          className={` border-8 w-48 h-48 rounded-full shadow-lg  group-hover:shadow-none p-4 ${
            selectedAnswer !== 0
              ? "border-[#ebcd6f]"
              : "group-hover:border-[#ebcd6f] border-white"
          }`}
        >
          <img
            src="/sunflower.png"
            className={`${
              selectedAnswer !== 0
                ? "sunflower-filter"
                : "group-hover:sunflower-filter"
            }`}
          ></img>
        </div>
      </div>
    );
  };

  return (
    <div className="text-center select-none p-12 w-screen flex flex-col gap-4 h-screen">
      <div className="bg-black bg-opacity-40 rounded-md text-white w-full h-24 flex place-items-center px-12 justify-between slide-up">
        <div className="text-white font-semibold text-2xl flex gap-4 place-items-center">
          <i className="fa-regular fa-clock text-3xl drop-shadow-lg"></i>
          <span>00:23</span>
        </div>
        <p className="font-semibold text-3xl drop-shadow-md">
          Kā sauca cilvēku, kas bija viens no pasaules cilvēkiem ar dažādiem
          citiem cilvēkiem?
        </p>
        <div className="text-white font-semibold text-2xl flex gap-4 place-items-center">
          <span>1/10</span>
          <i className="fa-regular fa-circle-question text-3xl drop-shadow-lg"></i>
        </div>
      </div>
      <div className="bg-black bg-opacity-40 rounded-md fade-in text-white grow place-items-center p-8 justify-between">
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-4">
          {answerOption()}
          {answerOption2()}
          {answerOption()}
          {answerOption2()}
        </div>
      </div>
    </div>
  );
};
