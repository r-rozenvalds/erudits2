import { useState } from "react";

export const OpenAnswer = ({
  guidelines,
  selectedAnswer,
  setSelectedAnswer,
  showSubmitButton,
  onSubmit,
}: {
  guidelines: string;
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
  showSubmitButton?: boolean;
  onSubmit: () => void;
}) => {
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    setError(false);
    if (selectedAnswer.length < 1) {
      setError(true);
      return;
    }
    onSubmit();
  };

  return (
    <div className="flex flex-col place-items-center justify-center gap-4 mx-auto">
      <p className="text-white text-2xl font-semibold">{guidelines}</p>
      <div>
        <div className="flex gap-4">
          <input
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            type="text"
            className={`text-4xl ${
              error && "border-2 border-red-600"
            } text-black px-4 py-2 rounded-md shadow-lg bg-white min-w-[48rem] h-[4rem] text-center`}
            placeholder="Ievadiet savu atbildi šeit!"
          />

          {showSubmitButton && (
            <button
              onClick={handleSubmit}
              className="px-4 bg-gradient-to-r from-[#30345f] to-[#533266] font-bold text-xl rounded-md hover:brightness-125 transition-all"
            >
              Iesniegt
              <i className="fa-solid fa-arrow-right ms-2"></i>
            </button>
          )}
        </div>
        <p className="text-red-600 font-semibold text-lg mt-2">
          {error ? "Lūdzu, ievadiet atbildi!" : " "}
        </p>
      </div>
    </div>
  );
};
