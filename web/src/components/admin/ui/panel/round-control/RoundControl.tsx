import { RoundTable } from "./RoundTable";
import { SpinnerCircularFixed } from "spinners-react";
import { useAdminPanel } from "../../../../universal/AdminPanelContext";
import { useState } from "react";
import { constants } from "../../../../../constants";
import { useToast } from "../../../../universal/Toast";
import { RoundCountdown } from "./RoundCountdown";
import { localizeError, localizeSuccess } from "../../../../../localization";
import { DropdownSelect } from "./DropdownSelect";

export const RoundControl = () => {
  const { gameController, fetchQuestionInfo, instanceId } = useAdminPanel();
  const [fetchDisabled, setFetchDisabled] = useState(false);
  const showToast = useToast();

  const refresh = async () => {
    setFetchDisabled(true);
    fetchQuestionInfo();
    setTimeout(() => setFetchDisabled(false), 2500);
  };

  if (!gameController) {
    return (
      <div className="mx-auto mt-10">
        <SpinnerCircularFixed size={40} color="#fff" thickness={180} />
      </div>
    );
  }

  const nextRound = async () => {
    const response = await fetch(`${constants.baseApiUrl}/next-round`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          constants.localStorage.TOKEN
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instance_id: instanceId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      fetchQuestionInfo();
      showToast(true, localizeSuccess(data.message));
    } else {
      const data = await response.json();
      showToast(false, localizeError(data.message));
    }
  };

  const previousRound = async () => {
    const response = await fetch(`${constants.baseApiUrl}/previous-round`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          constants.localStorage.TOKEN
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instance_id: instanceId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      fetchQuestionInfo();
      showToast(true, localizeSuccess(data.message));
    } else {
      const data = await response.json();
      showToast(false, localizeError(data.message));
    }
  };

  const nextQuestion = async () => {
    const response = await fetch(`${constants.baseApiUrl}/next-question`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          constants.localStorage.TOKEN
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instance_id: instanceId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      fetchQuestionInfo();
      showToast(true, localizeSuccess(data.message));
    } else {
      const data = await response.json();
      showToast(false, localizeError(data.message));
    }
  };

  const previousQuestion = async () => {
    const response = await fetch(`${constants.baseApiUrl}/previous-question`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          constants.localStorage.TOKEN
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instance_id: instanceId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      fetchQuestionInfo();
      showToast(true, localizeSuccess(data.message));
    } else {
      const data = await response.json();
      showToast(false, localizeError(data.message));
    }
  };

  const { instance_info } = gameController;

  return (
    <div className="flex flex-col place-items-center w-full overflow-x-scroll">
      <div className="flex gap-1 place-items-center mb-1">
        <p className="font-semibold">Kārtas</p>
        <button
          disabled={fetchDisabled || !instance_info.game_started}
          onClick={refresh}
        >
          {fetchDisabled ? (
            <SpinnerCircularFixed size={12} thickness={230} color="#fff" />
          ) : (
            <i className="fa-solid fa-refresh"></i>
          )}
        </button>
      </div>

      <div className="bg-slate-100 flex flex-col justify-between w-full h-full">
        <div className="w-full h-84 bg-slate-200 py-2">
          <div className="flex gap-2 w-full px-2">
            <DropdownSelect
              title="Pašreizējais jautājums"
              items={[
                "shit",
                "cock",
                "balls",
                "Šis ir garš jautājums viens divi trīs četri pieci seši septiņi astoņi ssssssssssss deviņi desmit?",
                "shit",
                "cock",
                "balls",
                "Šis ir garš jautājums viens divi trīs četri pieci seši septiņi astoņi ssssssssssss deviņi desmit?",
                "shit",
                "cock",
                "balls",
                "Šis ir garš jautājums viens divi trīs četri pieci seši septiņi astoņi ssssssssssss deviņi desmit?",
                "shit",
                "cock",
                "balls",
                "Šis ir garš jautājums viens divi trīs četri pieci seši septiņi astoņi ssssssssssss deviņi desmit?",
                "shit",
                "cock",
                "balls",
                "Šis ir garš jautājums viens divi trīs četri pieci seši septiņi astoņi ssssssssssss deviņi desmit?",
                "shit",
                "cock",
                "balls",
                "Šis ir garš jautājums viens divi trīs četri pieci seši septiņi astoņi ssssssssssss deviņi desmit?",
                "shit",
                "cock",
                "balls",
                "Šis ir garš jautājums viens divi trīs četri pieci seši septiņi astoņi ssssssssssss deviņi desmit?",
              ]}
              getItemName={(item) => item}
              onItemSelect={() => null}
            />

            <DropdownSelect
              title="Pašreizējā kārta"
              items={["aa"]}
              getItemName={(item) => item}
              onItemSelect={() => null}
            />

            <div className="bg-slate-300 flex-col flex place-items-center text-center w-32 rounded-sm">
              <p className="text-xs">Atlikušais laiks</p>
              <p className="font-semibold">
                <RoundCountdown gameController={gameController} />
              </p>
            </div>
          </div>
        </div>
        <RoundTable gameController={gameController} />
        <div className="h-84 bg-slate-200 w-full px-2 py-2 flex justify-between">
          <div className="flex gap-4">
            <button
              disabled={!instance_info.game_started}
              onClick={previousRound}
              className={`${
                !instance_info.game_started
                  ? "bg-slate-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }  text-white font-bold w-48 rounded-sm py-2 transition-all`}
            >
              <i className="fa-solid fa-backward-fast me-2"></i>
              Iepriekšējā kārta
            </button>
            <button
              disabled={instance_info.is_test || !instance_info.current_round}
              onClick={previousQuestion}
              className={`${
                instance_info.is_test || !instance_info.current_round
                  ? "bg-slate-400"
                  : "bg-blue-700 hover:bg-blue-800"
              }  text-white font-bold w-56 rounded-sm py-2 transition-all`}
            >
              <i className="fa-solid fa-backward me-2"></i>
              Iepriekšējais jautājums
            </button>
          </div>
          <div className="flex gap-4">
            <button
              disabled={instance_info.is_test || !instance_info.current_round}
              onClick={nextQuestion}
              className={`${
                instance_info.is_test || !instance_info.current_round
                  ? "bg-slate-400"
                  : "bg-blue-700 hover:bg-blue-800"
              }  text-white font-bold w-56 rounded-sm py-2 transition-all`}
            >
              Nākamais jautājums
              <i className="fa-solid fa-forward ms-2"></i>
            </button>
            <button
              disabled={!instance_info.game_started}
              onClick={nextRound}
              className={`${
                !instance_info.game_started
                  ? "bg-slate-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }  text-white font-bold w-48 rounded-sm py-2 transition-all`}
            >
              Nākamā kārta
              <i className="fa-solid fa-forward-fast ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
