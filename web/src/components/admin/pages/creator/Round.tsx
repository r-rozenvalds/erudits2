import { useEffect, useState } from "react";
import { AdminSessionStorage } from "../../enum/AdminSessionStorage";
import CreateRoundModel from "../../models/CreateRoundModel";
import { ICreateRoundFormValues } from "../../interface/ICreateRoundFormValues";
import useDebounce from "../../../universal/useDebounce";
import { constants } from "../../../../constants";
import { localizeError, localizeSuccess } from "../../../../localization";
import { useToast } from "../../../universal/Toast";
import { SubmitSaveButton } from "../../ui/SubmitSaveButton";
import { useBreadCrumbs } from "../../../universal/BreadCrumbContext";

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

  let formValues: ICreateRoundFormValues = CreateRoundModel;

  const debounceTitle = useDebounce(title, 300);
  const debounceDisqualifyAmount = useDebounce(disqualifyAmount, 300);
  const debounceAnswerTime = useDebounce(answerTime, 300);
  const debouncePoints = useDebounce(points, 300);
  const debounceIsAdditional = useDebounce(isAdditional, 300);

  const showToast = useToast();

  const saveToSessionStorage = () => {
    var values = JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.roundCreator) || "{}"
    );

    values = {
      ...values,
      title: formValues.title,
      disqualify_amount: formValues.disqualify_amount,
      answer_time: formValues.answer_time,
      points: formValues.points,
      is_additional: formValues.is_additional,
    };
    sessionStorage.setItem(
      AdminSessionStorage.roundCreator,
      JSON.stringify(values)
    );
  };

  const loadFormValues = () => {
    return JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.roundCreator) || "{}"
    ) as ICreateRoundFormValues;
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

  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const values = JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.roundCreator) || "{}"
    );
    if (!values) {
      return;
    }
    const response = await fetch(`${constants.baseApiUrl}/rounds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
      body: JSON.stringify({
        id: values.id,
        title: values.title,
        disqualify_amount: values.disqualify_amount,
        answer_time: values.answer_time,
        points: values.points,
        is_additional: values.is_additional,
        game_id: values.game_id,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      showToast!(true, localizeSuccess(data.message));

      //navigate(`round/${data.id}/question`);
    } else {
      const data = await response.json();
      Object.keys(data).map((key) =>
        showToast!(false, localizeError(data[key]))
      );
    }
  };

  const { setBreadCrumbs, clearBreadCrumbs } = useBreadCrumbs();

  useEffect(() => {
    clearBreadCrumbs();
    setBreadCrumbs("/admin/games", "Spēļu saraksts");
    setBreadCrumbs("/admin/games", "Spēles izveide");
    setBreadCrumbs("/admin/games", "Kārtas izveide");
  }, []);

  return (
    <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
      <form
        onSubmit={onFormSubmit}
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
                className="w-10 h-10 p-2 rounded-md text-center accent-[#E63946]"
                checked={isAdditional}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 place-self-end">
          <SubmitSaveButton hideSaveButton={true} />
        </div>
      </form>
    </div>
  );
};