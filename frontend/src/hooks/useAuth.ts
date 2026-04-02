import {
  signIn,
  signUp,
  verifyEmail,
  resendVerificationEmail,
  type SignInData,
  type SignUpData,
  signOut,
} from "@/services/api/auth/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { handleMutationError } from "@/utils/errorUtils";


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
      handleMutationError(error, "Login failed");
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignUpData) => signUp(data),
    onSuccess: (response) => {
      setUser(response.data.data);
      toast.success(response.data.message || "Account created successfully!");
      navigate("/verify-email");
    },
    onError: (error) => handleMutationError(error, "Signup failed"),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) => verifyEmail(code),
    onSuccess: (response) => {
      setUser(response.data.data);
      toast.success(response.data.message || "Email verified successfully!");
      navigate("/");
    },
    onError: (error) => handleMutationError(error, "Email verification failed"),
  });

  const resendVerificationMutation = useMutation({
    mutationFn: () => resendVerificationEmail(),
    onSuccess: (response) => {
      toast.success(
        response.data.message || "Verification email resent successfully!",
      );
    },
    onError: (error) => handleMutationError(error, "Failed to resend verification email"),
  });

  const signOutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      logout();
      toast.success("Signed out successfully");
      navigate("/");
    },
    onError: (error) => handleMutationError(error, "Failed to sign out"),
  });

  return {
    loginMutation,
    signupMutation,
    verifyEmailMutation,
    resendVerificationMutation,
    signOutMutation,
    logout,
  };
};

export default useAuth;
