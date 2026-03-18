import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrderById, useCancelOrder } from "@/hooks/useOrder";
import ErrorState from "@/components/ui/ErrorState";
import { Badge } from "@/components/ui/badge";

import ConfirmModal from "@/components/ui/ConfirmModal";
import { useState } from "react";
import type { Order } from "@/types/orderType";
import ShippingAndPayment from "@/components/order/order-details/ShippingAndPayment";
import StatusTimeline from "@/components/order/order-details/StatusTimeline";
import ItemsCard from "@/components/order/order-details/ItemsCard";
import OrderDetailsSkeleton from "@/components/order/order-details/OrderDetailsSkeleton";

const statuses: Array<{ value: Order["status"]; label: string }> = [
  { value: "pending", label: "Order Placed" },
  { value: "confirmed", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrderById(orderId || null);
  const cancelOrder = useCancelOrder();
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (isLoading) return <OrderDetailsSkeleton />;

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ErrorState
          title="Failed to load order details"
          description={error?.message || "Order not found."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleCancel = async () => {
    await cancelOrder.mutateAsync(order._id);
    setShowCancelModal(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* ── Back to Orders ── */}
      <Link
        to="/orders"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Link>

      {/* ── Page Header ── */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center flex-wrap gap-3">
          Order Details for{" "}
          <span className="text-primary">
            #{order._id.slice(-8).toUpperCase()}
          </span>
          {isCancelled && (
            <Badge variant="destructive" className="ml-2">
              Cancelled
            </Badge>
          )}
        </h1>
        <p className="text-muted-foreground">Placed on {formattedDate}</p>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Timeline & Items */}
        <div className="lg:col-span-8 flex flex-col md:flex-row gap-8">
          {/* Status Timeline Component */}
          {!isCancelled && (
            <StatusTimeline statuses={statuses} orderStatus={order.status} />
          )}

          {/* Items Card */}
          <ItemsCard order={order} setShowCancelModal={setShowCancelModal} />
        </div>

        {/* Right Column: Summaries */}
        <ShippingAndPayment order={order} />
      </div>

      <ConfirmModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        title="Cancel Order"
        description={`Are you sure you want to cancel this order? This action cannot be undone.`}
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        variant="destructive"
        onConfirm={handleCancel}
        loading={cancelOrder.isPending}
      />
    </div>
  );
};

export default OrderDetailsPage;
