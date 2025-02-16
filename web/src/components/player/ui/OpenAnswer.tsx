export const OpenAnswer = ({
  guidelines,
  selectedAnswer,
  setSelectedAnswer,
}: {
  guidelines: string;
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
}) => {
  return (
    <div className="flex flex-col place-items-center justify-center gap-4">
      <p className="text-white text-2xl font-semibold">{guidelines}</p>
      <input
        value={selectedAnswer}
        onChange={(e) => setSelectedAnswer(e.target.value)}
        type="text"
        className="text-4xl text-black px-4 py-2 rounded-md shadow-lg bg-white min-w-[48rem] h-[4rem] text-center"
        placeholder="Ievadiet savu atbildi šeit!"
      />
    </div>
  );
};
