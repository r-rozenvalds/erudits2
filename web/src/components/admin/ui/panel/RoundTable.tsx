// import { useAdminPanel } from "../../../universal/AdminPanelContext";

// export const RoundTable = () => {
//   const { info, answers } = useAdminPanel();

//   if (!info?.current_round) {
//     return (
//       <div className="w-full bg-slate-100 h-96 flex place-items-center justify-center">
//         <p className="text-2xl text-slate-700 font-semibold">Nav sākta kārta</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-slate-100 grow overflow-scroll min-h-[24rem] max-h-[24rem]">
//       <div className="flex">
//         <div className="min-w-48 py-2 text-center bg-slate-300">
//           Spēlētāji/Jautājumi
//         </div>
//         {info.round_questions.map((question, index) => (
//           <div
//             key={index}
//             className={`py-2 min-w-48 text-center ${
//               info.current_question === question.id
//                 ? "bg-slate-700 text-white"
//                 : "bg-slate-300"
//             }`}
//           >
//             {question.title.slice(0, 20) + "..."}
//           </div>
//         ))}
//       </div>
//       <div className="flex flex-col">
//         {answers.map((player, index) => (
//           <div key={index} className="flex">
//             <div className="py-2 w-48 bg-slate-300 text-center">
//               {player.player_name.slice(0, 20)}
//               {player.player_name.length > 20 ? "..." : ""}
//             </div>
//             {player.questions.map((answer, index) => (
//               <div
//                 key={index}
//                 className={`py-2 w-48 text-center ${
//                   answer.is_correct === 1
//                     ? `${
//                         info.current_question === answer.id
//                           ? "bg-emerald-700 text-white"
//                           : "bg-emerald-200 odd:bg-emerald-100"
//                       }`
//                     : `${
//                         info.current_question === answer.id
//                           ? "bg-red-700 text-white"
//                           : "bg-red-200 odd:bg-red-100"
//                       }`
//                 }`}
//               >
//                 {answer.answer.slice(0, 20)}
//                 {answer.answer.length > 20 ? "..." : ""}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

import { useMemo } from "react";
import { useAdminPanel } from "../../../universal/AdminPanelContext";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export const RoundTable = () => {
  const { info, answers } = useAdminPanel();

  // Extract unique questions dynamically
  const questions = useMemo(() => {
    const allQuestions = answers.flatMap((player) => player.questions);
    const uniqueQuestions = Array.from(
      new Map(allQuestions.map((q) => [q.id, q])).values()
    );
    return uniqueQuestions;
  }, [answers]);

  // Define columns
  const columns = useMemo(() => {
    return [
      {
        accessorKey: "player_name",
        header: "Player Name",
      },
      ...questions.map((question) => ({
        accessorKey: question.id,
        header: question.title,
        cell: ({ getValue }: { getValue: any }) => {
          const answer = getValue();
          if (!answer) return "";
          return (
            <span className={answer.is_correct ? "correct" : "incorrect"}>
              {answer.answer}
            </span>
          );
        },
      })),
    ];
  }, [questions]);

  const data = useMemo(() => {
    return answers.map((player) => {
      const playerData: Record<string, any> = {
        player_name: player.player_name,
      };
      questions.forEach((question) => {
        const answerObj = player.questions.find((q) => q.id === question.id);
        playerData[question.id] = answerObj || null;
      });
      return playerData;
    });
  }, [answers, questions]);

  // Initialize table
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="question-answer-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
