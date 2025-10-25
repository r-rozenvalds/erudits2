import { ReactNode, useEffect, useRef } from "react";

export const InputModalBase = ({
  title,
  onCancel,
  onSubmit,
  children,
}: {
  title: string;
  onCancel: () => void;
  onSubmit: () => void;
  children: ReactNode;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen w-screen glass-effect absolute flex-col flex place-items-center justify-center shadow-lg">
      <div ref={dropdownRef} className="bg-white p-4 rounded-md">
        <div className="flex justify-between place-items-center">
          <p className="font-bold">{title}</p>
          <button onClick={onCancel} className="px-1">
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col">
          {children}
        </form>
      </div>
    </div>
  );
};
