import React, { useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { StatsCard } from "../../components/admin/StatsCard";
import { SalesChart } from "../../components/admin/SalesChart";
import { RecentOrders } from "../../components/admin/RecentOrders";
import { TopProducts } from "../../components/admin/TopProducts";
import { QuickStats } from "../../components/admin/QuickStats";
import { ActivityFeed } from "../../components/admin/ActivityFeed";
import { PerformanceMetrics } from "../../components/admin/PerformanceMetrics";
import { WelcomeBanner } from "../../components/admin/WelcomeBanner";
import { Button } from "../../components/ui/button";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Filter,
} from "lucide-react";

const AdminDashboardPage = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        {showWelcome && (
          <WelcomeBanner onDismiss={() => setShowWelcome(false)} />
        )}

        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1%"
            trend="up"
            icon={DollarSign}
            description="+$4,231 from last month"
          />
          <StatsCard
            title="Total Orders"
            value="2,350"
            change="+15.3%"
            trend="up"
            icon={ShoppingCart}
            description="+180 from last month"
          />
          <StatsCard
            title="Total Customers"
            value="12,234"
            change="+8.2%"
            trend="up"
            icon={Users}
            description="+573 new customers"
          />
          <StatsCard
            title="Active Products"
            value="573"
            change="-2.4%"
            trend="down"
            icon={Package}
            description="12 out of stock"
          />
        </div>

        {/* Charts and Stats Row */}
        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <SalesChart />
          </div>
          <div className="lg:col-span-3">
            <QuickStats />
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <RecentOrders />
          </div>
          <div className="lg:col-span-3">
            <TopProducts />
          </div>
        </div>

        {/* Activity and Performance Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityFeed />
          <PerformanceMetrics />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
