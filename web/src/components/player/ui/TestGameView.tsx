import { useEffect, useRef, useState } from "react";
import { AnswerOption } from "./AnswerOption";
import { usePlayer } from "../../universal/PlayerContext";
import { SpinnerCircularFixed } from "spinners-react";
import Countdown from "react-countdown";
import { OpenAnswer } from "./OpenAnswer";
import { PlayerLocalStorage } from "../enum/PlayerLocalStorage";

export const TestGameView = () => {
  const [viewImage, setViewImage] = useState(false);
  const [completed, setCompleted] = useState(false);
  const startDate = useRef(Date.now());
  const [changedAnswer, setChangedAnswer] = useState(false);

  const {
    questions,
    fetchQuestions,
    answers,
    round,
    selectedAnswers,
    setSelectedAnswers,
    postAnswers,
  } = usePlayer();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (!questions[currentQuestion]) {
    setTimeout(() => {
      fetchQuestions();
    }, 2000);

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
      setCompleted(true);
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
            seconds < 11 ? 0.05 * (11 - seconds) : 0
          })`,
        }}
      >
        <i className="fa-regular fa-clock text-2xl drop-shadow-lg me-3"></i>0
        {minutes}:{seconds > 9 ? seconds : "0" + seconds}
      </div>
    );
  };

  const nextQuestion = () => {
    if (changedAnswer) {
      setChangedAnswer(false);
      postAnswers(questions[currentQuestion].id);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (changedAnswer) {
      setChangedAnswer(false);
      postAnswers(questions[currentQuestion].id);
    }

    if (currentQuestion - 1 >= 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const setSelectedAnswer = (answerId: string) => {
    setChangedAnswer(true);
    // @ts-ignore
    setSelectedAnswers((prev) => {
      const newAnswers = new Map(prev);
      const questionId = questions[currentQuestion].id;
      newAnswers.set(questionId, answerId);
      localStorage.setItem(
        PlayerLocalStorage.answers,
        JSON.stringify(Object.fromEntries(newAnswers))
      );
      return newAnswers;
    });
  };

  return (
    <div className="text-center select-none p-12 w-screen flex flex-col gap-4 h-screen">
      {viewImage && (
        <div
          onClick={() => setViewImage(false)}
          onDrag={() => setViewImage(false)}
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
            renderer={renderer}
            date={startDate.current + round?.answer_time! * 1000}
          />
          <p
            onClick={() => console.log(selectedAnswers)}
            className="font-semibold text-3xl drop-shadow-md"
          >
            {questions[currentQuestion].title}
          </p>
          <div className="text-white font-semibold text-2xl w-28">
            <span>
              {currentQuestion + 1}/{questions.length}
            </span>
            <i className="fa-regular fa-circle-question text-2xl drop-shadow-lg ms-3"></i>
          </div>
        </div>
        <div className="bg-black bg-opacity-40 rounded-md fade-in text-white grow place-items-center p-8 flex gap-4 justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`w-24 h-full justify-center bg-black bg-opacity-30 rounded-md transition-all  ${
              currentQuestion === 0
                ? "cursor-not-allowed"
                : "hover:bg-opacity-60"
            }`}
          >
            <i className="fa-solid fa-angle-left text-6xl drop-shadow-lg"></i>
          </button>
          {!questions[currentQuestion].is_text_answer && (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-4">
              <AnswerOption
                setSelectedAnswer={setSelectedAnswer}
                selectedAnswer={
                  selectedAnswers?.get(questions[currentQuestion].id) ?? ""
                }
                answerId={
                  answers.filter(
                    (answer) =>
                      answer.question_id === questions[currentQuestion].id
                  )[0]?.id
                }
                childNr={1}
                content={
                  answers.filter(
                    (answer) =>
                      answer.question_id === questions[currentQuestion].id
                  )[0]?.text ?? ""
                }
                isTest={true}
              />
              <AnswerOption
                setSelectedAnswer={setSelectedAnswer}
                selectedAnswer={
                  selectedAnswers?.get(questions[currentQuestion].id) ?? ""
                }
                childNr={2}
                answerId={
                  answers.filter(
                    (answer) =>
                      answer.question_id === questions[currentQuestion].id
                  )[1]?.id
                }
                content={
                  answers.filter(
                    (answer) =>
                      answer.question_id === questions[currentQuestion].id
                  )[1]?.text ?? ""
                }
                isTest={true}
              />
              <AnswerOption
                setSelectedAnswer={setSelectedAnswer}
                selectedAnswer={
                  selectedAnswers?.get(questions[currentQuestion].id) ?? ""
                }
                childNr={3}
                answerId={
                  answers.filter(
                    (answer) =>
                      answer.question_id === questions[currentQuestion].id
                  )[2]?.id
                }
                content={
                  answers.filter(
                    (answer) =>
                      answer.question_id === questions[currentQuestion].id
                  )[2]?.text ?? ""
                }
                isTest={true}
              />
              <AnswerOption
                answerId={
                  answers.filter(
                    (answer) =>
                      answer.question_id === questions[currentQuestion].id
                  )[3]?.id
                }
                setSelectedAnswer={setSelectedAnswer}
                selectedAnswer={
                  selectedAnswers?.get(questions[currentQuestion].id) ?? ""
                }
                childNr={4}
                content={
                  answers.filter(
                    (answer) =>
                      answer.question_id === questions[currentQuestion].id
                  )[3]?.text ?? ""
                }
                isTest={true}
              />
            </div>
          )}
          {!!questions[currentQuestion].is_text_answer && (
            <OpenAnswer
              guidelines={questions[currentQuestion].guidelines}
              selectedAnswer={
                selectedAnswers?.get(questions[currentQuestion].id) ?? ""
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
        onClick={() => setViewImage(!viewImage)}
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
