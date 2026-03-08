import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AuthProvider from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import GuestRoute from "@/components/routes/GuestRoute";
import VerifyEmailRoute from "@/components/routes/VerifyEmailRoute";
import MainLayout from "@/components/layouts/MainLayout";
import Home from "@/pages/Home";
import CartPage from "./pages/CartPage";

const Signin = lazy(() => import("@/pages/auth/Signin"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));

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
            {/* Routes with header */}
            <Route element={<MainLayout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product/:slug" element={<ProductDetails />} />

              {/* Protected routes (auth + verified email required) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<CartPage />} />
                {/* Future: checkout, admin, etc. */}
              </Route>
            </Route>

            {/* Guest-only routes (no header) */}
            <Route element={<GuestRoute />}>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Verify email (auth required, but redirects if already verified) */}
            <Route element={<VerifyEmailRoute />}>
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
};

export default App;
