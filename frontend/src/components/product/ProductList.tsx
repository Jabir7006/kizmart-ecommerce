import type { PaginatedProducts, Product } from "@/types/productType";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import type { UseQueryResult } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const ProductList = ({
  products,
  productsQuery,
  prioritizeFirst = false,
}: {
  products: Product[];
  productsQuery?: UseQueryResult<PaginatedProducts, Error>;
  prioritizeFirst?: boolean;
}) => {
  if (productsQuery?.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (productsQuery?.isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 my-4 text-center bg-red-50 rounded-lg border border-red-100 col-span-full">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <h3 className="text-sm font-semibold text-red-800">
          Failed to load products
        </h3>
        <p className="text-xs text-red-600 mt-1 max-w-sm">
          {productsQuery.error?.message ||
            "An unexpected error occurred while fetching products."}
        </p>
      </div>
    );
  }

  if (products.length === 0 && !productsQuery?.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 my-4 text-center bg-gray-50 rounded-lg border border-gray-100 col-span-full">
        <h3 className="text-sm font-semibold text-gray-800">
          No products found
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={prioritizeFirst && index === 0}
        />
      ))}
    </div>
  );
};

export default ProductList;
