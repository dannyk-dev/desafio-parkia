import { useMemo } from "react";
import { useParkingLive } from "./hooks/use-live-parking-updates";
import PublicParkingCard from "./public-park-space-card";
import type { ParkingSpace } from "@estacionamento-sys/api/interfaces";

export default function PublicParkingGrid() {
  const { list } = useParkingLive();
  const items = list.data?.items ?? [];
  const counts = list.data?.counts ?? { LIVRE: 0, OCUPADA: 0 };

  const summary = useMemo(
    () => [
      { label: "Livres", value: counts.LIVRE, className: "text-green-700" },
      { label: "Ocupadas", value: counts.OCUPADA, className: "text-red-700" },
    ],
    [counts]
  );

  return (
    <div className="space-y-4">
      {list.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex gap-3">
            {summary.map((s) => (
              <div key={s.label} className="rounded border px-3 py-2 shadow-sm">
                <span className="text-sm mr-2">{s.label}:</span>
                <b className={s.className}>{s.value}</b>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((p: ParkingSpace) => (
              <PublicParkingCard key={p.id} numero={p.numero} tipo={p.tipo} status={p.status} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
