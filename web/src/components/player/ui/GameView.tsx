import { useEffect, useState } from "react";
import { AnswerOption } from "./AnswerOption";
import { usePlayer } from "../../universal/PlayerContext";
import { SpinnerCircularFixed } from "spinners-react";
import Countdown from "react-countdown";
import { OpenAnswer } from "./OpenAnswer";
import { PlayerLocalStorage } from "../enum/PlayerLocalStorage";

export const GameView = () => {
  const [viewImage, setViewImage] = useState(false);
  const [text, setText] = useState("");

  const {
    answers,
    round,
    selectedAnswers,
    setSelectedAnswers,
    roundFinished,
    currentQuestion,
    setRoundFinished,
    setChangedAnswer,
    countdownTime,
    isTiebreaking,
    setIsTiebreaking,
  } = usePlayer();

  if (!currentQuestion || !round) {
    return (
      <div className="flex flex-col gap-4 place-items-center">
        <p className="text-white text-xl font-semibold">Lūdzu, uzgaidiet!</p>
        <SpinnerCircularFixed size={45} thickness={180} color="#fff" />
      </div>
    );
  }

  const renderer = ({
    minutes,
    seconds,
    completed,
  }: {
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      setRoundFinished(true);
      setChangedAnswer(true);
      return (
        <div
          className="text-white font-semibold text-2xl w-28 rounded-md py-1"
          style={{
            backgroundColor: `rgba(255, 0, 0, 0.5)`,
          }}
        >
          <i className="fa-regular fa-clock text-2xl drop-shadow-lg me-3"></i>
          00:00
        </div>
      );
    }
    return (
      <div
        className="text-white font-semibold text-2xl w-28 rounded-md py-1"
        style={{
          backgroundColor: `rgba(255, 0, 0, ${
            minutes === 0 && seconds < 11 ? 0.05 * (11 - seconds) : 0
          })`,
        }}
      >
        <i className="fa-regular fa-clock text-2xl drop-shadow-lg me-3"></i>
        {minutes > 9 ? minutes : "0" + minutes}:
        {seconds > 9 ? seconds : "0" + seconds}
      </div>
    );
  };

  const setSelectedAnswer = (answerId: string) => {
    setChangedAnswer(true);
    setSelectedAnswers(new Map([[currentQuestion.id, answerId]]));
    localStorage.setItem(
      PlayerLocalStorage.answers,
      JSON.stringify({ [currentQuestion.id]: answerId })
    );
    setRoundFinished(true);
  };

  const handleViewImage = () => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewImage(false);
      }
    };

    if (!viewImage) {
      document.addEventListener("keydown", handleKeyDown);
      setViewImage(!viewImage);
      return;
    }

    document.removeEventListener("keydown", handleKeyDown);
    setViewImage(!viewImage);
  };

  if (roundFinished) {
    return (
      <div className="flex place-items-center justify-center flex-col gap-4 fade-in-short">
        <p className="text-white text-3xl font-bold">Atbilde iesniegta</p>
        <div className="w-12 h-12 bg-white border-white border-4 rounded-full text-center">
          <i className="fa-solid fa-check text-[#30345f] text-3xl mt-1"></i>
        </div>
        <p className="text-white text-xl font-semibold">
          Lūdzu, gaidiet nākamo jautājumu
        </p>
      </div>
    );
  }

  const getCountdownDate = () => {
    if (!countdownTime || !round?.answer_time) return 0;

    const dateStartedAt = new Date(countdownTime);
    if (isTiebreaking) {
      console.log("return", dateStartedAt.getTime() + round.answer_time * 1000);
      return dateStartedAt.getTime() + round.answer_time * 1000;
    }

    // const localTimeOffset = dateStartedAt.getTimezoneOffset() * 60 * 1000;
    console.log("return", dateStartedAt.getTime() + round.answer_time * 1000);

    return dateStartedAt.getTime() + round.answer_time * 1000;
  };

  const handleInputChange = (input: string) => {
    setText(input);
    localStorage.setItem(
      PlayerLocalStorage.answers,
      JSON.stringify({ [currentQuestion.id]: input })
    );
  };

  const handleSubmit = () => {
    setSelectedAnswers(new Map([[currentQuestion.id, text]]));
    setRoundFinished(true);
    setChangedAnswer(true);
    setText("");
  };

  return (
    <div
      className={`text-center select-none p-12 w-screen flex flex-col gap-4 h-screen`}
    >
      {isTiebreaking && (
        <div className="flex absolute left-0 top-0 px-12 h-12 bg-yellow-300 animate-pulse w-full shadow-lg place-items-center justify-between text-2xl">
          <i className="fa-solid fa-scale-balanced"></i>
          <p className="font-bold">Neizšķirts - papildu jautājums</p>
          <i className="fa-solid fa-scale-balanced"></i>
        </div>
      )}
      {viewImage && (
        <div
          onClick={handleViewImage}
          onDrag={handleViewImage}
          className="absolute z-30 w-full h-full bg-black bg-opacity-90 flex place-items-center justify-center top-0 left-0"
        >
          <img
            className="w-full h-full object-contain"
            src="/test-img1.jpg"
          ></img>
          <p className="absolute z-40 text-white text-3xl font-semibold bg-black opacity-70 px-4 py-2 rounded-md bottom-4">
            Uzklikšķiniet jebkur, lai aizvērtu bildi
          </p>
        </div>
      )}

      <>
        <div className="bg-black bg-opacity-40 rounded-md text-white w-full h-24 flex place-items-center px-12 justify-between slide-up">
          <Countdown
            key={countdownTime}
            renderer={renderer}
            date={getCountdownDate()}
          />
          <p className="font-semibold text-3xl drop-shadow-md">
            {currentQuestion.title}
          </p>
          <div className="text-white font-semibold text-2xl w-28">
            {!isTiebreaking && (
              <span>
                {currentQuestion.order}/{round?.total_questions}
              </span>
            )}
            <i className="fa-regular fa-circle-question text-2xl drop-shadow-lg ms-3"></i>
          </div>
        </div>
        <div className="bg-black bg-opacity-40 rounded-md fade-in text-white grow place-items-center p-8 flex gap-4 justify-between">
          {!currentQuestion.is_text_answer && (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-4">
              {answers
                .filter((answer) => answer.question_id === currentQuestion.id)
                .map((answer, index) => (
                  <AnswerOption
                    key={answer.id}
                    setSelectedAnswer={setSelectedAnswer}
                    selectedAnswer={
                      selectedAnswers?.get(currentQuestion.id) ?? ""
                    }
                    answerId={answer.id}
                    childNr={index + 1}
                    content={answer.text ?? ""}
                    isTest={false}
                  />
                ))}
            </div>
          )}
          {!!currentQuestion.is_text_answer && (
            <OpenAnswer
              guidelines={currentQuestion.guidelines}
              selectedAnswer={text}
              showSubmitButton={true}
              onSubmit={handleSubmit}
              setSelectedAnswer={handleInputChange}
            />
          )}
        </div>
      </>

      <button
        onClick={handleViewImage}
        className="bg-black bg-opacity-40 hover:bg-opacity-30 transition-all rounded-md fade-in text-white place-items-center justify-center h-20"
      >
        <div className="font-bold text-2xl">
          {viewImage ? "Aizvērt attēlu" : "Skatīt attēlu"}
          <i className="fa-regular fa-image text-xl ms-2"></i>
        </div>
      </button>
    </div>
  );
};
