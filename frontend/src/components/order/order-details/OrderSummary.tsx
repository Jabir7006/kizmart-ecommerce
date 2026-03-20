import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types/orderType";

const OrderSummary = ({ order }: { order: Order }) => {
  return (
    <div className="space-y-3 pt-2">
      <h4 className="text-sm font-semibold text-foreground mb-4">
        Order Summary
      </h4>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">৳{order.subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span className="font-medium">
          {order.shippingFee === 0
            ? "Free"
            : `৳${order.shippingFee.toLocaleString()}`}
        </span>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between">
        <span className="font-semibold text-base">Total</span>
        <span className="font-bold text-base text-primary tabular-nums">
          ৳{order.total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
