import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const VerifyEmailRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.verified) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default VerifyEmailRoute;
