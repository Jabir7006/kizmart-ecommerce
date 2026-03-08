import { Outlet } from "react-router-dom";
import Header from "@/components/header/Header";
import CartDrawer from "@/components/cart/CartDrawer";

const MainLayout = () => {
  return (
    <div className="min-h-svh flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
