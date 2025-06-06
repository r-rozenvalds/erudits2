import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IPagedResult } from "../../stores/interfaces/IPagedResult";
import { PaginationBottom } from "../admin/ui/PaginationBottom";
import { SpinnerCircularFixed } from "spinners-react";

interface ITableProps<D> {
  pagedResult?: IPagedResult<D>;
  columns: any;
  isLoading: boolean;

  fetchPlayers: (page: number) => void;
}

export const Table = <T,>({
  pagedResult,
  columns,
  fetchPlayers,
  isLoading,
}: ITableProps<T>) => {
  const table = useReactTable({
    data: pagedResult?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="h-full w-full relative">
      {isLoading && (
        <div className=" absolute w-full h-full z-10 bg-gray-100  opacity-90">
          <div className="mx-auto mt-10 w-48 flex place-items-center justify-center gap-2 font-bold">
            <SpinnerCircularFixed size={20} color="#E63946" thickness={240} />
            Ielādējas...
          </div>
        </div>
      )}
      <div className="flex flex-col justify-between h-full">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="text-center bg-slate-200" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="p-4" key={header.id}>
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
              <tr className={`odd:bg-slate-100`} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="p-1 px-4 text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationBottom
          current_page={pagedResult?.page ?? 1}
          total_results={pagedResult?.total_items ?? 0}
          limit={pagedResult?.items_per_page ?? 10}
          onPageChange={fetchPlayers}
        />
      </div>
    </div>
  );
};
