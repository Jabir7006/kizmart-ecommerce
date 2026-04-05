import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const GuestRoute = () => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <LoadingSpinner size={24} className="text-primary" />
      </div>
    );
  }

  if (isAuthenticated && user?.verified) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && user && !user.verified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
