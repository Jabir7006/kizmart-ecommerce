import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { useCartQuery } from "@/hooks/useCart";

const CartButton = () => {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { data: cart } = useCartQuery();
  
  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-foreground hover:text-primary hover:bg-primary/10"
      onClick={toggleCart}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px] leading-none flex items-center justify-center bg-secondary text-secondary-foreground border-0 font-bold">
          {totalItems}
        </Badge>
      )}
      <span className="sr-only">Cart</span>
    </Button>
  );
};

export default CartButton;
