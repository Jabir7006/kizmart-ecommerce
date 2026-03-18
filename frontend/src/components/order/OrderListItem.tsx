import { useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useCancelOrder } from "@/hooks/useOrder";
import {
  ListItem,
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
} from "@/components/ui/ListItem";
import type { Order } from "@/types/orderType";

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<Order["status"], string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const CANCELLABLE_STATUSES: Order["status"][] = ["pending", "confirmed"];

const OrderListItem = ({ order }: { order: Order }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const cancelOrder = useCancelOrder();

  const firstItem = order.items[0];
  const thumbnailSrc = firstItem?.thumbnail?.secureUrl;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const isCancellable = CANCELLABLE_STATUSES.includes(order.status);

  const statusClass =
    statusStyles[order.status] ?? "bg-gray-100 text-gray-700";
  const statusLabel = statusLabels[order.status] ?? order.status;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCancel = async () => {
    await cancelOrder.mutateAsync(order._id);
    setShowCancelModal(false);
  };

  return (
    <>
      <Link to={`/orders/${order._id}`} className="block">
        <ListItem className="cursor-pointer">
          <ListItemImage
            src={thumbnailSrc}
            alt={firstItem?.title ?? "Order item"}
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-primary/5">
                <Package className="h-5 w-5 text-primary/40" />
              </div>
            }
          />

          <ListItemContent>
            <ListItemTitle>
              {firstItem?.title ?? "Order"}
            </ListItemTitle>
            <ListItemDescription>
              Order #{order._id.slice(-8).toUpperCase()} ·{" "}
              {itemCount} {itemCount === 1 ? "Item" : "Items"} ·{" "}
              {formattedDate}
            </ListItemDescription>
          </ListItemContent>

          <ListItemMeta>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass}`}
            >
              {statusLabel}
            </span>
            {isCancellable ? (
              <button
                className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCancelModal(true);
                }}
              >
                Cancel Order
              </button>
            ) : (
              <span className="text-sm font-bold tabular-nums">
                ₹{order.total.toLocaleString()}
              </span>
            )}
          </ListItemMeta>
        </ListItem>
      </Link>

      <ConfirmModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        title="Cancel Order"
        description={`Are you sure you want to cancel order #${order._id.slice(-8).toUpperCase()}? This action cannot be undone.`}
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        variant="destructive"
        onConfirm={handleCancel}
        loading={cancelOrder.isPending}
      />
    </>
  );
};

export default OrderListItem;
