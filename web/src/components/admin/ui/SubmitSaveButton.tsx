export const SubmitSaveButton = ({
  onSave,
  hideSaveButton = false,
}: {
  onSave?: (e: { preventDefault: () => void }) => void;
  hideSaveButton?: boolean;
}) => {
  return (
    <div className="flex gap-[2px]">
      <input
        className={`h-12  bg-[#E63946] ${
          hideSaveButton ? "rounded-md w-60" : "rounded-s-md w-48"
        } shadow-lg text-white text-xl font-bold hover:bg-opacity-70 transition-all hover:cursor-pointer`}
        type="submit"
        value="Turpināt"
      />
      {!hideSaveButton && (
        <button
          onClick={onSave}
          className="h-12 w-12 bg-[#E63946] rounded-e-md shadow-lg text-white text-xl font-bold hover:bg-opacity-70 transition-all hover:cursor-pointer"
        >
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
      )}
    </div>
  );
};
