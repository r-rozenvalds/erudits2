import { createColumnHelper } from "@tanstack/react-table";
import { InputModalBase } from "./InputModalBase";
import { useMemo, useState } from "react";
import { Table } from "../../table/Table";
import { PlayerInstanceStoreType } from "../stores/PlayerInstanceStore";
import { IPlayerInstance } from "../interface/IPlayerInstance";
import { IInstanceQueryModel } from "../interface/IInstanceQueryModel";

export const GameBrowserModal = ({
  onCancel,
  instanceStore,
}: {
  onCancel: () => void;
  instanceStore: PlayerInstanceStoreType;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const columnHelper = createColumnHelper<IPlayerInstance>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Nosaukums",
        meta: { filterKey: "title" },
        cell: (info) => (
          <p className="truncate" title={info.getValue()}>
            {info.getValue()}
          </p>
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
      columnHelper.accessor("player_count", {
        header: "Spēlētāji",
      }),
    ],
    [columnHelper]
  );

  const handlePagination = async (page: number) => {
    setIsLoading(true);
    const newQuery = { ...instanceStore.query, page } as IInstanceQueryModel;
    instanceStore.setQuery(newQuery);
    await instanceStore.getInstances(newQuery);
    setIsLoading(false);
  };

  return (
    <InputModalBase
      onCancel={onCancel}
      onSubmit={() => null}
      title={"Spēļu saraksts"}
    >
      <Table
        rowClassName="border-y h-10 hover:cursor-pointer"
        headerClassName="bg-white text-semibold rounded-sm p-2"
        paginateClassName="bg-slate-100 p-2 rounded-b-sm"
        pagedResult={instanceStore.instances}
        columns={columns}
        isLoading={!instanceStore.instances || isLoading}
        fetch={handlePagination}
        // onRowClick={setSelectedGame}
      />
    </InputModalBase>
  );
};
