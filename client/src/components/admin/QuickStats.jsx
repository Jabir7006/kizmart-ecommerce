import React from "react";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import StatsCard from "./StatsCard";
export default function QuickStats() {
  const stats = [
    {
      name: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
    },
    {
      name: "Orders",
      value: "2,345",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      name: "Products",
      value: "1,234",
      change: "+4.3%",
      trend: "up",
      icon: Package,
    },
    {
      name: "Customers",
      value: "8,492",
      change: "-2.4%",
      trend: "down",
      icon: Users,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.name} stat={stat} />
      ))}
    </div>
  );
}
