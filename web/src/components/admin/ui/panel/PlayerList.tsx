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
import { IPlayer } from "../../interface/IPlayer";
import { SpinnerCircularFixed } from "spinners-react";
import { useAdminPanel } from "../../../universal/AdminPanelContext";

export const PlayerList = () => {
  const [sorting, setSorting] = useState([
    { id: "is_disqualified", desc: false },
  ]);

  const [fetchDisabled, setFetchDisabled] = useState(false);
  const [pointsDisabled, setPointsDisabled] = useState(false);

  const { fetchPlayers, players, setPlayers } = useAdminPanel();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const confirm = useConfirmation();

  const disqualifyPlayer = async (player: IPlayer) => {
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
            Authorization: `Bearer ${localStorage.getItem(
              constants.localStorage.TOKEN
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

  const deletePlayer = async (player: IPlayer) => {
    if (
      await confirm(
        `Vai tiešām vēlaties dzēst spēlētāju ${player.player_name}?`
      )
    ) {
      const response = await fetch(
        `${constants.baseApiUrl}/players/${player.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              constants.localStorage.TOKEN
            )}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchPlayers();
      }
    }
  };

  const requalifyPlayer = async (player: IPlayer) => {
    if (
      await confirm(
        `Vai tiešām vēlaties kvalificēt spēlētāju ${player.player_name}?`
      )
    ) {
      const response = await fetch(`${constants.baseApiUrl}/requalify-player`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
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

  const adjustPoints = async (player: IPlayer, amount: number) => {
    if (!pointsDisabled) {
      setPointsDisabled(true);
      const response = await fetch(`${constants.baseApiUrl}/adjust-points`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_id: player.id,
          amount,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const updatedPlayers = players.map((p) =>
          p.id === player.id ? { ...p, points: data.points } : p
        );
        setPlayers(updatedPlayers);

        setPointsDisabled(false);
      }
    }
  };

  const columnHelper = createColumnHelper<IPlayer>();

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
        cell: (info) => {
          return (
            <div className="flex gap-3 place-items-center">
              <button
                disabled={pointsDisabled}
                onClick={() => adjustPoints(info.row.original, 1)}
                className={`font-bold ${
                  pointsDisabled
                    ? "bg-slate-400"
                    : "bg-red-500 hover:bg-red-400"
                } text-white h-6 w-6 rounded-full transition-all`}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
              <p>{info.getValue()}</p>
              <button
                disabled={pointsDisabled}
                onClick={() => adjustPoints(info.row.original, -1)}
                className={`font-bold ${
                  pointsDisabled
                    ? "bg-slate-400"
                    : "bg-red-500 hover:bg-red-400"
                } text-white h-6 w-6 rounded-full transition-all`}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
            </div>
          );
        },
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
              <div className="flex gap-2 justify-items-center">
                <button
                  className="rounded-md w-full bg-green-500 text-white text-sm font-bold px-2"
                  onClick={() => requalifyPlayer(info.row.original)}
                >
                  Kvalific.
                </button>
                <button
                  className="rounded-md w-full"
                  onClick={() => deletePlayer(info.row.original)}
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
            );
          }
          return (
            <>
              <button
                className="rounded-md w-full bg-red-500 text-white text-sm font-bold px-2 py-1"
                onClick={() => disqualifyPlayer(info.row.original)}
              >
                Diskv.
              </button>
            </>
          );
        },
      }),
    ],
    [columnHelper, requalifyPlayer, disqualifyPlayer]
  );

  const refresh = () => {
    if (!fetchDisabled) {
      fetchPlayers();
      setFetchDisabled(true);
      setTimeout(() => setFetchDisabled(false), 1000);
    }
  };

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
    <div className="text-center h-full">
      <div className="flex gap-1 place-items-center w-20 mx-auto mb-1">
        <p className="font-semibold">Spēlētāji</p>
        <button disabled={fetchDisabled} onClick={refresh}>
          {fetchDisabled ? (
            <SpinnerCircularFixed size={12} thickness={230} color="#fff" />
          ) : (
            <i className="fa-solid fa-refresh"></i>
          )}
        </button>
      </div>
      <div className="min-h-[32rem] bg-slate-100 grow">
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
    </div>
  );
};
