import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Protected Routes */}

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Routes>
  );
};

export default AppRouter;