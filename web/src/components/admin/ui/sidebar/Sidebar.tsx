export const Sidebar = () => {
  const fetchRoundsAndQuestions = () => {};

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          <button className="bg-slate-200 font-semibold w-10 h-10 rounded-md hover:bg-slate-100">
            <i className="fa-solid fa-caret-down"></i>
          </button>
          <button className="bg-slate-200 font-semibold grow h-10 rounded-md hover:bg-slate-100">
            1. kārta
          </button>
        </div>
        <button className="bg-slate-200 w-full h-8 rounded-md p-1 hover:bg-slate-100">
          1. jautājums
        </button>
        <button className="bg-slate-200 w-full h-8 rounded-md p-1 hover:bg-slate-100">
          1. jautājums
        </button>
        <button className="bg-slate-200 w-full h-8 rounded-md p-1 hover:bg-slate-100">
          1. jautājums
        </button>
      </div>
    </div>
  );
};
