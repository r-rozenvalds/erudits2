import { useEffect, useRef, useState } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { RoundElement } from "./RoundElement";
import { constants } from "../../../../constants";
import { useParams } from "react-router-dom";

interface Round {
  id: string;
  title: string;
  question_amount: string;
}

export const GroupMinimap = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  const { gameId } = useParams();

  // const getRounds = async () => {
  //   await fetch(`${constants.baseApiUrl}/gamerounds/${gameId}`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${sessionStorage.getItem(
  //         constants.sessionStorage.TOKEN
  //       )}`,
  //     },
  //   })
  //     .then(async (response) => {
  //       const data = await response.json();
  //       if (response.ok) {
  //         console.log(data);
  //         setRounds(data.rounds);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // useEffect(() => {
  //   getRounds();
  // }, []);

  return (
    <div
      {...events}
      ref={ref}
      className="bg-slate-100 flex font-[Manrope] grow rounded-md place-items-center max-h-12 overflow-x-auto no-scrollbar select-none"
    >
      <div className="bg-slate-200 h-full rounded-md px-4 flex place-items-center justify-items-center">
        <span className="font-medium text-lg my-auto">Sākums</span>
      </div>
      <i className="fa-solid fa-chevron-right text-lg px-4"></i>
      <RoundElement />
      <i className="fa-solid fa-chevron-right text-lg px-4"></i>
      <div className="bg-slate-200 h-full rounded-md px-4 flex place-items-center justify-items-center">
        <span className="font-medium text-lg my-auto">Beigas</span>
      </div>
    </div>
  );
};
