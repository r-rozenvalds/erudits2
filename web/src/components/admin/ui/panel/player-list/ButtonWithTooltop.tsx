import { useState } from "react";

interface IButtonWithTooltipProps {
  onClick: () => void;
  icon: string;
  color: string;
  tooltip: string;
}

export const ButtonWithTooltip = ({
  onClick,
  icon,
  color,
  tooltip,
}: IButtonWithTooltipProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`w-12 py-1 hover:bg-opacity-85 text-white rounded-sm`}
        style={{ backgroundColor: color }}
      >
        <i className={`fa-solid ${icon}`}></i>
      </button>
      {isHovering && (
        <div className="absolute w-auto h-8 top-0 left-14 flex place-items-center z-30">
          <div
            style={{ borderRightColor: color }}
            className="border-t-4 border-b-4 border-b-transparent border-t-transparent border-r-4"
          ></div>
          <span
            style={{ backgroundColor: color }}
            className="py-1 px-2 text-center select-none text-white font-semibold whitespace-nowrap"
          >
            {tooltip}
          </span>
        </div>
      )}
    </div>
  );
};
