import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Store", href: "/store" },
  { label: "My Account", href: "/account" },
  { label: "My Orders", href: "/account/orders" },
] as const;

const CUSTOMER_SERVICE = [
  { label: "Contact Us", href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Returns & Refunds", href: "#" },
  { label: "FAQ", href: "#" },
] as const;

const FooterLinkGroup = ({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) => (
  <div>
    <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
    <ul className="space-y-2">
      {links.map(({ label, href }) => (
        <li key={label}>
          <Link
            to={href}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Your one-stop destination for quality products at the best prices.
              Shop with confidence.
            </p>
          </div>

          <FooterLinkGroup title="Quick Links" links={QUICK_LINKS} />
          <FooterLinkGroup title="Customer Service" links={CUSTOMER_SERVICE} />

          {/* Contact column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>jabirahmad7005@gmail.com</li>
              <li>+880 1234-567890</li>
              <li>Jessore, Bangladesh</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {currentYear} Kizmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
