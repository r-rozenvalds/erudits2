export const SubmitSaveButton = ({ onSave }: { onSave: any }) => {
  return (
    <div className="flex gap-[2px]">
      <input
        className="h-12 w-48 bg-[#E63946] rounded-s-md shadow-lg text-white text-xl font-bold hover:bg-opacity-70 transition-all hover:cursor-pointer"
        type="submit"
        value="Turpināt"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="h-12 w-12 bg-[#E63946] rounded-e-md shadow-lg text-white text-xl font-bold hover:bg-opacity-70 transition-all hover:cursor-pointer"
      >
        <i className="fa-solid fa-floppy-disk"></i>
      </button>
    </div>
  );
};
