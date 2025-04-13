import { useBuzzer } from "../../../universal/BuzzerContext";

export const Buzzer = () => {
  const { buzzedPlayer } = useBuzzer();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-r from-[#30345f] to-[#533266] justify-center">
      <div className="place-self-center grow  w-full flex place-items-center justify-center">
        {buzzedPlayer.title && (
          <p
            key={buzzedPlayer.id}
            className="flash-animation font-bold text-[16rem] p-24 rounded-xl"
          >
            {buzzedPlayer.title}
          </p>
        )}
      </div>
    </div>
  );
};
