import { ReactNode } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

interface IBasicModal {
  title: string;
  children: ReactNode;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const BasicModal = ({
  title,
  children,
  isLoading,
  onCancel,
  onConfirm,
}: IBasicModal) => {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-opacity-50 bg-slate-900 z-40 flex items-center justify-center">
      <div className="bg-white rounded-md p-2 flex flex-col gap-4">
        <div className="flex justify-between place-items-center">
          <p>{title}</p>
          <button onClick={onCancel} className="px-1">
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        </div>
        <div className="w-full h-full">{children}</div>
        <div className="flex gap-2 justify-between">
          <SecondaryButton
            text="Atcelt"
            onClick={onCancel}
            isLoading={isLoading}
          />
          <PrimaryButton
            text="Saglabāt"
            onClick={onConfirm}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
