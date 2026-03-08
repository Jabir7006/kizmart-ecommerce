import { Navigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useEffect } from "react";

const CartPage = () => {
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  
  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return <Navigate to="/" replace />;
}

export default CartPage;