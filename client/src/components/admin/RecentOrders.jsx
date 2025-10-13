import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    avatar: "",
    product: "Wireless Headphones",
    amount: "$299.00",
    status: "completed",
    date: "2 min ago",
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    email: "sarah@example.com",
    avatar: "",
    product: "Smart Watch Pro",
    amount: "$499.00",
    status: "processing",
    date: "15 min ago",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    avatar: "",
    product: "Gaming Keyboard",
    amount: "$159.00",
    status: "completed",
    date: "1 hour ago",
  },
  {
    id: "ORD-004",
    customer: "Emma Wilson",
    email: "emma@example.com",
    avatar: "",
    product: "Laptop Stand",
    amount: "$79.00",
    status: "pending",
    date: "2 hours ago",
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    email: "david@example.com",
    avatar: "",
    product: "USB-C Hub",
    amount: "$49.00",
    status: "completed",
    date: "3 hours ago",
  },
];

const statusVariants = {
  completed: "success",
  processing: "warning",
  pending: "secondary",
  cancelled: "destructive",
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          You have {recentOrders.length} orders today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={order.avatar} alt={order.customer} />
                      <AvatarFallback>
                        {order.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {order.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
