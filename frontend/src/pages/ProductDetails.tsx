import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSimilarProducts, useSingleProduct } from "@/hooks/useProduct";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductList from "@/components/product/ProductList";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import { useAddToCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/useCartStore";
import { getProductPricing } from "@/lib/productPricing";
import { ShoppingCart, Heart } from "lucide-react";

const ProductDetails = () => {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useSingleProduct(slug!);
  const similarProductsQuery = useSimilarProducts(slug!, 8);
  const similarProducts = similarProductsQuery.data ?? [];

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addToCart = useAddToCart();
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size={40} className="text-orange-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
        <p className="text-gray-600">
          {error?.message || "Product not found."}
        </p>
      </div>
    );
  }

  const { displayPrice, originalPrice, discountPercentage } =
    getProductPricing({ price: product.price, salePrice: product.salePrice });
  const isOutOfStock =
    product.quantity <= 0 || product.status !== "active";

  return (
    <div className="bg-white min-h-screen pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8 md:py-12">
        {/* Main Product Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Gallery */}
          <div className="w-full lg:sticky lg:top-24">
            <ProductGallery
              thumbnail={product.thumbnail}
              gallery={product.gallery}
              title={product.title}
            />
          </div>

          {/* Right Column: Info */}
          <div className="w-full px-3 sm:px-0 pt-3 sm:pt-0">
            <ProductInfo
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
            />
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="mt-8 sm:mt-16 lg:mt-24 pt-6 sm:pt-12 border-t border-gray-100 px-3 sm:px-0">
          <div className="max-w-4xl">
            <h3 className="text-base sm:text-2xl font-semibold sm:font-bold text-gray-900 mb-3 sm:mb-6">
              Product Overview
            </h3>
            <div className="prose prose-sm sm:prose-orange max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {product.longDescription}
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-0">
          <ProductReviewsSection product={product} />
        </div>

        <div className="mt-8 sm:mt-16 lg:mt-24 pt-6 sm:pt-12 border-t border-gray-100 px-3 sm:px-0">
          <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-2xl font-semibold sm:font-bold text-gray-900">
                You May Also Like
              </h3>
            </div>
          </div>

          <ProductList
            products={similarProducts}
            productsQuery={similarProductsQuery}
            className="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          />
        </div>
      </div>

      {/* Sticky Bottom Action Bar — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2 px-3 py-2 max-w-screen-sm mx-auto">
          {/* Wishlist */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
              isWishlisted
                ? "text-red-500 bg-red-50"
                : "text-gray-500 bg-gray-50"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-4.5 w-4.5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>

          {/* Price */}
          <div className="flex flex-col min-w-0 shrink-0">
            <span className="text-sm font-semibold text-orange-500 leading-tight">
              ৳{displayPrice.toLocaleString()}
            </span>
            {originalPrice !== null && discountPercentage !== null && (
              <span className="text-[9px] text-gray-400 line-through leading-tight">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart button — uses shared quantity state */}
          <button
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold h-10 rounded-lg transition-colors disabled:opacity-50 text-sm"
            disabled={isOutOfStock || addToCart.isPending}
            onClick={() => {
              addToCart.mutate(
                { productId: product._id, quantity },
                {
                  onSuccess: () => {
                    setIsOpen(true);
                  },
                },
              );
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {addToCart.isPending ? "Adding..." : `Add to Cart${quantity > 1 ? ` (${quantity})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
