import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useAuthStore } from "@/store/useAuthStore";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-foreground hover:text-primary hover:bg-primary/10"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          {/* logo */}
          <div className="flex items-center border-b px-4 py-3">
            <Logo />
          </div>

          {/* nav */}
          <nav className="flex flex-col gap-1 px-4 py-3">
            <NavLinks onClick={() => setOpen(false)} variant="mobile" />
          </nav>

          {/* footer auth */}
          <div className="mt-auto border-t px-4 py-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link to="/signin" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    Create Account
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
