interface AnswerOptionProps {
  setSelectedAnswer: (value: string) => void;
  selectedAnswer: string;
  childNr: number;
  content: string;
  isTest?: boolean;
  answerId: string;
}

const childData: Record<
  number,
  {
    colorClass: string;
    borderClass: string;
    flowerClass: string;
    img: string;
    alignment: string;
  }
> = {
  1: {
    colorClass: "text-[#d88098]",
    borderClass: "border-[#d88098]",
    flowerClass: "rose",
    img: "rose.png",
    alignment: "place-self-end",
  },
  2: {
    colorClass: "text-[#f3d75b]",
    borderClass: "border-[#f3d75b]",
    flowerClass: "sunflower",
    img: "sunflower.png",
    alignment: "place-self-start",
  },
  3: {
    colorClass: "text-[#1982c4]",
    borderClass: "border-[#1982c4]",
    flowerClass: "gerbera",
    img: "gerbera.png",
    alignment: "place-self-end",
  },
  4: {
    colorClass: "text-[#8ac926]",
    borderClass: "border-[#8ac926]",
    flowerClass: "orchid",
    img: "orchid.png",
    alignment: "place-self-start",
  },
};

export const AnswerOption = ({
  setSelectedAnswer,
  selectedAnswer,
  childNr,
  content,
  isTest,
  answerId,
}: AnswerOptionProps) => {
  const child = childData[childNr];

  if (!child) return null; // Handle unexpected values gracefully

  return (
    <div
      onClick={() => setSelectedAnswer(answerId)}
      className={`bg-slate-200 group h-full rounded-md hover:bg-white shadow-lg transition-all flex place-items-center ${
        child.alignment
      } ${!isTest && selectedAnswer ? "w-80 px-0" : "w-full px-8"}`}
    >
      {[2, 4].includes(childNr) && (isTest || !selectedAnswer) && (
        <p
          className={`text-4xl text-slate-700 font-bold grow drop-shadow-lg ${
            selectedAnswer === answerId
              ? child.flowerClass
              : `group-hover:${child.flowerClass}`
          }`}
        >
          {content}
        </p>
      )}

      <div
        className={`border-8 min-w-48 min-h-48 max-w-48 max-h-48 rounded-full shadow-lg group-hover:shadow-none p-4 ${
          selectedAnswer === answerId
            ? `mx-auto ${child.borderClass}`
            : `mx-0 group-hover:${child.borderClass} border-white`
        }`}
      >
        <img
          src={`/${child.img}`}
          className={`rounded-full ${
            selectedAnswer === answerId
              ? child.flowerClass
              : `group-hover:${child.flowerClass}`
          }`}
        />
      </div>

      {/* Text on right for childNr 1 & 3 */}
      {[1, 3].includes(childNr) && (isTest || !selectedAnswer) && (
        <p
          className={`text-4xl text-slate-700 font-bold grow drop-shadow-lg ${
            selectedAnswer === answerId
              ? child.flowerClass
              : `group-hover:${child.flowerClass}`
          }`}
        >
          {content}
        </p>
      )}
    </div>
  );
};
