import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Root ─── */
function ListItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item"
      className={cn(
        "group/item flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-card-foreground transition-all duration-200 hover:shadow-md hover:border-primary/20",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Image ─── */
function ListItemImage({
  className,
  src,
  alt = "",
  fallback,
  ...props
}: React.ComponentProps<"div"> & {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}) {
  return (
    <div
      data-slot="list-item-image"
      className={cn(
        "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-14 sm:w-14",
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        (fallback ?? (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
        ))
      )}
    </div>
  );
}

/* ─── Content (main area — takes all available space) ─── */
function ListItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  );
}

/* ─── Title ─── */
function ListItemTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="list-item-title"
      className={cn(
        "truncate text-sm font-semibold leading-snug",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Description ─── */
function ListItemDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="list-item-description"
      className={cn(
        "truncate text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Meta (right-side info — always right-aligned) ─── */
function ListItemMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-meta"
      className={cn(
        "ml-auto flex shrink-0 flex-col items-end gap-1",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Action ─── */
function ListItemAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-action"
      className={cn(
        "flex shrink-0 items-center gap-1.5 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Exports ─── */
export {
  ListItem,
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
  ListItemAction,
};
