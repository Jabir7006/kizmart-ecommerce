import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from "@/components/ui";
import { Link } from "react-router-dom";

const topProducts = [
  { name: "Wireless Headphones", sales: 234, revenue: "$23,400" },
  { name: "Smart Watch", sales: 189, revenue: "$37,800" },
  { name: "Laptop Stand", sales: 156, revenue: "$7,800" },
  { name: "USB-C Cable", sales: 145, revenue: "$2,900" },
  { name: "Phone Case", sales: 134, revenue: "$4,020" },
];

export default function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/products">View all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.sales} sales
                </p>
              </div>
              <span className="text-sm font-medium">{product.revenue}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
