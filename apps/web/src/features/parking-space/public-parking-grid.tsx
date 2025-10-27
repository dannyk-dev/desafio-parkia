import { orpc } from "@/utils/orpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type Props = {};

const PublicParkingGrid = (props: Props) => {
  const queryClient = useQueryClient();
  const listOpts = orpc.parkingSpace.list.queryOptions();

  const { data, isLoading } = useQuery(listOpts);
  const { data: liveUpdates, isLoading: updating } = useQuery(orpc.parkingSpace.live.experimental_liveOptions());

  useEffect(() => {
    if (!liveUpdates) return;

    switch (liveUpdates.type) {
      case "created":
        queryClient.setQueryData(listOpts.queryKey, (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: [...oldData.items, liveUpdates.item],
            counts: {
              ...oldData.counts,
              [liveUpdates.item.status]: oldData.counts[liveUpdates.item.status] + 1,
            },
          };
        });
        break;
      case "updated":
        queryClient.setQueryData(listOpts.queryKey, (oldData: any) => {
          if (!oldData) return oldData;
          const updatedItems = oldData.items.map((item: any) =>
            item.id === liveUpdates.item.id ? liveUpdates.item : item
          );

          const counts = updatedItems.reduce(
            (acc: any, r: any) => {
              acc[r.status] = (acc[r.status] ?? 0) + 1;
              return acc;
            },
            { livre: 0, ocupada: 0 }
          );

          return {
            ...oldData,
            items: updatedItems,
            counts,
          };
        });
        break;
      case "removed":
        queryClient.setQueryData(listOpts.queryKey, (oldData: any) => {
          if (!oldData) return oldData;
          const filteredItems = oldData.items.filter((item: any) => item.id !== liveUpdates.item.id);

          // Recalculate counts
          const counts = filteredItems.reduce(
            (acc: any, r: any) => {
              acc[r.status] = (acc[r.status] ?? 0) + 1;
              return acc;
            },
            { livre: 0, ocupada: 0 }
          );

          return {
            ...oldData,
            items: filteredItems,
            counts,
          };
        });
        break;
      default:
        break;
    }
  }, [liveUpdates]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && data && (
        <ul>
          {data.items.map((parkingSpace: any) => (
            <li key={parkingSpace.id}>
              {parkingSpace.numero} - {parkingSpace.tipo.toUpperCase()}{" "}
              {/* status will live-update because cache is mutated immutably */}— {parkingSpace.status.toUpperCase()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PublicParkingGrid;
