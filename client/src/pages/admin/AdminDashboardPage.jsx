import React from "react";
import AdminLayout from "../../components/layouts/AdminLayout";

import {
  PageHeader,
  QuickStats,
  RecentOrders,
  TopProducts,
  ActivityFeed,
  SalesChart,
  PerformanceMetrics,
  EmptyState,
} from "../../components/admin";

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's what's happening with your store."
        />

        {/* Stats Grid */}
        <QuickStats />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <RecentOrders />

          {/* Top Products */}
          <TopProducts />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <ActivityFeed />

          {/* Top Products */}
          <PerformanceMetrics />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
