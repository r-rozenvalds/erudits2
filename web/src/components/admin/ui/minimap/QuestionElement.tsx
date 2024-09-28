export const QuestionElement = () => {
  const textFormat = (text: string) => {
    if (text.length > 24) {
      return text.slice(0, 24) + "...";
    }
    return text;
  };
  return (
    <div className=" h-full  max-w-80 flex flex-col place-items-center justify-items-center">
      <div
        onClick={() => console.log("clicked")}
        className="bg-slate-200 hover:bg-slate-300 hover:cursor-pointer grow rounded-t-md px-2 flex flex-col"
      >
        <span className="font-medium">
          {textFormat(
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos esse incidunt alias voluptatum!"
          )}
        </span>
        <div className="font-medium text-sm my-auto flex gap-8 place-items-center justify-center">
          <div className="flex gap-2 place-items-center">
            <i className="fa-regular fa-comments"></i>4
          </div>
          <div className="flex gap-2">
            <i className="fa-solid fa-i-cursor"></i>
            <i className="fa-regular fa-circle-xmark"></i>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-evenly bg-slate-200 rounded-b-md place-items-center align-center">
        <div className="grow text-center hover:bg-slate-300">
          <i className="fa-solid fa-chevron-left text-sm"></i>
        </div>
        <div className="grow text-center hover:bg-slate-300">
          <i className="fa-solid fa-chevron-right text-sm"></i>
        </div>
      </div>
    </div>
  );
};
