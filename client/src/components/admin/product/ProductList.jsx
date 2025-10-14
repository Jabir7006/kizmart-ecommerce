import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui";
import { Search } from "lucide-react";

import ProductTable from "./ProductTable";
const ProductList = () => {
  const initialProducts = [
    {
      id: "PRD-001",
      title: "Wireless Headphones",
      slug: "wireless-headphones",
      description:
        "Premium noise-cancelling wireless headphones with superior sound quality",
      price: 299.99,
      discountType: "percentage",
      discount: 10,
      images: [
        {
          public_id: "headphones-1",
          url: "/diverse-people-listening-headphones.png",
        },
      ],
      category: "Electronics",
      brand: "AudioTech",
      quantity: 45,
      stockStatus: "in stock",
      sold: 128,
      isFeatured: true,
    },
    {
      id: "PRD-002",
      title: "Smart Watch",
      slug: "smart-watch",
      description:
        "Fitness tracking smartwatch with heart rate monitor and GPS",
      price: 199.99,
      discountType: "fixed",
      discount: 20,
      images: [{ public_id: "watch-1", url: "/modern-smartwatch.png" }],
      category: "Electronics",
      brand: "TechWear",
      quantity: 32,
      stockStatus: "in stock",
      sold: 89,
      isFeatured: false,
    },
    {
      id: "PRD-003",
      title: "Laptop Stand",
      slug: "laptop-stand",
      description: "Ergonomic aluminum laptop stand for better posture",
      price: 49.99,
      discountType: "percentage",
      discount: 0,
      images: [{ public_id: "stand-1", url: "/laptop-stand.png" }],
      category: "Accessories",
      brand: "ErgoDesk",
      quantity: 78,
      stockStatus: "in stock",
      sold: 234,
      isFeatured: false,
    },
    {
      id: "PRD-004",
      title: "USB-C Cable",
      slug: "usb-c-cable",
      description: "Fast charging USB-C cable 6ft with braided design",
      price: 19.99,
      discountType: "percentage",
      discount: 5,
      images: [{ public_id: "cable-1", url: "/usb-cable.png" }],
      category: "Accessories",
      brand: "ChargeFast",
      quantity: 156,
      stockStatus: "in stock",
      sold: 567,
      isFeatured: false,
    },
    {
      id: "PRD-005",
      title: "Phone Case",
      slug: "phone-case",
      description: "Protective silicone phone case with shock absorption",
      price: 29.99,
      discountType: "percentage",
      discount: 0,
      images: [
        { public_id: "case-1", url: "/colorful-phone-case-display.png" },
      ],
      category: "Accessories",
      brand: "SafeGuard",
      quantity: 5,
      stockStatus: "low stock",
      sold: 423,
      isFeatured: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Products</CardTitle>
            <CardDescription>
              View and manage your product catalog
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialProducts.map((product) => (
              <ProductTable key={product.id} product={product} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductList;
