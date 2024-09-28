import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { QuestionElement } from "./QuestionElement";

export const QuestionMinimap = () => {
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  return (
    <div className="bg-slate-100 p-2 gap-2 flex flex-col font-[Manrope] rounded-md">
      <span className="font-bold text-lg">Pirmā kārta</span>
      <div
        {...events}
        ref={ref}
        className="flex grow rounded-md place-items-center h-24 overflow-x-auto no-scrollbar select-none"
      >
        <QuestionElement />
        <i className="fa-solid fa-chevron-right text-lg px-4"></i>
        <QuestionElement />
      </div>
    </div>
  );
};
