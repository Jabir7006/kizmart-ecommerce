import { cn } from "@/lib/utils";
import type { NavItemConfig } from "./nav-items";
import { Link } from "react-router-dom";

interface NavItemProps extends NavItemConfig {
  isActive?: boolean;
  isCollapsed: boolean;
}

export const NavItem = ({
  icon: Icon,
  label,
  href,
  isActive = false,
  isCollapsed,
}: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group whitespace-nowrap",
      isActive
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
      isCollapsed ? "justify-center" : "justify-start",
    )}
    title={isCollapsed ? label : undefined}
  >
    <Icon className="h-5 w-5 shrink-0" />
    {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
  </Link>
);
