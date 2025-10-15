import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AddProductPage from "../pages/admin/product/AddProductPage";
import AdminProductsPage from "../pages/admin/product/AdminProductsPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Protected Routes */}

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/product/add" element={<AddProductPage />} />
    </Routes>
  );
};

export default AppRouter;
