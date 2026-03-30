import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AuthProvider from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import AdminRoute from "@/components/routes/AdminRoute";
import GuestRoute from "@/components/routes/GuestRoute";
import VerifyEmailRoute from "@/components/routes/VerifyEmailRoute";
import MainLayout from "@/components/layouts/MainLayout";
import Home from "@/pages/Home";
import CartPage from "./pages/CartPage";

const Signin = lazy(() => import("@/pages/auth/Signin"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderListPage = lazy(() => import("@/pages/OrderListPage"));
const OrderDetailsPage = lazy(() => import("@/pages/OrderDetailsPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const AdminDashboardPage = lazy(
  () => import("@/pages/admin/AdminDashboardPage"),
);
const AdminOrderListPage = lazy(
  () => import("@/pages/admin/order/AdminOrderListPage"),
);
const AdminProductListPage = lazy(
  () => import("@/pages/admin/product/AdminProductListPage"),
);
const AdminProductAddPage = lazy(
  () => import("@/pages/admin/product/AdminProductAddPage"),
);
const AdminProductEditPage = lazy(
  () => import("@/pages/admin/product/AdminProductEditPage"),
);
const CategoryListPage = lazy(
  () => import("@/pages/admin/category/CategoryListPage"),
);
const CategoryAddPage = lazy(
  () => import("@/pages/admin/category/CategoryAddPage"),
);
const CategoryEditPage = lazy(
  () => import("@/pages/admin/category/CategoryEditPage"),
);
const BannerListPage = lazy(
  () => import("@/pages/admin/banner/BannerListPage"),
);
const BannerAddPage = lazy(() => import("@/pages/admin/banner/BannerAddPage"));
const BannerEditPage = lazy(
  () => import("@/pages/admin/banner/BannerEditPage"),
);
const BrandListPage = lazy(() => import("@/pages/admin/brand/BrandListPage"));
const BrandAddPage = lazy(() => import("@/pages/admin/brand/BrandAddPage"));
const BrandEditPage = lazy(() => import("@/pages/admin/brand/BrandEditPage"));

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
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderListPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/orders" element={<AdminOrderListPage />} />
              <Route
                path="/admin/products"
                element={<AdminProductListPage />}
              />
              <Route
                path="/admin/products/new"
                element={<AdminProductAddPage />}
              />
              <Route
                path="/admin/products/:slug/edit"
                element={<AdminProductEditPage />}
              />
              <Route path="/admin/categories" element={<CategoryListPage />} />
              <Route
                path="/admin/categories/new"
                element={<CategoryAddPage />}
              />
              <Route
                path="/admin/categories/:id/edit"
                element={<CategoryEditPage />}
              />
              <Route path="/admin/banners" element={<BannerListPage />} />
              <Route path="/admin/banners/new" element={<BannerAddPage />} />
              <Route
                path="/admin/banners/:id/edit"
                element={<BannerEditPage />}
              />
              <Route path="/admin/brands" element={<BrandListPage />} />
              <Route
                path="/admin/brands/new"
                element={<BrandAddPage />}
              />
              <Route
                path="/admin/brands/:id/edit"
                element={<BrandEditPage />}
              />
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
