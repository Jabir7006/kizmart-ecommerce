import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const topProducts = [
  {
    name: "Wireless Headphones Pro",
    category: "Electronics",
    sales: 1234,
    revenue: "$369,200",
    trend: "+12%",
    stock: 45,
  },
  {
    name: "Smart Watch Series 5",
    category: "Wearables",
    sales: 987,
    revenue: "$492,513",
    trend: "+8%",
    stock: 23,
  },
  {
    name: "Gaming Keyboard RGB",
    category: "Accessories",
    sales: 756,
    revenue: "$120,156",
    trend: "+15%",
    stock: 67,
  },
  {
    name: "4K Webcam Ultra",
    category: "Electronics",
    sales: 654,
    revenue: "$130,800",
    trend: "+5%",
    stock: 12,
  },
  {
    name: "Ergonomic Mouse Pad",
    category: "Accessories",
    sales: 543,
    revenue: "$16,290",
    trend: "+20%",
    stock: 156,
  },
];

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.sales} sales
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{product.revenue}</div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="success" className="text-xs">
                    {product.trend}
                  </Badge>
                  <span className="text-muted-foreground">
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
