import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/header/Header";
import { useCartStore } from "@/store/useCartStore";

const CartDrawer = lazy(() => import("@/components/cart/CartDrawer"));
const Footer = lazy(() => import("@/components/home/Footer"));

const MainLayout = () => {
  const isCartOpen = useCartStore((state) => state.isOpen);

  return (
    <div className="min-h-svh flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      {isCartOpen ? (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      ) : null}
    </div>
  );
};

export default MainLayout;
