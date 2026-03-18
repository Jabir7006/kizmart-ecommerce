import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ListItem,
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
  ListItemAction,
} from "@/components/ui/ListItem";
import type { Order } from "@/types/orderType";

const statusConfig: Record<
  Order["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  pending: { label: "Pending", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "default" },
  shipped: { label: "Shipped", variant: "secondary" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const OrderListItem = ({ order }: { order: Order }) => {
  const firstItem = order.items[0];
  const thumbnailSrc = firstItem?.thumbnail?.secureUrl;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const status = statusConfig[order.status] ?? {
    label: order.status ?? "Unknown",
    variant: "outline" as const,
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link to={`/orders/${order._id}`} className="block">
      <ListItem className="cursor-pointer">
        <ListItemImage
          src={thumbnailSrc}
          alt={firstItem?.title ?? "Order item"}
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-primary/5">
              <Package className="h-6 w-6 text-primary/40" />
            </div>
          }
        />

        <ListItemContent>
          <ListItemTitle>
            Order #{order._id.slice(-8).toUpperCase()}
          </ListItemTitle>
          <ListItemDescription>
            {itemCount} {itemCount === 1 ? "item" : "items"} · {formattedDate}
          </ListItemDescription>
        </ListItemContent>

        <ListItemMeta>
          <Badge variant={status.variant}>{status.label}</Badge>
          <span className="text-sm font-bold">
            ₹{order.total.toLocaleString()}
          </span>
        </ListItemMeta>

        <ListItemAction>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </ListItemAction>
      </ListItem>
    </Link>
  );
};

export default OrderListItem;
