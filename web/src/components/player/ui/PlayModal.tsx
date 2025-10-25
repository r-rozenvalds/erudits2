import { useState } from "react";
import { InputModalBase } from "./InputModalBase";
import { SpinnerCircularFixed } from "spinners-react";

export const PlayModal = ({ onCancel }: { onCancel: () => void }) => {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const setCodeValue = (e: {
    target: {
      value: string;
    };
  }) => {
    if (
      e.target.value === "" ||
      (/^[a-zA-Z0-9]+$/.test(e.target.value) && e.target.value.length <= 6)
    ) {
      setCode(e.target.value.toUpperCase());
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    setIsLoading(false);
  };

  return (
    <InputModalBase
      onCancel={onCancel}
      title="Pievienoties spēlei"
      onSubmit={() => null}
    >
      <div className="flex flex-col gap-1 mt-2">
        <label className="text-sm">Spēles kods</label>
        <input
          onChange={setCodeValue}
          value={code}
          type="text"
          className="w-96 bg-gray-200 outline-none px-2 py-1 text-center text-2xl font-bold"
          placeholder="ABC123"
        ></input>
      </div>
      <button
        disabled={isLoading || isError}
        className="py-1 w-1/3 place-self-center bg-red-500 text-white font-bold mt-4 rounded-md shadow-sm min-h-9"
      >
        {!isLoading && !isError && (
          <i className="fa-solid fa-arrow-right text-xl"></i>
        )}
        {isLoading && (
          <div className="w-5 mx-auto">
            <SpinnerCircularFixed color="fff" thickness={240} size={20} />
          </div>
        )}
        {isError && <i className="fa-solid fa-xmark text-xl"></i>}
      </button>
    </InputModalBase>
  );
};
