import { useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useCancelOrder } from "@/hooks/useOrder";
import type { Order } from "@/types/orderType";

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-slate-200 text-slate-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-200 text-green-900",
  cancelled: "bg-red-100 text-red-800",
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

  const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
  const statusClass = statusStyles[order.status] ?? "bg-gray-500 text-white";
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
      <div className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-primary px-4 py-3 text-primary-foreground sm:px-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-sm">
              Order #{order._id.slice(-8).toUpperCase()}
            </h3>
            <p className="text-xs text-primary-foreground/80">
              Placed {formattedDate} <span className="mx-1">|</span> Total: ₹
              {order.total.toLocaleString()}
            </p>
          </div>
          <div className="flex shrink-0">
            <span
              className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${statusClass}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6">
          {/* Items Horizontal Scroll */}
          <div className="flex flex-1 gap-4 overflow-x-auto pb-2 scrollbar-none sm:pb-0">
            {order.items.map((item) => (
              <div
                key={item._id || item.title}
                className="flex shrink-0 items-start gap-3 w-48 sm:w-56"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                  {item.thumbnail?.secureUrl ? (
                    <img
                      src={item.thumbnail.secureUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-row sm:flex-col items-stretch sm:items-end justify-center sm:justify-center gap-2 border-t pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6">
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none w-full border font-medium"
            >
              <Link to={`/orders/${order._id}`}>Order Details</Link>
            </Button>
            {isCancellable && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none w-full border font-medium bg-background text-foreground hover:bg-destructive hover:text-white"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>

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
