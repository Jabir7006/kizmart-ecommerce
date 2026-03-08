import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { useCartStore } from "@/store/useCartStore";
import { useCartQuery, useClearCart } from "@/hooks/useCart";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const { isOpen, setIsOpen } = useCartStore();
  const { data: cartItems, isLoading } = useCartQuery();
  const clearCart = useClearCart();

  const hasItems = cartItems?.items && cartItems.items.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-background/95 backdrop-blur-xl p-0">
        <SheetHeader className="px-6 py-4 border-b bg-background">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <span className="text-muted-foreground text-sm">Loading cart...</span>
            </div>
          ) : !hasItems ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Your cart is empty.</p>
              <Button variant="outline" onClick={() => setIsOpen(false)} asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>

        {hasItems && (
          <SheetFooter className="flex-col gap-4 sm:flex-col p-6 bg-background border-t">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>৳{cartItems?.totalPrice || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex flex-col gap-2.5">
              <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => clearCart.mutate()}
                disabled={clearCart.isPending}
              >
                Clear Cart
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
