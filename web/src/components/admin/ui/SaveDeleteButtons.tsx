import { SpinnerCircularFixed } from "spinners-react";

export const SaveDeleteButtons = ({
  onDelete,
  onSave,
  showSpinner = false,
  showNavigationButtons = false,
}: {
  onDelete?: (e: { preventDefault: () => void }) => void;
  onSave?: (e: { preventDefault: () => void }) => void;
  showSpinner?: boolean;
  showNavigationButtons?: boolean;
}) => {
  return showSpinner ? (
    <div className="h-12 bg-slate-300 w-60 rounded-md transition-all shadow-lg ">
      <div className="flex justify-center place-items-center w-full h-full">
        <SpinnerCircularFixed color="#ffffff" size={35} thickness={180} />
      </div>
    </div>
  ) : (
    <div className="flex justify-between">
      <button
        onClick={onDelete}
        className={`h-12  bg-[#E63946] rounded-md px-8
          shadow-lg text-white text-xl font-bold hover:bg-opacity-70 transition-all hover:cursor-pointer`}
      >
        <i className="fa-solid fa-trash-can me-2"></i>
        Dzēst
      </button>
      <div className="flex gap-[2px]">
        {showNavigationButtons && (
          <button
            onClick={onSave}
            className={`h-12  bg-[#E63946] rounded-md w-12
          shadow-lg text-white text-xl font-bold hover:bg-opacity-70 transition-all hover:cursor-pointer`}
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
        )}
        <button
          onClick={onSave}
          className={`h-12  bg-[#E63946] rounded-md w-60
          shadow-lg text-white text-xl font-bold hover:bg-opacity-70 transition-all hover:cursor-pointer`}
        >
          <i className="fa-solid fa-floppy-disk me-2"></i>
          Saglabāt
        </button>
        {showNavigationButtons && (
          <button
            onClick={onSave}
            className={`h-12  bg-[#E63946] rounded-md w-12
          shadow-lg text-white text-xl font-bold hover:bg-opacity-70 transition-all hover:cursor-pointer`}
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};
