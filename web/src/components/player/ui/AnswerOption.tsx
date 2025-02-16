interface AnswerOptionProps {
  setSelectedAnswer: (value: string) => void;
  selectedAnswer: string;
  childNr: number;
  content: string;
  isTest?: boolean;
  answerId: string;
}

export const AnswerOption = ({
  setSelectedAnswer,
  selectedAnswer,
  childNr,
  content,
  isTest,
  answerId,
}: AnswerOptionProps) => {
  if (childNr === 1) {
    return (
      <div
        onClick={() => setSelectedAnswer(answerId)}
        className={`bg-slate-200 group h-full rounded-md hover:bg-white shadow-lg transition-all place-self-end flex place-items-center ${
          !isTest && selectedAnswer ? "w-80 px-0 " : "w-full px-8"
        }`}
      >
        <div
          className={` border-8 min-w-48 min-h-48 max-w-48 max-h-48 rounded-full shadow-lg  group-hover:shadow-none p-4 ${
            selectedAnswer === answerId
              ? `mx-auto border-[#d88098]`
              : `mx-0 group-hover:border-[#d88098] border-white`
          }`}
        >
          <img
            src="/rose.png"
            className={`${
              selectedAnswer === answerId ? "rose" : `group-hover:rose`
            } rounded-full`}
          ></img>
        </div>
        {(isTest ? true : !selectedAnswer) && (
          <p
            className={`text-4xl text-slate-700 font-bold grow ${
              selectedAnswer === answerId
                ? "text-[#d88098]"
                : "group-hover:text-[#d88098]"
            }  drop-shadow-lg`}
          >
            {content}
          </p>
        )}
      </div>
    );
  }

  if (childNr === 2) {
    return (
      <div
        onClick={() => setSelectedAnswer(answerId)}
        className={`bg-slate-200 group h-full rounded-md hover:bg-white shadow-lg transition-all place-self-start flex place-items-center ${
          !isTest && selectedAnswer ? "w-80 px-0 " : "w-full px-8"
        }`}
      >
        {(isTest ? true : !selectedAnswer) && (
          <p
            className={`text-4xl text-slate-700 font-bold ${
              selectedAnswer === answerId
                ? "text-[#f3d75b]"
                : "group-hover:text-[#f3d75b]"
            } drop-shadow-lg grow`}
          >
            {content}
          </p>
        )}
        <div
          className={` border-8 min-w-48 min-h-48 max-w-48 max-h-48 rounded-full shadow-lg  group-hover:shadow-none p-4 ${
            selectedAnswer === answerId
              ? `mx-auto border-[#f3d75b]`
              : `mx-0 group-hover:border-[#f3d75b] border-white`
          }`}
        >
          <img
            src="/sunflower.png"
            className={`${
              selectedAnswer === answerId
                ? "sunflower"
                : `group-hover:sunflower`
            } rounded-full`}
          ></img>
        </div>
      </div>
    );
  }

  if (childNr === 3) {
    return (
      <div
        onClick={() => setSelectedAnswer(answerId)}
        className={`bg-slate-200 group h-full rounded-md hover:bg-white shadow-lg transition-all place-self-end flex place-items-center ${
          !isTest && selectedAnswer ? "w-80 px-0 " : "w-full px-8"
        }`}
      >
        <div
          className={` border-8 min-w-48 min-h-48 max-w-48 max-h-48 rounded-full shadow-lg  group-hover:shadow-none p-4 ${
            selectedAnswer === answerId
              ? `mx-auto border-[#1982c4]`
              : `mx-0 group-hover:border-[#1982c4] border-white`
          }`}
        >
          <img
            src="/gerbera.png"
            className={`${
              selectedAnswer === answerId ? "gerbera" : `group-hover:gerbera`
            } rounded-full`}
          ></img>
        </div>
        {(isTest ? true : !selectedAnswer) && (
          <p
            className={`text-4xl text-slate-700 font-bold grow ${
              selectedAnswer === answerId
                ? "text-[#1982c4]"
                : "group-hover:text-[#1982c4]"
            } drop-shadow-lg`}
          >
            {content}
          </p>
        )}
      </div>
    );
  }

  if (childNr === 4) {
    return (
      <div
        onClick={() => setSelectedAnswer(answerId)}
        className={`bg-slate-200 group h-full rounded-md hover:bg-white shadow-lg transition-all place-self-start flex place-items-center ${
          !isTest && selectedAnswer ? "w-80 px-0 " : "w-full px-8"
        }`}
      >
        {(isTest ? true : selectedAnswer) && (
          <p
            className={`text-4xl text-slate-700 font-bold grow ${
              selectedAnswer === answerId
                ? "text-[#8ac926]"
                : "group-hover:text-[#8ac926]"
            } drop-shadow-lg`}
          >
            {content}
          </p>
        )}
        <div
          className={` border-8 min-w-48 min-h-48 max-w-48 max-h-48 rounded-full shadow-lg  group-hover:shadow-none p-4 ${
            selectedAnswer === answerId
              ? `mx-auto border-[#8ac926]`
              : `mx-0 group-hover:border-[#8ac926] border-white`
          }`}
        >
          <img
            src="/gerbera.png" // change to orchid
            className={`${
              selectedAnswer === answerId ? "orchid" : `group-hover:orchid`
            } rounded-full`}
          ></img>
        </div>
      </div>
    );
  }
};
