import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import type { ParkingSpace, ParkingStatus } from "@estacionamento-sys/api/interfaces";
import type { TParkingUpdate } from "@estacionamento-sys/api/schemas";

type ListData = {
  items: ParkingSpace[];
  counts: Record<ParkingStatus, number>;
};

function recomputeCounts(items: ParkingSpace[]): ListData["counts"] {
  return items.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    { LIVRE: 0, OCUPADA: 0 } as ListData["counts"]
  );
}

function applyEvent(oldData: ListData | undefined, evt: TParkingUpdate): ListData | undefined {
  if (!oldData) return oldData;

  if (evt.type === "created") {
    const items = [...oldData.items, evt.item];
    return { items, counts: recomputeCounts(items) };
  }

  if (evt.type === "updated") {
    const items = oldData.items.map((x) => (x.id === evt.item.id ? evt.item : x));
    return { items, counts: recomputeCounts(items) };
  }

  if (evt.type === "removed") {
    const items = oldData.items.filter((x) => x.id !== evt.id);
    return { items, counts: recomputeCounts(items) };
  }

  return oldData;
}

export function useParkingLive() {
  const queryClient = useQueryClient();

  const listOpts = useMemo(() => orpc.parkingSpace.list.queryOptions(), []);
  const list = useQuery(listOpts);

  const live = useQuery(
    orpc.parkingSpace.live.experimental_liveOptions({
      retry: true,
    })
  );

  useEffect(() => {
    if (!live.data) return;

    const updatedData = applyEvent(list.data, live.data);
    queryClient.setQueryData(listOpts.queryKey, updatedData);
  }, [live.data]);

  return { list, live, listQueryKey: listOpts.queryKey as QueryKey };
}
