import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShoppingCart,
  Package,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const activities = [
  {
    type: "order",
    icon: ShoppingCart,
    title: "New order received",
    description: "Order #ORD-001 from John Doe",
    time: "2 minutes ago",
    status: "success",
  },
  {
    type: "product",
    icon: Package,
    title: "Product updated",
    description: "Wireless Headphones Pro - Price changed",
    time: "15 minutes ago",
    status: "info",
  },
  {
    type: "user",
    icon: User,
    title: "New customer registered",
    description: "Sarah Smith joined the platform",
    time: "1 hour ago",
    status: "success",
  },
  {
    type: "payment",
    icon: DollarSign,
    title: "Payment received",
    description: "$499.00 for Order #ORD-002",
    time: "2 hours ago",
    status: "success",
  },
  {
    type: "alert",
    icon: AlertCircle,
    title: "Low stock alert",
    description: "Smart Watch Series 5 - Only 3 left",
    time: "3 hours ago",
    status: "warning",
  },
  {
    type: "order",
    icon: CheckCircle,
    title: "Order completed",
    description: "Order #ORD-003 delivered successfully",
    time: "4 hours ago",
    status: "success",
  },
  {
    type: "product",
    icon: Package,
    title: "New product added",
    description: "Gaming Mouse Pro - Added to inventory",
    time: "5 hours ago",
    status: "info",
  },
  {
    type: "user",
    icon: User,
    title: "Customer updated profile",
    description: "Mike Johnson updated shipping address",
    time: "6 hours ago",
    status: "info",
  },
];

const iconColors = {
  success: "bg-green-500/10 text-green-600",
  info: "bg-blue-500/10 text-blue-600",
  warning: "bg-yellow-500/10 text-yellow-600",
  error: "bg-red-500/10 text-red-600",
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    iconColors[activity.status]
                  }`}
                >
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
