export const Answer = ({
  answer,
  index,
  onInput,
  onChecked,
  onDelete,
}: {
  answer: { prompt: string; isCorrect: boolean };
  index: number;
  onInput: Function;
  onChecked: Function;
  onDelete: Function;
}) => {
  return (
    <div key={index} className="flex flex-col h-full">
      <textarea
        placeholder="Atbildes teksts..."
        className="bg-slate-100 max-w-52 max-h-72 rounded-t-md resize-none p-2 px-4 grow"
        onChange={(e) => onInput(e.target.value)}
        value={answer.prompt}
      />
      <div className="flex">
        <div
          className={` rounded-bl-md grow hover:bg-slate-300 ${
            answer.isCorrect
              ? "bg-[#E63946] hover:bg-[#cc8288]"
              : "bg-slate-200"
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              onChecked(!answer.isCorrect);
            }}
            className="w-full"
          >
            <i
              className={`fa-solid fa-check mx-auto ${
                answer.isCorrect ? "text-white" : "text-black"
              }`}
            ></i>
          </button>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="w-8 rounded-br-md bg-slate-200 hover:bg-slate-300"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
