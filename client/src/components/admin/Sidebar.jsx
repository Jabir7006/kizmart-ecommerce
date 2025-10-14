import React from "react";
import { cn } from "@/lib/utils";
import { Button, ScrollArea, Separator } from "@/components/ui";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Tag,
  ShoppingBag,
  FileText,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    active: true,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
    badge: "12",
  },
  {
    title: "Products",
    icon: Package,
    href: "/admin/products",
  },
  {
    title: "Categories",
    icon: Layers,
    href: "/admin/categories",
  },
  {
    title: "Brands",
    icon: Tag,
    href: "/admin/brands",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/admin/customers",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    title: "Inventory",
    icon: ShoppingBag,
    href: "/admin/inventory",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/admin/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div
      className={cn(
        " sticky top-0 flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">AdminPanel</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingBag className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.href}>
              {index === menuItems.length - 1 && <Separator className="my-2" />}
              <Link to={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start cursor-pointer",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="ml-3">{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>

      {/* User Info */}
      {!collapsed && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-semibold">AD</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium">Admin User</p>
              <p className="truncate text-xs text-muted-foreground">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
