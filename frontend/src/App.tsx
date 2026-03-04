import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AuthProvider from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import GuestRoute from "@/components/routes/GuestRoute";
import VerifyEmailRoute from "@/components/routes/VerifyEmailRoute";
import Home from "@/pages/Home";

const Signin = lazy(() => import("@/pages/auth/Signin"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-svh">
              <LoadingSpinner size={32} className="text-primary" />
            </div>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />

            {/* Guest-only routes */}
            <Route element={<GuestRoute />}>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Verify email (auth required, but redirects if already verified) */}
            <Route element={<VerifyEmailRoute />}>
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Route>

            {/* Protected routes (auth + verified email required) */}
            <Route element={<ProtectedRoute />}>
              {/* Future: checkout, admin, etc. */}
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
};

export default App;
