export const RoundElement = () => {
  return (
    <div className="bg-slate-200 hover:bg-slate-300 hover:cursor-pointer h-full rounded-md px-4 flex flex-col place-items-center justify-items-center">
      <span className="font-medium whitespace-nowrap">
        Vēl viens garš kārtas nosaukums
      </span>
      <div className="font-medium text-sm my-auto flex gap-2">
        <i className="fa-regular fa-circle-question text-sm"></i>6
      </div>
    </div>
  );
};
