import {
  signIn,
  signUp,
  type SignInData,
  type SignUpData,
} from "@/services/api/auth/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  success: boolean;
  message: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data) {
    return (
      (error.response.data as ApiErrorResponse).message ||
      "Something went wrong"
    );
  }
  return "An unexpected error occurred. Please try again.";
};

const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (data: SignInData) => signIn(data),
    onSuccess: (response) => {
      setUser(response.data.data);
      toast.success(response.data.message || "Login successful!");
      navigate("/");
    },
    onError: (error) => {
      logout();
      toast.error(getErrorMessage(error));
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignUpData) => signUp(data),
    onSuccess: (response) => {
      setUser(response.data.data);
      toast.success(response.data.message || "Account created successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    loginMutation,
    signupMutation,
    logout,
  };
};

export default useAuth;
