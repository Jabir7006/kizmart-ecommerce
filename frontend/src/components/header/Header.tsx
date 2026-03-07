import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import NavLinks from "./NavLinks";
import CartButton from "./CartButton";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

/* ─── top promo bar ─── */

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs font-medium">
        <p className="hidden sm:block">🔥 Free Shipping on orders above ৳999</p>
        <p className="sm:hidden text-center w-full">
          🔥 Free Shipping above ৳999
        </p>
        <div className="hidden sm:flex items-center gap-4">
          <Link
            to="/track-order"
            className="hover:text-accent transition-colors"
          >
            Track Order
          </Link>
          <span className="text-primary-foreground/30">|</span>
          <Link to="/help" className="hover:text-accent transition-colors">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ─── main header row ─── */

const MainRow = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-background border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* mobile menu */}
        <MobileMenu />

        {/* logo */}
        <Logo />

        {/* center section — search */}
        <div className="flex-1 flex justify-center px-4 sm:px-6">
          <SearchBar
            className="hidden md:flex w-full max-w-2xl"
            placeholder="Search for dresses, cosmetics, watches…"
            inputClassName="h-10"
          />
        </div>

        {/* action icons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex text-foreground hover:text-primary hover:bg-primary/10"
            asChild
          >
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          <CartButton />

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild size="sm" className="sm:inline-flex ml-2">
              <Link to="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── mobile search bar (always visible, below main row) ─── */

const MobileSearchBar = () => {
  return (
    <div className="md:hidden bg-background border-b px-4 py-2">
      <SearchBar inputClassName="h-9" />
    </div>
  );
};

/* ─── bottom nav bar (desktop only) ─── */

const BottomNav = () => {
  return (
    <div className="hidden lg:block border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-8 h-11">
          <NavLinks />
        </nav>
      </div>
    </div>
  );
};

/* ─── composed header ─── */

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      <TopBar />
      <MainRow />
      <MobileSearchBar />
      <BottomNav />
    </header>
  );
};

export default Header;
