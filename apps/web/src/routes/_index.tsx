import type { Route } from "./+types/_index";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import PublicParkingGrid from "@/features/parking-space/public-parking-grid";

export function meta({}: Route.MetaArgs) {
  return [{ title: "estacionamento-sys" }, { name: "description", content: "estacionamento-sys is a web application" }];
}

export default function Home() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section>
          <PublicParkingGrid />
        </section>
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-muted-foreground">
              {healthCheck.isLoading ? "Checking..." : healthCheck.data ? "Connected" : "Disconnected"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
