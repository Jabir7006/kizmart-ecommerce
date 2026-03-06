import { Outlet } from "react-router-dom";
import Header from "@/components/header/Header";

const MainLayout = () => {
  return (
    <div className="min-h-svh flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
