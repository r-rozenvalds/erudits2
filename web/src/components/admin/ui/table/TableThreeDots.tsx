import { useEffect, useRef, useState } from "react";

interface ITooltip {
  text: string;
  function: () => void;
  hidden?: boolean;
}

interface ITableThreeDotsProps {
  tooltips: ITooltip[];
}

export const TableThreeDots = ({ tooltips }: ITableThreeDotsProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-8 mx-auto">
      <button
        onClick={() => setExpanded(!expanded)}
        className="hover:bg-slate-100 h-8 w-8"
      >
        <i className="fa-solid fa-ellipsis-vertical text-gray-600"></i>
      </button>
      {expanded && (
        <ul className="absolute bg-white shadow-md top-4 right-4 z-10">
          {tooltips.map((tooltip, idx) => {
            if (tooltip.hidden) return;
            return (
              <li
                className="border-slate-200 border-opacity-40 border-b-[1px] last:border-none"
                key={idx.toString()}
              >
                <button
                  onClick={() => {
                    tooltip.function();
                    setExpanded(false);
                  }}
                  className="h-8 px-6 min-w-12 w-full hover:bg-slate-200"
                >
                  {tooltip.text}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
