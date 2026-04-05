import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { checkAuth } from "@/services/api/auth/authApi";
import { useAuthStore } from "@/store/useAuthStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const { data, isError } = useQuery({
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

  return <>{children}</>;
};

export default AuthProvider;
