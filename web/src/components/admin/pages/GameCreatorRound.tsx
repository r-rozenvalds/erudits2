import { useEffect, useState } from "react";
import { AdminSessionStorage } from "../enum/AdminSessionStorage";
import CreateRoundModel from "../models/CreateRoundModel";
import { CreateRoundFormValues } from "../interface/CreateRoundFormValues";
import useDebounce from "../../universal/useDebounce";
import { GroupMinimap } from "../ui/minimap/GroupMinimap";
import { constants } from "../../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { localizeError, localizeSuccess } from "../../../localization";
import { useToast } from "../../universal/Toast";
import { SubmitSaveButton } from "../ui/SubmitSaveButton";

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

  const { gameId, roundId } = useParams();

  formValues.game_id = gameId;

  const debounceTitle = useDebounce(title, 300);
  const debounceDisqualifyAmount = useDebounce(disqualifyAmount, 300);
  const debounceAnswerTime = useDebounce(answerTime, 300);
  const debouncePoints = useDebounce(points, 300);
  const debounceIsAdditional = useDebounce(isAdditional, 300);

  const navigate = useNavigate();

  const showToast = useToast();

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

  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await fetch(`${constants.baseApiUrl}/rounds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
      body: JSON.stringify(formValues),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          showToast!(true, localizeSuccess(data.message));

          //navigate(`round/${data.id}/question`);
        } else {
          Object.keys(data).map((key) =>
            showToast!(false, localizeError(data[key]))
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRound = async () => {
    await fetch(`${constants.baseApiUrl}/rounds/${roundId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setAnswerTime(data.answer_time);
          setTitle(data.title);
          setDisqualifyAmount(data.disqualify_amount);
          setPoints(data.points);
          setIsAdditional(data.is_additional);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSave = async () => {
    await fetch(`${constants.baseApiUrl}/rounds/${roundId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
      body: JSON.stringify(formValues),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          showToast!(true, localizeSuccess(data.message));
        } else {
          Object.keys(data).map((key) =>
            showToast!(false, localizeError(data[key]))
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getRound();
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

          <div className="flex gap-6">
            <GroupMinimap />
            <SubmitSaveButton onSave={onSave} />
          </div>
        </form>
      </div>
    </div>
  );
};
