"use client";
import { useEffect, useState } from "react";
import { orpc } from "@/utils/orpc";

function useWS(onMessage: (m:any)=>void) {
  useEffect(() => {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${location.host}/ws`);
    ws.onmessage = (ev) => { try { onMessage(JSON.parse(ev.data)); } catch {} };
    return () => ws.close();
  }, [onMessage]);
}

export default function AdminEditor() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ numero: "", status: "livre", tipo: "carro" });

  async function load() {
    const res = await orpc.parking.list.query();
    setItems(res.items as any);
  }

  useEffect(() => { load(); }, []);
  useWS((msg) => { if (msg.topic === "parking:update") load(); });

  return (
    <div className="space-y-6">
      <form
        className="flex gap-2 items-end"
        onSubmit={async (e) => { e.preventDefault(); await orpc.parking.create.mutate(form); setForm({ numero: "", status: "livre", tipo: "carro" }); }}
      >
        <div><label className="block text-sm">Número</label>
          <input className="border p-2 rounded" required value={form.numero}
            onChange={(e)=>setForm(f=>({...f,numero:e.target.value}))}/>
        </div>
        <div><label className="block text-sm">Status</label>
          <select className="border p-2 rounded" value={form.status}
            onChange={(e)=>setForm(f=>({...f,status:e.target.value as any}))}>
            <option value="livre">livre</option><option value="ocupada">ocupada</option>
          </select>
        </div>
        <div><label className="block text-sm">Tipo</label>
          <select className="border p-2 rounded" value={form.tipo}
            onChange={(e)=>setForm(f=>({...f,tipo:e.target.value as any}))}>
            <option value="carro">carro</option><option value="moto">moto</option><option value="deficiente">deficiente</option>
          </select>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded">Criar</button>
      </form>
      <table className="w-full border rounded">
        <thead><tr className="bg-gray-50">
          <th className="p-2 text-left">ID</th><th className="p-2 text-left">Número</th>
          <th className="p-2 text-left">Status</th><th className="p-2 text-left">Tipo</th>
          <th className="p-2 text-left">Ações</th></tr></thead>
        <tbody>
          {items.map((i)=>(
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.id}</td>
              <td className="p-2">
                <input className="border p-1 rounded w-24" defaultValue={i.numero}
                  onBlur={async (e)=>await orpc.parking.update.mutate({ id: i.id, numero: e.target.value })}/>
              </td>
              <td className="p-2">
                <select className="border p-1 rounded" defaultValue={i.status}
                  onChange={async (e)=>await orpc.parking.update.mutate({ id: i.id, status: e.target.value as any })}>
                  <option value="livre">livre</option><option value="ocupada">ocupada</option>
                </select>
              </td>
              <td className="p-2">
                <select className="border p-1 rounded" defaultValue={i.tipo}
                  onChange={async (e)=>await orpc.parking.update.mutate({ id: i.id, tipo: e.target.value as any })}>
                  <option value="carro">carro</option><option value="moto">moto</option><option value="deficiente">deficiente</option>
                </select>
              </td>
              <td className="p-2">
                <button className="text-red-600" onClick={async()=>orpc.parking.remove.mutate({ id: i.id })}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
