import type { Product } from "@/types/productType";
import { Link } from "react-router-dom";
import { Star, Eye, ShoppingCart } from "lucide-react";
import placeholderSvg from "@/assets/product-placeholder.svg";
import { useProductStore } from "@/store/useProductStore";
import { useAddToCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/useCartStore";

const ProductCard = ({ product }: { product: Product | any }) => {
  const { title, slug, price, thumbnail, _id } = product;

  const imageSrc = thumbnail?.secureUrl || placeholderSvg;
  const rating = product.ratings || 0;
  const reviewCount = product.numReviews || 0;

  // we will implement badge and discountPercentage later
  const badge = product.badge || "New";
  const discountPercentage = product.discountPercentage || 25;
  const originalPrice = product.originalPrice || Math.round(price * 1.33);

  const setSelectedProduct = useProductStore(
    (state) => state.setSelectedProduct,
  );
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const addToCart = useAddToCart();

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart.mutate(
      { productId: _id, quantity: 1 },
      {
        onSuccess: () => {
          setIsOpen(true);
        },
      },
    );
  };

  return (
    <Link to={`/product/${slug}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
          {badge && (
            <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded">
              {badge}
            </div>
          )}

          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow hover:bg-primary group/cart transition-colors cursor-pointer disabled:opacity-50"
              title="Quick View"
            >
              <Eye className="w-4 h-4 text-gray-700 group-hover/cart:text-white transition-colors" />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="p-2 bg-white rounded-full shadow hover:bg-primary group/cart transition-colors cursor-pointer disabled:opacity-50"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 text-gray-700 group-hover/cart:text-white transition-colors" />
            </button>
          </div>
        </div>
        <div className="p-2">
          <h3 className="text-[11px] xs:text-[13px] sm:text-sm text-gray-800 line-clamp-2 min-h-[2.5em] leading-tight font-medium">
            {title}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="font-bold text-xs xs:text-[13px] sm:text-base text-orange-500">
                ৳{price}
              </p>
              {discountPercentage && (
                <p className="text-[10px] xs:text-xs text-gray-500">
                  <span className="line-through">৳{originalPrice}</span>
                  <span className="ml-1 text-green-600">
                    -{discountPercentage}%
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                      i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] xs:text-[11px] text-gray-500">
                ({reviewCount})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
