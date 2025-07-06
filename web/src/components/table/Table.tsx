import {
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { IPagedResult } from "../../stores/interfaces/IPagedResult";
import { PaginationBottom } from "../admin/ui/PaginationBottom";
import { SpinnerCircularFixed } from "spinners-react";
import { useState } from "react";

interface ITableProps<D> {
  rowClassName?: string;
  headerClassName?: string;
  tableClassName?: string;
  paginateClassName?: string;

  pagedResult?: IPagedResult<D>;
  columns: any;
  isLoading: boolean;
  onSort?: OnChangeFn<SortingState>;
  sorting?: SortingState;

  fetch: (page: number) => void;
  onRowClick?: (row: D) => void;
}

export const Table = <T,>({
  paginateClassName,
  rowClassName,
  headerClassName,
  pagedResult,
  columns,
  fetch,
  onRowClick,
  onSort,
  sorting,
  isLoading,
}: ITableProps<T>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useReactTable({
    data: pagedResult?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: onSort,
    manualSorting: true,
    state: {
      rowSelection,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
    enableSortingRemoval: false,
  });

  return (
    <div className="flex flex-col h-full w-full relative">
      {isLoading && (
        <div className="absolute w-full h-full z-10 bg-gray-100 opacity-90">
          <div className="mx-auto mt-10 w-48 flex place-items-center justify-center gap-2 font-bold">
            <SpinnerCircularFixed size={20} color="#E63946" thickness={240} />
            Ielādējas...
          </div>
        </div>
      )}
      <div className="flex-1 bg-white">
        <table className="w-full overflow-y-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="text-center bg-slate-200" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={`${headerClassName ?? "p-4"} ${
                      header.column.getCanSort() &&
                      "cursor-pointer select-none hover:text-gray-600"
                    }`}
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <i className="fa-solid fa-caret-up ms-2"></i>,
                      desc: <i className="fa-solid fa-caret-down ms-2"></i>,
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                onClick={() => {
                  setRowSelection({ [row.id]: true });
                  onRowClick?.(row.original);
                }}
                className={`${
                  rowSelection[row.id]
                    ? "bg-slate-300 hover:bg-slate-300"
                    : "hover:bg-slate-100"
                } ${rowClassName ?? "odd:bg-slate-100"}`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className={`p-1 px-4 text-center`} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationBottom
        className={paginateClassName}
        currentPage={pagedResult?.page ?? 1}
        totalResults={pagedResult?.total_items ?? 0}
        limit={pagedResult?.items_per_page ?? 10}
        onPageChange={fetch}
      />
    </div>
  );
};
