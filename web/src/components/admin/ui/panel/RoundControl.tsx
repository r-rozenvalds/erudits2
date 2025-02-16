import { RoundTable } from "./RoundTable";
import { SpinnerCircularFixed } from "spinners-react";
import { useAdminPanel } from "../../../universal/AdminPanelContext";

export const RoundControl = () => {
  const { info } = useAdminPanel();

  if (!info)
    return (
      <div className="mx-auto mt-10">
        <SpinnerCircularFixed size={40} color="#fff" thickness={180} />
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col place-items-center max-w-5xl">
      <p className="font-semibold mb-1">Kārtas</p>

      <div className="w-full h-84 bg-slate-200 py-2">
        <div className="flex justify-between px-4 gap-4">
          <button
            disabled={!info.started}
            className={`${
              !info.started ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"
            }  text-white font-bold px-4 rounded-md py-2 transition-all`}
          >
            <i className="fa-solid fa-backward-fast me-2"></i>
            Iepriekšējā kārta
          </button>
          <div className="bg-slate-300 flex-col flex place-items-center px-4 rounded-md">
            <p className="text-xs">Atbildējuši</p>
            <p className="font-semibold">
              {info.answered_players}/{info.players}
            </p>
          </div>
          <div className="flex flex-col place-items-center grow">
            <p className="text-xs">Pašreizējā kārta</p>
            <p className="font-semibold">{info.current_round ?? "-"}</p>
          </div>
          <div className="bg-slate-300 flex-col flex place-items-center px-2 rounded-md">
            <p className="text-xs">Atlikušais laiks</p>
            <p className="font-semibold">{info.answer_time ?? "-"}</p>
          </div>
          <button
            disabled={!info.started}
            className={`${
              !info.started ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"
            }  text-white font-bold px-4 rounded-md py-2 transition-all`}
          >
            Nākamā kārta
            <i className="fa-solid fa-forward-fast ms-2"></i>
          </button>
        </div>
      </div>
      <RoundTable />
      <div className="w-full h-84 bg-slate-200 py-2 flex justify-between px-4">
        <button
          disabled={!!!info.current_question}
          className={`${
            !!!info.current_question
              ? "bg-slate-400"
              : "bg-blue-700 hover:bg-blue-800"
          }  text-white font-bold px-4 rounded-md py-2 transition-all`}
        >
          <i className="fa-solid fa-backward me-2"></i>
          Iepriekšējais jautājums
        </button>
        <div className="flex flex-col place-items-center grow">
          <p className="text-xs">Pašreizējais jautājums</p>
          <p className="font-semibold">{info.current_question ?? "-"}</p>
        </div>
        <button
          disabled={!info.started}
          className={`${
            !info.started ? "bg-slate-400" : "bg-blue-700 hover:bg-blue-800"
          }  text-white font-bold px-4 rounded-md py-2 transition-all`}
        >
          Nākamais jautājums
          <i className="fa-solid fa-forward ms-2"></i>
        </button>
      </div>
    </div>
  );
};
