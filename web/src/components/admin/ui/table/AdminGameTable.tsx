import { IGame } from "../../../../stores/interfaces/creator/IGame";
import { Table } from "../../../table/Table";
import {
  createColumnHelper,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { gameStore } from "../../../../stores/GameStore";
import { TableThreeDots } from "./TableThreeDots";
import { IGameQueryModel } from "../../../../stores/interfaces/query/IGameQueryModel";

export const AdminGameTable = ({
  onActivationModalOpen,
  setSelectedGame,
  onEdit,
  onDuplicate,
  onDelete,
  onDeactivate,
}: {
  onActivationModalOpen: (game: IGame) => void;
  setSelectedGame: (game: IGame) => void;
  onEdit: (game: IGame) => void;
  onDuplicate: (game: IGame) => void;
  onDelete: (game: IGame) => void;
  onDeactivate: (game: IGame) => void;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { games, getGames, query, setQuery } = gameStore();

  useEffect(() => {
    getGames(query);
  }, []);

  const columnHelper = createColumnHelper<IGame>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: "#",
        cell: (info) => (
          <p>
            {info.row.index +
              (games?.items_per_page ?? 0) * ((games?.page ?? 0) - 1) +
              1}
          </p>
        ),
      }),
      columnHelper.accessor("title", {
        header: "Nosaukums",
        meta: { filterKey: "title" },
        cell: (info) => <p title={info.getValue()}>{info.getValue()}</p>,
        enableSorting: true,
      }),
      columnHelper.accessor("last_activation", {
        header: "Pēdējoreiz spēlēts",
        cell: (info) =>
          info.getValue() ? (
            <p title={info.getValue()}>
              {new Date(info.getValue()?.toString() ?? "").toLocaleDateString()}
            </p>
          ) : (
            <p>-</p>
          ),
        enableSorting: true,
      }),
      columnHelper.accessor("created_at", {
        header: "Izveidots",
        cell: (info) =>
          info.getValue() ? (
            <p title={info.getValue()}>
              {new Date(info.getValue()?.toString() ?? "").toLocaleDateString()}
            </p>
          ) : (
            <p>-</p>
          ),
        enableSorting: true,
      }),
      columnHelper.accessor("is_active", {
        header: "Statuss",
        cell: (info) =>
          info.getValue() ? (
            <div
              title="Spēle aktivizēta"
              className="w-3 h-3 bg-green-600 rounded-sm mx-auto"
            ></div>
          ) : (
            <div
              title="Spēle nav aktivizēta"
              className="w-3 h-3 bg-red-600 rounded-sm mx-auto"
            ></div>
          ),
      }),
      columnHelper.display({
        header: "Darbības",
        cell: (info) => {
          return (
            <div>
              <TableThreeDots
                tooltips={[
                  {
                    text: "Aktivizēt",
                    function: () => onActivationModalOpen(info.row.original),
                    hidden: info.row.original?.is_active,
                  },
                  {
                    text: "Deaktivizēt",
                    function: () => onDeactivate(info.row.original),
                    hidden: !info.row.original?.is_active,
                  },
                  { text: "Labot", function: () => onEdit(info.row.original) },
                  {
                    text: "Dublicēt",
                    function: () => onDuplicate(info.row.original),
                  },

                  {
                    text: "Dzēst",
                    function: () => onDelete(info.row.original),
                  },
                ]}
              />
            </div>
          );
        },
      }),
    ],
    [columnHelper]
  );

  const handleSort = async (updaterOrValue: Updater<SortingState>) => {
    setIsLoading(true);
    const newSortingState =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    if (newSortingState.length > 0) {
      const { id, desc } = newSortingState[0];

      await getGames({
        ...query,
        sortBy: id,
        sortDesc: desc,
      } as IGameQueryModel);
    }

    setSorting(newSortingState);
    setIsLoading(false);
  };

  const handlePagination = async (page: number) => {
    setIsLoading(true);
    const newQuery = { ...query, page } as IGameQueryModel;
    setQuery(newQuery);
    await getGames(newQuery);
    setIsLoading(false);
  };

  return (
    <div className="w-2/3">
      <Table
        sorting={sorting}
        onSort={handleSort}
        rowClassName="border-y h-10 hover:cursor-pointer"
        headerClassName="bg-white text-semibold rounded-sm p-2"
        paginateClassName="bg-slate-100 p-2 rounded-b-sm"
        pagedResult={games}
        columns={columns}
        isLoading={!games || isLoading}
        fetch={handlePagination}
        onRowClick={setSelectedGame}
      />
    </div>
  );
};
