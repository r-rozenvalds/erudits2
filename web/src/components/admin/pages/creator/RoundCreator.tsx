import { FormEvent, useEffect, useState } from "react";
import { SaveDeleteButtons } from "../../ui/SaveDeleteButtons";
import { IRound } from "../../../../stores/interfaces/creator/IRound";
import { gameStore } from "../../../../stores/GameStore";

export const RoundCreator = ({ round }: { round: IRound }) => {
  const [title, setTitle] = useState<string>(round.title);
  const [disqualifyAmount, setDisqualifyAmount] = useState<number>(
    round.disqualify_amount
  );
  const [answerTime, setAnswerTime] = useState<number>(round.answer_time);
  const [points, setPoints] = useState<number>(round.points);
  const [isAdditional, setIsAdditional] = useState<boolean>(
    round.is_additional
  );
  const [isTest, setIsTest] = useState<boolean>(round.is_test);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { postRound } = gameStore();

  useEffect(() => {
    setTitle(round.title);
    setDisqualifyAmount(round.disqualify_amount);
    setAnswerTime(round.answer_time);
    setPoints(round.points);
    setIsAdditional(round.is_additional);
    setIsTest(round.is_test);
  }, [round]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const request = {
      ...round,
      title,
      disqualify_amount: disqualifyAmount,
      answer_time: answerTime,
      points,
      is_additional: isAdditional,
      is_test: isTest,
    } as IRound;

    await postRound(request);

    setIsLoading(false);
  };

  const onDelete = async () => {};

  return (
    <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2 w-full justify-between"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Kārtas nosaukums</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="p-2 px-4 shadow-sm rounded-sm bg-slate-100"
              value={title}
            />
          </div>
          <div className="flex justify-between px-16">
            <div className="flex flex-col gap-2 place-items-center">
              <label className="text-lg font-semibold">
                Diskvalificēto skaits
              </label>
              <div className="flex place-items-center gap-6 justify-center w-full">
                <i className="fa-solid fa-person-circle-minus text-2xl text-slate-600"></i>
                <input
                  onChange={(e) =>
                    setDisqualifyAmount(parseInt(e.target.value))
                  }
                  min={0}
                  type="number"
                  className="w-24 p-2 bg-slate-100 rounded-md text-center"
                  value={disqualifyAmount}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 place-items-center">
              <label className="text-lg font-semibold">
                Laiks atbildei (sek.)
              </label>
              <div className="flex place-items-center gap-6 justify-center w-full">
                <i className="fa-solid fa-stopwatch text-2xl text-slate-600"></i>
                <input
                  onChange={(e) => setAnswerTime(parseInt(e.target.value))}
                  type="number"
                  min={0}
                  className="w-24 p-2 bg-slate-100 rounded-md text-center"
                  value={answerTime}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 place-items-center">
              <label className="text-lg font-semibold">
                Punktu skaits par pareizu atbildi
              </label>
              <div className="flex place-items-center gap-6 justify-center w-full">
                <i className="fa-solid fa-bullseye text-2xl text-slate-600"></i>
                <input
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                  type="number"
                  min={0}
                  className="w-24 p-2 bg-slate-100 rounded-md text-center"
                  value={points}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 place-items-center justify-between">
              <label className="text-lg font-semibold">
                Šie ir papildjautājumi
              </label>
              <input
                onChange={() => setIsAdditional(!isAdditional)}
                type="checkbox"
                className={`w-10 h-10 p-2 rounded-md text-center accent-[#E63946] ${
                  isTest ? "cursor-not-allowed" : ""
                }`}
                checked={isAdditional}
                disabled={isTest}
              />
            </div>
            <div className="flex flex-col gap-2 place-items-center justify-between">
              <label className="text-lg font-semibold">Testa veida</label>
              <input
                onChange={() => setIsTest(!isTest)}
                type="checkbox"
                disabled={isAdditional}
                className={`w-10 h-10 p-2 rounded-md text-center accent-[#E63946] ${
                  isAdditional ? "cursor-not-allowed" : ""
                }`}
                checked={isTest}
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-8">
          <SaveDeleteButtons
            showSpinner={isLoading}
            onDelete={onDelete}
            showNavigationButtons
          />
        </div>
      </form>
    </div>
  );
};
