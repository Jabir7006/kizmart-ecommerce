import { Link } from "react-router-dom";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "Admin", href: "/admin" },
] as const;

interface NavLinksProps {
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}

const NavLinks = ({ onClick, variant = "desktop" }: NavLinksProps) => {
  if (variant === "mobile") {
    return (
      <>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            to={href}
            onClick={onClick}
            className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            {label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {NAV_LINKS.map(({ label, href }) => (
        <Link
          key={href}
          to={href}
          onClick={onClick}
          className="relative px-1 py-1 text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
        >
          {label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
