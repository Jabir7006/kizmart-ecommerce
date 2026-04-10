import { useState } from "react";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Award,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/productType";
import { useAddToCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/useCartStore";
import { getProductPricing } from "@/lib/productPricing";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

const ProductInfo = ({ product, quantity, onQuantityChange }: ProductInfoProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const addToCart = useAddToCart();

  const {
    title,
    shortDescription,
    price,
    salePrice,
    ratings,
    numReviews,
    category,
    brand,
    status,
    quantity: stockQuantity,
    _id,
  } = product;
  const { badge, discountPercentage, displayPrice, originalPrice } =
    getProductPricing({
      price,
      salePrice,
    });

  const isOutOfStock = stockQuantity <= 0 || status !== "active";

  const handleIncrement = () => {
    if (quantity < stockQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Badge + Category row */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-3">
        {badge && (
          <span
            className={`text-white text-[9px] sm:text-xs font-medium sm:font-semibold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded inline-block uppercase tracking-wide sm:tracking-wider shadow-sm ${
              badge === "Sale" ? "bg-rose-600" : "bg-purple-800"
            }`}
          >
            {badge}
          </span>
        )}
        {category && (
          <span className="text-[9px] sm:text-xs font-medium sm:font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wide sm:tracking-wider">
            {category?.title}
          </span>
        )}
      </div>

      {/* Title — lighter weight on small screens */}
      <h1 className="text-base sm:text-2xl lg:text-4xl font-semibold sm:font-bold text-gray-900 leading-snug sm:leading-tight mb-1 sm:mb-4">
        {title}
      </h1>

      {/* Brand */}
      <p className="text-[11px] sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
        Brand: <span className="font-medium sm:font-semibold text-blue-600">{brand?.title || "No Brand"}</span>
      </p>

      {/* Rating / Reviews / Stock — compact single line */}
      <div className="flex items-center gap-1.5 sm:gap-4 mb-2 sm:mb-6 flex-wrap">
        <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full">
          <span className="font-medium sm:font-bold text-[11px] sm:text-sm text-gray-800">
            {ratings?.toFixed(1) || "0.0"}
          </span>
          <Star className="h-2.5 w-2.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
        </div>
        <a
          href="#reviews"
          className="text-[11px] sm:text-sm text-gray-500 font-normal sm:font-medium hover:text-blue-600 hover:underline cursor-pointer transition-colors"
        >
          {numReviews || 0} reviews
        </a>
        <span
          className={`text-[11px] sm:text-sm font-medium sm:font-semibold px-1 py-0.5 sm:px-2 rounded ${isOutOfStock ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      {/* Price — compact on mobile, no heavy background */}
      <div className="flex items-baseline gap-1.5 sm:gap-3 mb-2 sm:mb-6 sm:bg-gray-50/50 sm:p-4 sm:rounded-xl sm:border sm:border-gray-100">
        <p className="font-semibold sm:font-bold text-xl sm:text-4xl lg:text-5xl text-orange-500 tracking-tight">
          ৳{displayPrice.toLocaleString()}
        </p>
        {discountPercentage !== null && originalPrice !== null && (
          <>
            <p className="text-gray-400 line-through text-xs sm:text-base">
              ৳{originalPrice.toLocaleString()}
            </p>
            <span className="text-green-600 font-medium sm:font-bold text-[10px] sm:text-sm bg-green-100 px-1 py-0.5 sm:px-2 rounded-sm">
              -{discountPercentage}%
            </span>
          </>
        )}
      </div>

      {/* Short description — collapsible on mobile */}
      {shortDescription && (
        <div className="mb-2 sm:mb-8">
          <p
            className={`text-gray-600 text-xs sm:text-base leading-relaxed ${
              !isDescExpanded ? "line-clamp-2 sm:line-clamp-none" : ""
            }`}
          >
            {shortDescription}
          </p>
          {shortDescription.length > 100 && (
            <button
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="sm:hidden text-blue-600 text-[11px] font-medium mt-0.5 flex items-center gap-0.5"
            >
              {isDescExpanded ? "Show less" : "Read more"}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isDescExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      )}

      <div className="w-full h-px bg-gray-200 mb-2 sm:mb-8" />

      {/* Quantity selector — compact on mobile */}
      <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-6">
        <span className="text-[11px] sm:text-sm font-medium sm:font-semibold text-gray-700">
          Quantity
        </span>
        <div className="flex items-center border border-gray-200 rounded-md sm:rounded-lg bg-white overflow-hidden shadow-sm">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1 || isOutOfStock}
            className="p-1.5 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <span className="w-8 sm:w-12 text-center font-medium sm:font-semibold text-gray-800 text-xs sm:text-lg">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= stockQuantity || isOutOfStock}
            className="p-1.5 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <span className="text-[9px] sm:text-xs text-gray-500">
          {!isOutOfStock ? `${stockQuantity} available` : "0 available"}
        </span>
      </div>

      {/* Action buttons — hidden on mobile (moved to sticky bar), visible on sm+ */}
      <div className="hidden sm:flex flex-col sm:flex-row gap-4 mb-6">
        <Button
          size="lg"
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-base group py-2 cursor-pointer disabled:opacity-50"
          disabled={isOutOfStock || addToCart.isPending}
          onClick={() => {
            addToCart.mutate(
              { productId: _id, quantity },
              {
                onSuccess: () => {
                  setIsOpen(true);
                },
              },
            );
          }}
        >
          <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:-rotate-12" />
          {addToCart.isPending ? "Adding..." : "Add to Cart"}
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

      {/* Trust Badges — real icons */}
      <div className="grid grid-cols-4 gap-1 sm:gap-4 py-3 sm:py-6 border-y border-gray-100">
        <div className="flex flex-col items-center justify-center text-center gap-1 sm:gap-2">
          <div className="bg-orange-50 p-1.5 sm:p-2.5 rounded-full">
            <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <span className="text-[9px] sm:text-xs font-normal sm:font-medium text-gray-600 leading-tight">
            Free Shipping
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-1 sm:gap-2">
          <div className="bg-green-50 p-1.5 sm:p-2.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <span className="text-[9px] sm:text-xs font-normal sm:font-medium text-gray-600 leading-tight">
            Secure Payment
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-1 sm:gap-2">
          <div className="bg-blue-50 p-1.5 sm:p-2.5 rounded-full">
            <RotateCcw className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <span className="text-[9px] sm:text-xs font-normal sm:font-medium text-gray-600 leading-tight">
            Easy Return
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-1 sm:gap-2">
          <div className="bg-amber-50 p-1.5 sm:p-2.5 rounded-full">
            <Award className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-500" />
          </div>
          <span className="text-[9px] sm:text-xs font-normal sm:font-medium text-gray-600 leading-tight">
            Top Quality
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
