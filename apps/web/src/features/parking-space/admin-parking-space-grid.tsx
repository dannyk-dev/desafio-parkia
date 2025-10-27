import { useMemo } from "react";
import type { ParkingSpace } from "@estacionamento-sys/api/interfaces";
import { useParkingLive } from "./hooks/use-live-parking-updates";
import AdminParkingCard from "./admin-parking-space-card";

type Props = {
  onEdit?: (space: ParkingSpace) => void;
};

export default function AdminParkingSpaceGrid({ onEdit }: Props) {
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

  if (list.isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4 mt-6">
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
          <AdminParkingCard key={p.id} space={p} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}
