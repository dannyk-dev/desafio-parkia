import AdminEditor from "@/components/AdminEditor";
export default function Route() {
  // proteja com seu guard de sessão/role no loader/layout
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Vagas</h1>
      <AdminEditor />
    </main>
  );
}
