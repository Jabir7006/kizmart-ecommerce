import { AdminLayout } from "@/components/layouts/AdminLayout";

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>
          Welcome to the admin dashboard! Here you can manage your store, view
          analytics, and perform other administrative tasks.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
