import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CartButton = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-foreground hover:text-primary hover:bg-primary/10"
      asChild
    >
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        <Badge className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px] leading-none flex items-center justify-center bg-secondary text-secondary-foreground border-0 font-bold">
          0
        </Badge>
        <span className="sr-only">Cart</span>
      </Link>
    </Button>
  );
};

export default CartButton;
