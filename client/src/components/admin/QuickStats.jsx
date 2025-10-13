import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";

const quickStats = [
  {
    label: "Conversion Rate",
    value: "3.24%",
    change: "+0.4%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Avg Order Value",
    value: "$142.50",
    change: "+$12.30",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Active Users",
    value: "2,847",
    change: "+142",
    trend: "up",
    icon: Users,
  },
  {
    label: "Low Stock Items",
    value: "23",
    change: "+5",
    trend: "down",
    icon: AlertCircle,
  },
];

export function QuickStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Statistics</CardTitle>
        <CardDescription>Real-time business metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <Badge
                  variant={stat.trend === "up" ? "success" : "destructive"}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  stat.trend === "up"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
