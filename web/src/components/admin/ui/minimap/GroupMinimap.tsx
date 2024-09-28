import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";

export const GroupMinimap = () => {
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);
  return (
    <div
      {...events}
      ref={ref}
      className="bg-slate-100 flex font-[Manrope] grow rounded-md place-items-center max-h-12 overflow-x-auto no-scrollbar select-none"
    >
      <div className="bg-slate-200 h-full rounded-md px-4 flex place-items-center justify-items-center">
        <span className="font-medium text-lg my-auto">Sākums</span>
      </div>
      <i className="fa-solid fa-chevron-right text-lg px-4"></i>
      <div
        onClick={() => console.log("clicked")}
        className="bg-slate-200 hover:bg-slate-300 hover:cursor-pointer h-full rounded-md px-4 flex flex-col place-items-center justify-items-center"
      >
        <span className="font-medium whitespace-nowrap">
          Garāks kārtas nosaukums
        </span>
        <div className="font-medium text-sm my-auto flex gap-2">
          <i className="fa-regular fa-circle-question text-sm"></i>6
        </div>
      </div>
      <i className="fa-solid fa-chevron-right text-lg px-4"></i>
      <div className="bg-slate-200 hover:bg-slate-300 hover:cursor-pointer h-full rounded-md px-4 flex flex-col place-items-center justify-items-center">
        <span className="font-medium whitespace-nowrap">
          Vēl viens garš kārtas nosaukums
        </span>
        <div className="font-medium text-sm my-auto flex gap-2">
          <i className="fa-regular fa-circle-question text-sm"></i>6
        </div>
      </div>
      <i className="fa-solid fa-chevron-right text-lg px-4"></i>
      <div className="bg-slate-200 h-full rounded-md px-4 flex place-items-center justify-items-center">
        <span className="font-medium text-lg my-auto">Beigas</span>
      </div>
    </div>
  );
};
