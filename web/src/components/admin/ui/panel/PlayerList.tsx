import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { constants } from "../../../../constants";
import { useConfirmation } from "../../../universal/ConfirmationWindowContext";

type Player = {
  id: number;
  player_name: string;
  points: number;
  is_disqualified: boolean;
};
export const PlayerList = ({ gameId }: { gameId: string }) => {
  const [sorting, setSorting] = useState([
    { id: "is_disqualified", desc: false },
  ]);

  const [players, setPlayers] = useState<Player[]>([]);

  const fetchPlayers = async () => {
    const response = await fetch(`${constants.baseApiUrl}/players/${gameId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setPlayers(data.players);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const confirm = useConfirmation();

  const disqualifyPlayer = async (player: Player) => {
    if (
      await confirm(
        `Vai tiešām vēlaties diskvalificēt spēlētāju ${player.player_name}?`
      )
    ) {
      const response = await fetch(
        `${constants.baseApiUrl}/disqualify-player`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(
              constants.sessionStorage.TOKEN
            )}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player_id: player.id,
          }),
        }
      );

      if (response.ok) {
        fetchPlayers();
      }
    }
  };

  const requalifyPlayer = async (player: Player) => {
    if (
      await confirm(
        `Vai tiešām vēlaties kvalificēt spēlētāju ${player.player_name}?`
      )
    ) {
      const response = await fetch(`${constants.baseApiUrl}/requalify-player`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            constants.sessionStorage.TOKEN
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_id: player.id,
        }),
      });

      if (response.ok) {
        fetchPlayers();
      }
    }
  };

  const columnHelper = createColumnHelper<Player>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: "Pozīcija",
        cell: (info) => {
          const sortedRowIndex = table
            .getRowModel()
            .rows.findIndex((row) => row.id === info.row.id);
          return sortedRowIndex + 1;
        },
      }),
      columnHelper.accessor("player_name", {
        header: "Nosaukums",
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
      columnHelper.accessor("points", {
        header: "Punkti",
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
      columnHelper.accessor("is_disqualified", {
        header: "Statuss",
        sortingFn: (rowA, rowB, columnId) => {
          const aIsDisqualified = rowA.getValue(columnId);
          const bIsDisqualified = rowB.getValue(columnId);

          // Group qualified players first
          if (aIsDisqualified !== bIsDisqualified) {
            return aIsDisqualified ? 1 : -1; // `false` (qualified) before `true` (disqualified)
          }

          // If both are in the same group, sort by points descending
          const aPoints: number = rowA.getValue("points");
          const bPoints: number = rowB.getValue("points");
          return bPoints - aPoints; // Higher points first
        },
        cell: (info) => {
          return (
            <div
              className={`rounded-full w-4 h-4 mx-auto ${
                info.getValue() ? "bg-red-500" : "bg-emerald-500"
              }`}
            ></div>
          );
        },
      }),
      columnHelper.display({
        header: "Darbības",
        enableSorting: false,
        cell: (info) => {
          if (info.row.original.is_disqualified) {
            return (
              <button
                className="h-6 rounded-md w-full bg-green-500 text-white text-sm font-bold"
                onClick={() => requalifyPlayer(info.row.original)}
              >
                Kvalific.
              </button>
            );
          }
          return (
            <button
              className="h-6 rounded-md w-full bg-red-500 text-white text-sm font-bold"
              onClick={() => disqualifyPlayer(info.row.original)}
            >
              Diskv.
            </button>
          );
        },
      }),
    ],
    [columnHelper, requalifyPlayer, disqualifyPlayer]
  );

  const table = useReactTable({
    data: players,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="text-center bg-slate-200" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="p-2 px-4" key={header.id}>
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
                row.original.is_disqualified
                  ? "bg-red-100 odd:bg-red-200"
                  : "bg-slate-50 odd:bg-slate-100"
              }`}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td className="p-1 px-4 text-center" key={cell.id}>
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
