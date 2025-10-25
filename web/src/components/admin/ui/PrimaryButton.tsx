import { SpinnerCircularFixed } from "spinners-react";

interface IButtonProps {
  text: string;
  isLoading?: boolean;
  onClick: () => void;
}

export const PrimaryButton = ({ text, isLoading, onClick }: IButtonProps) => {
  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={` text-white font-semibold h-10 px-6 min-w-32 rounded-md ${
        isLoading ? "bg-[#ec505d]" : "hover:bg-opacity-80 bg-[#E63946]"
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
