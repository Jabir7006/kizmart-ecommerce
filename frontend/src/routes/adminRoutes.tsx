import { lazy } from "react";
import AdminRoute from "@/components/routes/AdminRoute";

// Lazy loads
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

export const adminRoutes = [
  {
    element: <AdminRoute />,
    children: [
      { path: "/admin", element: <AdminDashboardPage /> },
      { path: "/admin/orders", element: <AdminOrderListPage /> },
      { path: "/admin/products", element: <AdminProductListPage /> },
      { path: "/admin/products/new", element: <AdminProductAddPage /> },
      { path: "/admin/products/:slug/edit", element: <AdminProductEditPage /> },
      { path: "/admin/categories", element: <CategoryListPage /> },
      { path: "/admin/categories/new", element: <CategoryAddPage /> },
      { path: "/admin/categories/:id/edit", element: <CategoryEditPage /> },
      { path: "/admin/banners", element: <BannerListPage /> },
      { path: "/admin/banners/new", element: <BannerAddPage /> },
      { path: "/admin/banners/:id/edit", element: <BannerEditPage /> },
      { path: "/admin/brands", element: <BrandListPage /> },
      { path: "/admin/brands/new", element: <BrandAddPage /> },
      { path: "/admin/brands/:id/edit", element: <BrandEditPage /> },
    ],
  },
];
