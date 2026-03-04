import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const GuestRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.verified) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && user && !user.verified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
