import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { IGameController } from "../../../universal/AdminPanelContext";

export const RoundTable = ({
  gameController,
}: {
  gameController: IGameController;
}) => {
  const { instance_info, player_answers } = gameController;

  const tableQuestions = useMemo(() => {
    return instance_info?.round_questions ?? [];
  }, [instance_info?.round_questions]);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "player_name",
        header: "Player Name",
      },
      ...tableQuestions.map((question) => ({
        accessorKey: question.id,
        header: () => {
          return (
            <div className="p-2" title={question.title}>
              {question.title.length > 15
                ? question.title.slice(0, 15) + "..."
                : question.title}
            </div>
          );
        },
        cell: ({ getValue }: { getValue: any }) => {
          const answer = getValue();
          if (!answer) return "";
          return (
            <span
              className={answer.is_correct ? "text-green-800" : "text-red-800"}
            >
              {answer.answer?.length > 15
                ? answer.answer.slice(0, 15) + "..."
                : answer.answer ?? "-"}
            </span>
          );
        },
      })),
    ];
  }, [tableQuestions]);

  const data = useMemo(() => {
    return player_answers.map((player) => {
      const playerData: Record<string, any> = {
        player_name: player.player_name,
        round_finished: player.round_finished,
      };
      tableQuestions.forEach((question) => {
        const answerObj = player.questions.find((q) => q.id === question.id);
        playerData[question.id] = answerObj || null;
      });
      return playerData;
    });
  }, [player_answers, tableQuestions]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-scroll w-full h-full">
      <table className="table-auto text-center text-sm w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="bg-slate-300" key={headerGroup.id}>
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
            <tr
              className={` ${
                row.original.round_finished ? "bg-blue-300" : "odd:bg-slate-100"
              }`}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td className="px-2 py-1" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
