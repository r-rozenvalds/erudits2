import { SpinnerCircularFixed } from "spinners-react";

interface IButtonProps {
  text: string;
  isLoading?: boolean;
  onClick: () => void;
}

export const SecondaryButton = ({ text, isLoading, onClick }: IButtonProps) => {
  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={` text-[#E63946] font-semibold h-10 px-6 min-w-32 rounded-md border-2 ${
        isLoading
          ? "border-[#ec505d]"
          : "hover:border-opacity-80 border-[#E63946]"
      } transition-all`}
    >
      {isLoading ? (
        <div className="mx-auto w-5">
          <SpinnerCircularFixed color="#fff" thickness={220} size={20} />
        </div>
      ) : (
        text.toUpperCase()
      )}
    </button>
  );
};
