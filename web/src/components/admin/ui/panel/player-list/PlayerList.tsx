import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useConfirmation } from "../../../../universal/ConfirmationWindowContext";
import { SpinnerCircularFixed } from "spinners-react";
import { useAdminPanel } from "../../../../universal/AdminPanelContext";
import { formatText } from "../../../../universal/functions";
import { TiebreakModal } from "../TiebreakModal";
import { playerStore } from "../../../../../stores/PlayerStore";
import { IPlayer } from "../../../../../stores/interfaces/IPlayer";
import { IPlayerQueryModel } from "../../../../../stores/interfaces/query/IPlayerQueryModel";
import { Table } from "../../../../table/Table";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import { IPlayerRequestModel } from "../../../../../stores/interfaces/request/IPlayerRequestModel";
import { IPlayerPointsRequestModel } from "../../../../../stores/interfaces/request/IPlayerPointsRequestModel";

export const PlayerList = () => {
  const [fetchDisabled, setFetchDisabled] = useState(false);
  const [pointsDisabled, setPointsDisabled] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [openTiebreakModal, setOpenTiebreakModal] = useState(false);

  const { instanceId } = useAdminPanel();
  const {
    fetchPlayerItems,
    playerItems,
    postTiebreak,
    postDelete,
    postDisqualify,
    postRequalify,
    postPoints,
  } = playerStore();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async (page?: number) => {
    if (!instanceId) return;

    const query = {
      page: page ?? 1,
      limit: 10,
      instance_id: instanceId,
      sortBy: "points",
    } as IPlayerQueryModel;

    fetchPlayerItems(query);
  };

  const confirm = useConfirmation();

  const disqualifyPlayer = async () => {
    if (selectedPlayerIds.length < 1) {
      return;
    }
    if (await confirm(`Vai tiešām vēlaties diskvalificēt šos spēlētājus?`)) {
      const request = {
        player_ids: selectedPlayerIds.join(","),
      } as IPlayerRequestModel;

      if (await postDisqualify(request)) {
        fetchPlayers();
      }
    }
  };

  const deletePlayer = async () => {
    if (selectedPlayerIds.length < 1) {
      return;
    }
    if (await confirm(`Vai tiešām vēlaties dzēst šos spēlētājus?`)) {
      const request = {
        player_ids: selectedPlayerIds.join(","),
      } as IPlayerRequestModel;

      if (await postDelete(request)) {
        fetchPlayers();
        setSelectedPlayerIds([]);
      }
    }
  };

  const requalifyPlayer = async () => {
    if (selectedPlayerIds.length < 1) {
      return;
    }
    if (await confirm(`Vai tiešām vēlaties rekvalificēt šos spēlētājus?`)) {
      const request = {
        player_ids: selectedPlayerIds.join(","),
      } as IPlayerRequestModel;

      if (await postRequalify(request)) {
        fetchPlayers();
      }
    }
  };

  const tiebreakAdjustPoints = async (playerId: string, amount: number) => {
    const player = playerItems?.items.find((p) => p.id === playerId);
    if (!player) return;
    await adjustPoints(player.id, amount);
  };

  const adjustPoints = async (playerId: string, amount: number) => {
    if (pointsDisabled) return;
    setPointsDisabled(true);
    const request = {
      player_id: playerId,
      points: amount,
    } as IPlayerPointsRequestModel;

    if (await postPoints(request)) {
      await fetchPlayers();
    }
    setPointsDisabled(false);
  };

  const handleTiebreak = async () => {
    if (selectedPlayerIds.length < 1) {
      return;
    }
    const request = {
      instance_id: instanceId,
      player_ids: selectedPlayerIds.join(","),
    } as IPlayerRequestModel;

    if (await postTiebreak(request)) {
      setOpenTiebreakModal(true);
    }
  };

  const columnHelper = createColumnHelper<IPlayer>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("position", {
        header: "Pozīcija",
        cell: (info) => <p>{info.getValue()}</p>,
      }),
      columnHelper.accessor("player_name", {
        header: "Nosaukums",
        cell: (info) => (
          <p title={info.getValue()}>{formatText(info.getValue(), 16)}</p>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("points", {
        header: "Punkti",
        cell: (info) => {
          return (
            <div className="flex gap-1 place-items-center">
              <button
                disabled={pointsDisabled}
                onClick={() =>
                  adjustPoints(
                    info.row.original.id,
                    info.row.original.points + 1
                  )
                }
                className={`font-bold ${
                  pointsDisabled ? "bg-slate-400" : "bg-[#E63946]"
                } text-white h-6 w-6 rounded-full transition-all`}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
              <div className="relative">
                <input
                  disabled={pointsDisabled}
                  className={`w-12 text-center accent-[#E63946] ${
                    pointsDisabled ? "bg-slate-200" : "bg-transparent"
                  }`}
                  type="number"
                  defaultValue={info.row.original.points}
                  onBlur={(e) => {
                    const parsed = parseInt(e.target.value);
                    if (!isNaN(parsed) && parsed !== info.row.original.points) {
                      adjustPoints(info.row.original.id, parsed);
                    } else {
                      e.target.value = info.row.original.points.toString(); // reset to original if invalid
                    }
                  }}
                />
                {pointsDisabled && (
                  <div className="bg-slate-200 absolute w-12 h-6 top-0 rounded-sm">
                    <div className="w-4 mx-auto mt-1">
                      <SpinnerCircularFixed
                        size={16}
                        thickness={230}
                        color="#fff"
                      />
                    </div>
                  </div>
                )}
              </div>
              <button
                disabled={pointsDisabled}
                onClick={() =>
                  adjustPoints(
                    info.row.original.id,
                    info.row.original.points - 1
                  )
                }
                className={`font-bold ${
                  pointsDisabled ? "bg-slate-400" : "bg-[#E63946]"
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
        cell: (info) => {
          return (
            <input
              onChange={() => toggleSelectedPlayerId(info.row.original.id)}
              type="checkbox"
              className="accent-[#E63946] w-4 h-4"
              checked={selectedPlayerIds.includes(info.row.original.id)}
            ></input>
          );
        },
      }),
    ],
    [columnHelper]
  );

  const toggleSelectedPlayerId = (playerId: string) => {
    setSelectedPlayerIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const refresh = () => {
    if (!fetchDisabled) {
      fetchPlayers();
      setFetchDisabled(true);
      setTimeout(() => setFetchDisabled(false), 1000);
    }
  };

  const showDeleteButton = () => {
    const selectedPlayers = playerItems?.items.filter((player) =>
      selectedPlayerIds.includes(player.id)
    );

    if (
      selectedPlayers &&
      selectedPlayers.every((player) => player.is_disqualified)
    ) {
      return true;
    }
    return false;
  };

  const showDisqualifyButton = () => {
    const selectedPlayers = playerItems?.items.filter((player) =>
      selectedPlayerIds.includes(player.id)
    );

    if (
      selectedPlayers &&
      selectedPlayers.every((player) => !player.is_disqualified)
    ) {
      return true;
    }
    return false;
  };

  const showRequalifyButton = () => {
    const selectedPlayers = playerItems?.items.filter((player) =>
      selectedPlayerIds.includes(player.id)
    );

    if (
      selectedPlayers &&
      selectedPlayers.every((player) => player.is_disqualified)
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {openTiebreakModal && (
        <TiebreakModal
          setOpen={setOpenTiebreakModal}
          adjustPoints={tiebreakAdjustPoints}
        />
      )}
      <div className="flex w-auto">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 place-items-center w-20 mx-auto">
            <p className="font-semibold">Spēlētāji</p>
            <button disabled={fetchDisabled} onClick={refresh}>
              {fetchDisabled ? (
                <SpinnerCircularFixed size={12} thickness={230} color="#fff" />
              ) : (
                <i className="fa-solid fa-refresh"></i>
              )}
            </button>
          </div>
          <div className="w-full h-full bg-slate-100">
            <Table
              pagedResult={playerItems}
              columns={columns}
              isLoading={!playerItems}
              fetch={fetchPlayers}
            />
          </div>
        </div>
        {selectedPlayerIds.length > 0 && (
          <div className="w-16 my-7 p-2 bg-slate-200 flex flex-col gap-2">
            {showDisqualifyButton() && (
              <ButtonWithTooltip
                color={"#d00000"}
                onClick={disqualifyPlayer}
                tooltip={"Diskvalificēt"}
                icon="fa-ban"
              />
            )}
            {showRequalifyButton() && (
              <ButtonWithTooltip
                color={"#57cc99"}
                onClick={requalifyPlayer}
                tooltip={"Rekvalificēt"}
                icon="fa-rotate-left"
              />
            )}
            <ButtonWithTooltip
              color={"#fca311"}
              onClick={handleTiebreak}
              tooltip={"Lauzt neizšķirtu"}
              icon="fa-scale-balanced"
            />
            {showDeleteButton() && (
              <ButtonWithTooltip
                color={"#dd2d4a"}
                onClick={deletePlayer}
                tooltip={"Dzēst izvēlni"}
                icon="fa-trash-can"
              />
            )}
            <ButtonWithTooltip
              color={"#3f37c9"}
              onClick={() => setSelectedPlayerIds([])}
              tooltip={"Atcelt izvēlni"}
              icon="fa-xmark"
            />
          </div>
        )}
      </div>
    </>
  );
};
