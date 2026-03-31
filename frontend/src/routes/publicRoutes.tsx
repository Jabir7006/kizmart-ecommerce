import { lazy } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import GuestRoute from "@/components/routes/GuestRoute";
import VerifyEmailRoute from "@/components/routes/VerifyEmailRoute";
import Home from "@/pages/Home";
import CartPage from "@/pages/CartPage";

// Lazy loads
const Signin = lazy(() => import("@/pages/auth/Signin"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const StorePage = lazy(() => import("@/pages/StorePage"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderListPage = lazy(() => import("@/pages/OrderListPage"));
const OrderDetailsPage = lazy(() => import("@/pages/OrderDetailsPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));

export const publicRoutes = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/store", element: <StorePage /> },
      { path: "/product/:slug", element: <ProductDetails /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout", element: <Checkout /> },
          { path: "/orders", element: <OrderListPage /> },
          { path: "/orders/:orderId", element: <OrderDetailsPage /> },
          { path: "/account", element: <AccountPage /> },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      { path: "/signin", element: <Signin /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
  {
    element: <VerifyEmailRoute />,
    children: [{ path: "/verify-email", element: <VerifyEmail /> }],
  },
];
