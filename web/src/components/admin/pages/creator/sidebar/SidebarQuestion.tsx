import { useState } from "react";
import { IQuestion } from "../../../../../stores/interfaces/creator/IQuestion";

export const SidebarQuestion = (question: IQuestion) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex justify-between place-items-center"
    >
      <button
        className={`hover:underline inline-block truncate text-start ${
          isHovering ? "w-2/3" : "w-full"
        }`}
      >
        {question.order}. {question.title}
      </button>
      {isHovering && (
        <div className="inline-block px-2 text-slate-500 text-center">
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
