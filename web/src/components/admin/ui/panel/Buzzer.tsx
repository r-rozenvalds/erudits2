import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useBuzzer } from "../../../universal/BuzzerContext";

export const Buzzer = () => {
  const [hideTable, setHideTable] = useState(true);

  const { buzzedPlayer, buzzerHistory } = useBuzzer();

  // Define columns with proper typing
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "buzzed_at",
        header: "Buzzed at",
      },
    ],
    []
  );

  // Initialize TanStack Table
  const table = useReactTable({
    data: buzzerHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-r from-[#30345f] to-[#533266] justify-center">
      <div className="place-self-center grow  w-full flex place-items-center justify-center">
        {buzzedPlayer && (
          <p
            key={buzzedPlayer}
            className="flash-animation font-bold text-[16rem] p-24 rounded-xl"
          >
            {buzzedPlayer}
          </p>
        )}
      </div>

      {buzzerHistory.length > 0 && (
        <button
          onClick={() => setHideTable(!hideTable)}
          className="text-white font-semibold py-2 px-4 bg-black bg-opacity-50"
        >
          Toggle table
        </button>
      )}
      {!hideTable && (
        <table className="border-collapse border border-gray-500 min-h-[12rem] max-h-[12rem]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-500 px-4 py-2"
                  >
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
                  <td
                    key={cell.id}
                    className="border border-gray-500 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
