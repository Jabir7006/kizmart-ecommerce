import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { checkAuth } from "@/services/api/auth/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.data?.data) {
      setUser(data.data.data);
    } else if (isError || (data && !data?.data?.data)) {
      logout();
    }
  }, [data, isError, setUser, logout]);

  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
