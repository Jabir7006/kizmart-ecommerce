import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Layout,
  Image,
} from 'lucide-react';
import type { LucideIcon } from "lucide-react";

export interface NavItemConfig {
  icon: LucideIcon;
  label: string;
  href: string;
  id: string;
}

export const navItems: NavItemConfig[] = [
  {
    id: "home",
    icon: LayoutDashboard,
    label: "Home",
    href: "/admin",
  },
  {
    id: "products",
    icon: Package,
    label: "Products",
    href: "/admin/products",
  },
  {
    id: "categories",
    icon: Layout,
    label: "Categories",
    href: "/admin/categories",
  },
  {
    id: "banners",
    icon: Image,
    label: "Banners",
    href: "/admin/banners",
  },
  {
    id: "orders",
    icon: ShoppingCart,
    label: "Orders",
    href: "/admin/orders",
  },
];

export const bottomNavItems: NavItemConfig[] = [
  {
    id: "logout",
    icon: LogOut,
    label: "Sign Out",
    href: "/logout",
  },
];

export const DASHBOARD_ICON = LayoutDashboard;
