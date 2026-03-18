import type { Order, Payment } from "@/types/orderType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Receipt, Truck, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OrderSummary from "./OrderSummary";

const ShippingAndPayment = ({ order }: { order: Order }) => {
  const payment =
    typeof order.payment === "object" ? (order.payment as Payment) : null;

  const paymentMethodLabel =
    payment?.method === "cash_on_delivery"
      ? "Cash on Delivery"
      : payment?.method || "N/A";
  return (
    <div className="lg:col-span-4 space-y-6">
      <Card className="shadow-sm border-border sticky top-6">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Shipping & Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Address */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Shipping Address
            </h4>
            <div className="text-sm text-muted-foreground leading-relaxed pl-6">
              <p className="font-medium text-foreground">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.streetAddress}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="mt-1">{order.shippingAddress.phoneNumber}</p>
            </div>
          </div>

          <Separator />

          {/* Shipping Method */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Truck className="h-4 w-4 text-muted-foreground" />
              Shipping Method
            </h4>
            <div className="text-sm text-muted-foreground pl-6">
              <p className="font-medium text-foreground">Standard Delivery</p>
              <p>Estimated 3-5 business days</p>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Payment Method
            </h4>
            <div className="text-sm text-muted-foreground pl-6 flex justify-between items-center">
              <p>{paymentMethodLabel}</p>
              <Badge variant="secondary" className="font-normal capitalize">
                {payment?.status || order.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <OrderSummary order={order} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAndPayment;
