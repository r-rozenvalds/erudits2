import { useState } from "react";
import { IQuestion } from "../../../../../stores/interfaces/creator/IQuestion";

interface ISidebarQuestion {
  onClick: () => void;
  question: IQuestion;
  isSelected?: boolean;
}

export const SidebarQuestion = ({
  onClick,
  question,
  isSelected,
}: ISidebarQuestion) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex justify-between place-items-center relative"
    >
      <button
        onClick={onClick}
        className={`hover:underline ${
          isSelected && "font-bold"
        } inline-block truncate text-start`}
      >
        {question.order}. {question.title}
      </button>
      {isHovering && (
        <div className="inline-block px-1 text-slate-500 text-center absolute right-0 bg-slate-100">
          <button className="px-2 hover:text-slate-800">
            <i className="fa-solid fa-caret-up"></i>
          </button>
          <button className="px-2 hover:text-slate-800">
            <i className="fa-solid fa-caret-down"></i>
          </button>
          <button className="px-2 hover:text-red-500">
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      )}
    </div>
  );
};
