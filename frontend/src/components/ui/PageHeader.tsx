import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Root ─── */
function PageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Info (title + description block) ─── */
function PageHeaderInfo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-info"
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  );
}

/* ─── Title ─── */
function PageHeaderTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn("text-2xl font-bold tracking-tight", className)}
      {...props}
    />
  );
}

/* ─── Description ─── */
function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ─── Actions (right-side slot) ─── */
function PageHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  );
}

export {
  PageHeader,
  PageHeaderInfo,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
};
