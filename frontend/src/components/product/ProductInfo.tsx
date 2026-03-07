import { useState } from "react";
import { Star, Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/productType";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    title,
    shortDescription,
    price,
    ratings,
    numReviews,
    status,
    quantity: stockQuantity,
  } = product;

  // Derive badge and original price similar to QuickView
  const productBadge = (product as any).badge;
  const productDiscount = (product as any).discountPercentage;
  const productOriginalPrice = (product as any).originalPrice;

  const badge = productBadge; // Might be undefined, handled conditionally
  const discountPercentage = productDiscount || 25;
  const originalPrice = productOriginalPrice || Math.round(price * 1.33);

  const isOutOfStock = stockQuantity <= 0 || status !== "active";

  const handleIncrement = () => {
    if (quantity < stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {badge && (
        <span className="bg-purple-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded inline-block w-max mb-4 uppercase tracking-wider shadow-sm">
          {badge}
        </span>
      )}

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
        {title}
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <span className="font-bold text-sm text-gray-800">
            {ratings?.toFixed(1) || "0.0"}
          </span>
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        <span className="text-sm text-gray-500 font-medium hover:text-blue-600 hover:underline cursor-pointer transition-colors">
          {numReviews || 0} reviews
        </span>
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        <span
          className={`text-sm font-semibold px-2 py-0.5 rounded ${isOutOfStock ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      <div className="flex items-end gap-3 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
        <p className="font-bold text-4xl lg:text-5xl text-orange-500 tracking-tight">
          ₹{price}
        </p>
        {discountPercentage && (
          <div className="flex flex-col mb-1.5 border-l-2 border-gray-200 pl-3 ml-1">
            <p className="text-gray-400 line-through text-base leading-none mb-1 text-left">
              ₹{originalPrice}
            </p>
            <p className="text-green-600 font-bold text-sm leading-none bg-green-100 px-2 py-0.5 rounded-sm inline-flex items-center">
              {discountPercentage}% OFF
            </p>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-base mb-8 leading-relaxed">
        {shortDescription}
      </p>

      <div className="w-full h-px bg-gray-200 mb-8" />

      {/* Actions */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 min-w-[80px]">
            Quantity
          </span>
          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-semibold text-gray-800 text-lg">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= stockQuantity || isOutOfStock}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {!isOutOfStock ? `Only ${stockQuantity} left` : "0 available"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Button
            size="lg"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-base group py-2 cursor-pointer"
            disabled={isOutOfStock}
          >
            <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:-rotate-12" />
            Add to Cart
          </Button>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              className={`h-14 w-14 rounded-xl border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors shadow-sm ${isWishlisted ? "text-red-500 border-red-200 bg-red-50" : "text-gray-600"}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""}`}
              />
              <span className="sr-only">Add to wishlist</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-xl border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm text-gray-600"
            >
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share product</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Trust Badges placeholder */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100">
        {/* Simple placeholders representing free shipping, return policy, etc */}
        <div className="flex flex-col items-center justify-center text-center gap-2 max-w-[120px] mx-auto opacity-70">
          <div className="bg-gray-100 p-2.5 rounded-full">
            <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
          </div>
          <span className="text-xs font-medium text-gray-600">
            Free Shipping
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-2 max-w-[120px] mx-auto opacity-70">
          <div className="bg-gray-100 p-2.5 rounded-full">
            <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
          </div>
          <span className="text-xs font-medium text-gray-600">
            Secure Payment
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-2 max-w-[120px] mx-auto opacity-70">
          <div className="bg-gray-100 p-2.5 rounded-full">
            <div className="w-5 h-5 bg-gray-400 rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-xs font-medium text-gray-600">
            30 Days Return
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-2 max-w-[120px] mx-auto opacity-70">
          <div className="bg-gray-100 p-2.5 rounded-full">
            <div className="w-5 h-5 bg-gray-400 clip-star clip-path-polygon-[50%_0%,_61%_35%,_98%_35%,_68%_57%,_79%_91%,_50%_70%,_21%_91%,_32%_57%,_2%_35%,_39%_35%]"></div>
          </div>
          <span className="text-xs font-medium text-gray-600">Top Quality</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
