import { useEffect, useState } from "react";
import { AdminSessionStorage } from "../enum/AdminSessionStorage";
import CreateRoundModel from "../models/CreateRoundModel";
import { CreateRoundFormValues } from "../interface/CreateRoundFormValues";
import useDebounce from "../useDebounce";
import { GroupMinimap } from "../ui/minimap/GroupMinimap";

export const GameCreatorQuestionRound = () => {
  const [title, setTitle] = useState(CreateRoundModel.title);
  const [disqualifyAmount, setDisqualifyAmount] = useState(
    CreateRoundModel.disqualify_amount
  );
  const [answerTime, setAnswerTime] = useState(CreateRoundModel.answer_time);
  const [points, setPoints] = useState(CreateRoundModel.points);
  const [isAdditional, setIsAdditional] = useState(
    CreateRoundModel.is_additional
  );

  const [isLoaded, setIsLoaded] = useState(false);

  let formValues: CreateRoundFormValues = CreateRoundModel;

  const debounceTitle = useDebounce(title, 1000);
  const debounceDisqualifyAmount = useDebounce(disqualifyAmount, 1000);
  const debounceAnswerTime = useDebounce(answerTime, 1000);
  const debouncePoints = useDebounce(points, 1000);
  const debounceIsAdditional = useDebounce(isAdditional, 1000);

  const saveToSessionStorage = () => {
    sessionStorage.setItem(
      AdminSessionStorage.roundCreator,
      JSON.stringify(formValues)
    );
  };

  const loadFormValues = () => {
    return JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.roundCreator) || "{}"
    ) as CreateRoundFormValues;
  };

  useEffect(() => {
    if (isLoaded) {
      formValues.title = debounceTitle;
      saveToSessionStorage();
    }
  }, [debounceTitle]);

  useEffect(() => {
    if (isLoaded) {
      formValues.disqualify_amount = debounceDisqualifyAmount;
      saveToSessionStorage();
    }
  }, [debounceDisqualifyAmount]);

  useEffect(() => {
    if (isLoaded) {
      formValues.answer_time = debounceAnswerTime;
      saveToSessionStorage();
    }
  }, [debounceAnswerTime]);

  useEffect(() => {
    if (isLoaded) {
      formValues.points = debouncePoints;
      saveToSessionStorage();
    }
  }, [debouncePoints]);

  useEffect(() => {
    if (isLoaded) {
      formValues.is_additional = debounceIsAdditional;
      saveToSessionStorage();
    }
  }, [debounceIsAdditional]);

  useEffect(() => {
    formValues = loadFormValues();
    setTitle(formValues.title);
    setDisqualifyAmount(formValues.disqualify_amount);
    setAnswerTime(formValues.answer_time);
    setPoints(formValues.points);
    setIsAdditional(formValues.is_additional);

    setIsLoaded(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden p-12 bg-gradient-to-r from-[#31587A] to-[#3C3266] gap-6">
      <div className="flex w-full p-4 rounded-md font-[Manrope] gap-4 bg-white place-items-center">
        <a href="/admin/games" className="text-lg">
          Spēļu saraksts
        </a>
        <i className="fa-solid fa-chevron-right"></i>
        <a className="text-lg">Spēles izveide</a>
        <i className="fa-solid fa-chevron-right"></i>
        <a className="text-lg">Pirmā kārta</a>
      </div>
      <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
        <form className="flex flex-col gap-2 w-full justify-between">
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
              <div className="flex flex-col gap-2 place-items-center">
                <label className="text-lg font-semibold">
                  Laiks atbildei (sek.)
                </label>
                <input
                  onChange={(e) => setAnswerTime(parseInt(e.target.value))}
                  type="number"
                  min={0}
                  className="w-24 p-2 bg-slate-100 rounded-md text-center"
                  value={answerTime}
                />
              </div>
              <div className="flex flex-col gap-2 place-items-center">
                <label className="text-lg font-semibold">
                  Punktu skaits par pareizu atbildi
                </label>
                <input
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                  type="number"
                  min={0}
                  className="w-24 p-2 bg-slate-100 rounded-md text-center"
                  value={points}
                />
              </div>
              <div className="flex flex-col gap-2 place-items-center justify-between">
                <label className="text-lg font-semibold">
                  Šie ir papildjautājumi
                </label>
                <input
                  onChange={() => setIsAdditional(!isAdditional)}
                  type="checkbox"
                  className="w-10 h-10 p-2 rounded-md text-center accent-[#E63946]"
                  checked={isAdditional}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <GroupMinimap />
            <input
              className="h-12 w-60 bg-[#E63946] rounded-md shadow-lg text-white text-xl font-bold hover:bg-opacity-50 transition-all hover:cursor-pointer place-self-end"
              type="submit"
              value="Turpināt"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
