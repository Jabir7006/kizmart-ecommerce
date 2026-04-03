import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem as CartItemType } from "@/types/cartType";
import { useUpdateCartQuantity, useRemoveFromCart } from "@/hooks/useCart";
import { getProductPricing } from "@/lib/productPricing";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();
  const { displayPrice, originalPrice, discountPercentage, hasDiscount } =
    getProductPricing({
      price: item.product.price,
      salePrice:
        item.price < item.product.price
          ? item.price
          : item.product.salePrice,
    });
  const lineTotal = displayPrice * item.quantity;
  const originalLineTotal =
    hasDiscount && originalPrice !== null ? originalPrice * item.quantity : null;

  const handleUpdateQuantity = (
    productId: string,
    currentQty: number,
    change: number
  ) => {
    const newQty = currentQty + change;
    if (newQty < 1) {
      removeFromCart.mutate(productId);
      return;
    }
    updateQuantity.mutate({ productId, quantity: change });
  };

  return (
    <div className="flex gap-4">
      {/* Product Image */}
      <div className="h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0 border">
        <img
          src={item.product?.thumbnail?.secureUrl}
          alt={item.product?.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Details & Actions */}
      <div className="flex flex-col flex-1 justify-between py-0.5">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">
            {item.product?.title}
          </h4>
          <div className="shrink-0 mt-0.5 text-right">
            <p className="font-semibold text-sm">
              ৳{lineTotal.toLocaleString()}
            </p>
            {originalLineTotal !== null && discountPercentage !== null && (
              <p className="text-[11px] text-muted-foreground">
                <span className="line-through">
                  ৳{originalLineTotal.toLocaleString()}
                </span>
                <span className="ml-1 font-medium text-emerald-600">
                  {discountPercentage}% OFF
                </span>
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          ৳{displayPrice.toLocaleString()} each
          {originalPrice !== null && (
            <span className="ml-1 line-through">
              ৳{originalPrice.toLocaleString()}
            </span>
          )}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {/* Quantity Controls */}
          <div className="flex items-center border rounded-md h-8">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-8 rounded-none hover:bg-muted"
              onClick={() =>
                handleUpdateQuantity(item.product._id, item.quantity, -1)
              }
              disabled={updateQuantity.isPending}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 flex items-center justify-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-8 rounded-none hover:bg-muted"
              onClick={() =>
                handleUpdateQuantity(item.product._id, item.quantity, 1)
              }
              disabled={updateQuantity.isPending}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => removeFromCart.mutate(item.product._id)}
            disabled={removeFromCart.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
