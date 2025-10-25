import { ReactNode, useState } from "react";

interface ISidebarRound {
  title: string;
  children?: ReactNode;
  isSelected?: boolean;

  onClick: () => void;
}

export const SidebarRound = ({
  title,
  children,
  isSelected,
  onClick,
}: ISidebarRound) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="w-full h-full bg-slate-100 flex flex-col p-2 rounded-sm gap-2 relative"
    >
      <div className="flex gap-4 place-items-center text-lg">
        <hr className="border-slate-500 grow" />
        <div>
          <button
            onClick={onClick}
            className={`hover:underline truncate ${isSelected && "font-bold"}`}
          >
            {title}
          </button>
          <button
            className="px-2 text-slate-600  hover:text-slate-800 "
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <i
              className={`fa-solid ${isCollapsed ? "fa-plus" : "fa-minus"}`}
            ></i>
          </button>
        </div>
        <hr className="border-slate-500 grow" />
        {isHovering && (
          <div className="inline-block px-2 text-slate-500 text-center absolute right-0 bg-slate-100">
            <button className="px-2 hover:text-slate-800">
              <i className="fa-solid fa-caret-up"></i>
            </button>
            <button className="px-2 hover:text-slate-800">
              <i className="fa-solid fa-caret-down"></i>
            </button>
          </div>
        )}
      </div>
      {!isCollapsed && children}
    </div>
  );
};
