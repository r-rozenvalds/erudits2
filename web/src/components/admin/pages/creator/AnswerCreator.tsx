import { FormEvent, useEffect, useState } from "react";
import { Answer } from "../../ui/Answer";
import { constants } from "../../../../constants";
import { AnswerType } from "../../../universal/AnswerType";
import { useConfirmation } from "../../../universal/ConfirmationWindowContext";
import { SaveDeleteButtons } from "../../ui/SaveDeleteButtons";
import { gameStore } from "../../../../stores/GameStore";
import { IQuestion } from "../../../../stores/interfaces/creator/IQuestion";
import { IAnswer } from "../../../../stores/interfaces/creator/IAnswer";

interface IAnswerCreator {
  answer: IAnswer;
  index: string;
  setAnswer: (answer: IAnswer) => void;
}

export const AnswerCreator = ({ answer, index, setAnswer }: IAnswerCreator) => {
  return (
    <div key={index} className="flex flex-col h-full">
      <textarea
        placeholder="Atbildes teksts..."
        className="bg-slate-100 max-w-52 max-h-72 rounded-t-md resize-none p-2 px-4 grow"
        onChange={(e) => onInput(e.target.value)}
        value={answer.text}
      />
      <div className="flex">
        <div
          className={` rounded-bl-md grow hover:bg-slate-300 ${
            answer.is_correct
              ? "bg-[#E63946] hover:bg-[#cc8288]"
              : "bg-slate-200"
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              onChecked(!answer.is_correct);
            }}
            className="w-full"
          >
            <i
              className={`fa-solid fa-check mx-auto ${
                answer.is_correct ? "text-white" : "text-black"
              }`}
            ></i>
          </button>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="w-8 rounded-br-md bg-slate-200 hover:bg-slate-300"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
