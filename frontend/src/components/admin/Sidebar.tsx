"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "./NavItem";
import { navItems, bottomNavItems, DASHBOARD_ICON } from "./nav-items";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const DashboardIcon = DASHBOARD_ICON;

export default function Sidebar({
  className,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed md:static flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out z-50 md:z-10",
          isCollapsed ? "w-20" : "w-64",
          !isOpen && "hidden md:flex",
          className,
        )}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-7 hidden md:flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background hover:bg-accent text-muted-foreground transition-colors z-20"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Logo Section */}
        <div
          className={cn(
            "flex items-center p-6 mb-2",
            isCollapsed ? "justify-center px-4" : "justify-start",
          )}
        >
          <div className="flex items-center gap-3 text-foreground">
            <DashboardIcon className="h-6 w-6 shrink-0" />
            {!isCollapsed && (
              <span className="font-semibold tracking-tight text-lg">
                Dashboard
              </span>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.id} {...item} isCollapsed={isCollapsed} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-border">
          {bottomNavItems.map((item) => (
            <NavItem key={item.id} {...item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </aside>
    </>
  );
}
