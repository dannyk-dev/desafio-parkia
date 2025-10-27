import { useEffect, useMemo, useState } from "react";
import { orpc } from "@/utils/orpc";

type Item = { id: number; numero: string; status: "livre"|"ocupada"; tipo: "carro"|"moto"|"deficiente"; criadoEm: string };

function useWS(onMessage: (m:any)=>void) {
  useEffect(() => {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${location.host}/ws`);
    ws.onmessage = (ev) => { try { onMessage(JSON.parse(ev.data)); } catch {} };
    return () => ws.close();
  }, [onMessage]);
}

export function ParkingGrid() {
  const [items, setItems] = useState<Item[]>([]);
  const counts = useMemo(() => ({
    livre: items.filter(i => i.status === "livre").length,
    ocupada: items.filter(i => i.status === "ocupada").length,
  }), [items]);

  async function load() {
    const res = await orpc.parking.list.query();
    setItems(res.items as any);
  }

  useEffect(() => { load(); }, []);
  useWS((msg) => {
    if (msg.topic === "parking:update") load();
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="rounded-xl p-3 shadow">Livres: <b className="text-green-600">{counts.livre}</b></div>
        <div className="rounded-xl p-3 shadow">Ocupadas: <b className="text-red-600">{counts.ocupada}</b></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((i) => (
          <div key={i.id} className="rounded-xl p-4 shadow border">
            <div className="text-sm text-gray-500">{i.tipo.toUpperCase()}</div>
            <div className="text-xl font-semibold">{i.numero}</div>
            <div className={\`mt-2 inline-flex items-center gap-2 \${i.status === "livre" ? "text-green-700" : "text-red-700"}\`}>
              <span className={\`w-2 h-2 rounded-full \${i.status === "livre" ? "bg-green-500" : "bg-red-500"}\`} />
              {i.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
