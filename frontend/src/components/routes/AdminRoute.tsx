import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AdminRoute = () => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <LoadingSpinner size={24} className="text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user && !user.verified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
