import type { Route } from "./+types/_index";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import PublicParkingGrid from "@/features/parking-space/public-parking-grid";

export function meta({}: Route.MetaArgs) {
  return [{ title: "estacionamento-sys" }, { name: "description", content: "estacionamento-sys is a web application" }];
}

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2 space-y-6">
      <h1 className="text-2xl font-semibold tracking-wide">Vagas de Estacionamento</h1>
      <div className="grid gap-6">
        <section>
          <PublicParkingGrid />
        </section>
      </div>
    </div>
  );
}
