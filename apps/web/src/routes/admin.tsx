import AuthGuard from "@/components/guards/auth-guard";
import { AddParkingSpace, AdminParkingSpaceGrid } from "@/features/parking-space";

type Props = {};

const AdminPage = (props: Props) => {
  return (
    <AuthGuard>
      <div className="flex flex-col py-10 px-6">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Parking Management</h1>

          <AddParkingSpace />
        </div>
        <AdminParkingSpaceGrid />
      </div>
    </AuthGuard>
  );
};

export default AdminPage;
