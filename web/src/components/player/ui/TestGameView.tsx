import { useState } from "react";
import { AnswerOption } from "./AnswerOption";
import { usePlayer } from "../../universal/PlayerContext";
import { SpinnerCircularFixed } from "spinners-react";
import Countdown from "react-countdown";
import { OpenAnswer } from "./OpenAnswer";
import { PlayerLocalStorage } from "../enum/PlayerLocalStorage";
import { useConfirmation } from "../../universal/ConfirmationWindowContext";
import { constants } from "../../../constants";

export const TestGameView = () => {
  const [viewImage, setViewImage] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const {
    questions,
    answers,
    round,
    selectedAnswers,
    setSelectedAnswers,
    playerId,
    roundFinished,
    setRoundFinished,
    setChangedAnswer,
  } = usePlayer();

  const confirm = useConfirmation();

  if (!questions[questionIndex]) {
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

  const finishRound = async () => {
    if (await confirm("Iesniegt atbildes?")) {
      setRoundFinished(true);
      await fetch(`${constants.baseApiUrl}/player-finish-round`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_id: playerId,
        }),
      });
    }
  };

  const nextQuestion = () => {
    if (questionIndex + 1 === questions.length) {
      finishRound();
      return;
    }

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (questionIndex - 1 >= 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const setSelectedAnswer = (answerId: string) => {
    setChangedAnswer(true);
    // @ts-ignore
    setSelectedAnswers((prev) => {
      const newAnswers = new Map(prev);
      const questionId = questions[questionIndex].id;
      newAnswers.set(questionId, answerId);
      localStorage.setItem(
        PlayerLocalStorage.answers,
        JSON.stringify(Object.fromEntries(newAnswers))
      );
      return newAnswers;
    });
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
      <div className="flex place-items-center justify-center flex-col gap-4">
        <p className="text-white text-2xl font-semibold">
          Lūdzu, gaidiet nākamo kārtu!
        </p>
        <SpinnerCircularFixed size={45} thickness={180} color="#fff" />
      </div>
    );
  }

  const getCountdownDate = () => {
    if (!round?.round_started_at || !round?.answer_time) return 0;

    const dateStartedAt = new Date(round.round_started_at);
    const localTimeOffset = dateStartedAt.getTimezoneOffset() * 60 * 1000;

    return dateStartedAt.getTime() - localTimeOffset + round.answer_time * 1000;
  };

  return (
    <div className="text-center select-none p-12 w-screen flex flex-col gap-4 h-screen">
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
            key={round?.round_started_at}
            renderer={renderer}
            date={getCountdownDate()}
          />
          <p className="font-semibold text-3xl drop-shadow-md">
            {questions[questionIndex].title}
          </p>
          <div className="text-white font-semibold text-2xl w-28">
            <span>
              {questionIndex + 1}/{questions.length}
            </span>
            <i className="fa-regular fa-circle-question text-2xl drop-shadow-lg ms-3"></i>
          </div>
        </div>
        <div className="bg-black bg-opacity-40 rounded-md fade-in text-white grow place-items-center p-8 flex gap-4 justify-between">
          <button
            onClick={prevQuestion}
            disabled={questionIndex === 0}
            className={`w-24 h-full justify-center bg-black bg-opacity-30 rounded-md transition-all  ${
              questionIndex === 0 ? "cursor-not-allowed" : "hover:bg-opacity-60"
            }`}
          >
            <i className="fa-solid fa-angle-left text-6xl drop-shadow-lg"></i>
          </button>
          {!questions[questionIndex].is_text_answer && (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-4">
              {answers
                .filter(
                  (answer) => answer.question_id === questions[questionIndex].id
                )
                .map((answer, index) => (
                  <AnswerOption
                    key={answer.id}
                    setSelectedAnswer={setSelectedAnswer}
                    selectedAnswer={
                      selectedAnswers?.get(questions[questionIndex].id) ?? ""
                    }
                    answerId={answer.id}
                    childNr={index + 1}
                    content={answer.text ?? ""}
                    isTest={true}
                  />
                ))}
            </div>
          )}
          {!!questions[questionIndex].is_text_answer && (
            <OpenAnswer
              guidelines={questions[questionIndex].guidelines}
              selectedAnswer={
                selectedAnswers?.get(questions[questionIndex].id) ?? ""
              }
              setSelectedAnswer={setSelectedAnswer}
            />
          )}
          <button
            onClick={nextQuestion}
            className="w-24 h-full justify-center bg-black bg-opacity-30 rounded-md transition-all hover:bg-opacity-60"
          >
            <i className="fa-solid fa-angle-right text-6xl drop-shadow-lg"></i>
          </button>
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
