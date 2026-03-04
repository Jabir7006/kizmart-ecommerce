import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user && !user.verified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
