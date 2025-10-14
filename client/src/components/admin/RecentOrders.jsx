import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { Link } from "react-router-dom";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    amount: "$299.00",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    amount: "$149.00",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    amount: "$499.00",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    amount: "$199.00",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    amount: "$349.00",
    status: "completed",
    date: "2024-01-13",
  },
];

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your store</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/orders">View all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{order.customer}</p>
                <p className="text-xs text-muted-foreground">
                  {order.id} • {order.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{order.amount}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
