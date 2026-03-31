import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductStore } from "@/store/useProductStore";
import { Star } from "lucide-react";
import { useAddToCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/useCartStore";
import { getImageUrl } from "@/lib/getImageUrl";

const QuickViewDialog = () => {
  const { selectedProduct, setSelectedProduct } = useProductStore();
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const addToCart = useAddToCart();

  if (!selectedProduct) return null;

  const {
    title,
    shortDescription,
    thumbnail,
    price,
    ratings,
    numReviews,
    _id,
  } = selectedProduct;

  const productBadge = (selectedProduct as any).badge;
  const productDiscount = (selectedProduct as any).discountPercentage;
  const productOriginalPrice = (selectedProduct as any).originalPrice;

  const badge = productBadge || "New";
  const discountPercentage = productDiscount || 25;
  const originalPrice = productOriginalPrice || Math.round(price * 1.33);

  return (
    <Dialog
      open={!!selectedProduct}
      onOpenChange={(open) => !open && setSelectedProduct(null)}
    >
      <DialogContent className="w-[95vw] max-w-lg md:max-w-[800px] max-h-[90vh] p-0 gap-0 border-none shadow-2xl rounded-2xl flex flex-col overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto w-full h-full">
          {/* Image Section */}
          <div className="bg-gray-50 p-4 sm:p-8 flex items-center justify-center min-h-[250px] md:min-h-[450px]">
            <img
              src={getImageUrl(thumbnail, "mobile", "/placeholder.svg")}
              alt={title}
              className="w-full h-auto object-contain max-h-[220px] md:max-h-[350px] mix-blend-multiply transition-transform hover:scale-105 duration-500 rounded-md"
            />
          </div>

          {/* Content Section */}
          <div className="p-5 sm:p-8 flex flex-col justify-center bg-white">
            {badge && (
              <span className="bg-purple-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded inline-block w-max mb-4 uppercase tracking-wider">
                {badge}
              </span>
            )}

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3 line-clamp-2">
              {title}
            </h2>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      i < Math.floor(ratings || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                ({numReviews || 0} reviews)
              </span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <p className="font-bold text-4xl text-orange-500">৳{price}</p>
              {discountPercentage && (
                <div className="flex flex-col mb-1">
                  <p className="text-gray-400 line-through text-sm leading-none mb-1 text-left">
                    ৳{originalPrice}
                  </p>
                  <p className="text-green-600 font-bold text-sm leading-none">
                    {discountPercentage}% OFF
                  </p>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-gray-100 mb-6" />

            <p className="text-gray-600 text-sm mb-8 line-clamp-4 leading-relaxed">
              {shortDescription ||
                "No description available for this product. Explore the features and specifications to learn more about what makes it special."}
            </p>

            <button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold flex-1 py-3.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              onClick={() => {
                addToCart.mutate(
                  { productId: _id, quantity: 1 },
                  {
                    onSuccess: () => {
                      setSelectedProduct(null);
                      setIsOpen(true);
                    },
                  },
                );
              }}
              disabled={addToCart.isPending}
            >
              {addToCart.isPending ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewDialog;
