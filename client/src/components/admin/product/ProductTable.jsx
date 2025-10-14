import React from "react";
import ProductAction from "./ProductAction";
import { TableCell, TableRow, Badge } from "@/components/ui";

const ProductTable = ({ product }) => {
  const {
    id,
    title,
    images,
    price,
    discount,
    discountType,
    stockStatus,
    quantity,
    
  } = product;

  return (
    <TableRow key={product.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <img
            src={images[0]?.url || "/placeholder.svg"}
            alt={title}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{title}</p>
              {product.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{id}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>{product.brand}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">${price.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-xs text-muted-foreground">
              {discountType === "percentage"
                ? `${discount}% off`
                : `$${discount} off`}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span
          className={
            stockStatus === "out of stock"
              ? "text-destructive font-medium"
              : stockStatus === "low stock"
              ? "text-orange-600 font-medium"
              : ""
          }
        >
          {quantity} units
        </span>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            stockStatus === "in stock"
              ? "success"
              : stockStatus === "low stock"
              ? "warning"
              : "outline"
          }
        >
          {stockStatus}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <ProductAction />
      </TableCell>
    </TableRow>
  );
};

export default ProductTable;
