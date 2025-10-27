import AuthGuard from "@/components/guards/auth-guard";
import { AddParkingSpace, AdminParkingSpaceGrid } from "@/features/parking-space";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";

type Props = {};

const AdminPage = (props: Props) => {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  return (
    <AuthGuard>
      <div className="flex flex-col py-10 px-6">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Parking Management</h1>

          <AddParkingSpace />
        </div>
        <AdminParkingSpaceGrid />
        <section className="rounded-lg border p-4 mt-auto sticky left-0 bottom-0 right-0">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-muted-foreground">
              {healthCheck.isLoading ? "Checking..." : healthCheck.data ? "Connected" : "Disconnected"}
            </span>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
};

export default AdminPage;
