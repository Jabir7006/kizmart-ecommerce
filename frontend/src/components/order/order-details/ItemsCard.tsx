import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import type { Order } from "@/types/orderType";
import { Button } from "@/components/ui/button";

const ItemsCard = ({
  order,
  setShowCancelModal,
}: {
  order: Order;
  setShowCancelModal: (value: boolean) => void;
}) => {
  const isCancellable = ["pending", "confirmed"].includes(order.status);

  return (
    <Card className="flex-1 shadow-sm border-border">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <CardTitle className="text-base font-semibold">
          Items in Your Order
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div
              key={item._id || item.title}
              className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 hover:bg-muted/10 transition-colors"
            >
              <div className="flex shrink-0 h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-lg border bg-background">
                {item.thumbnail?.secureUrl ? (
                  <img
                    src={item.thumbnail.secureUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-base line-clamp-2 leading-tight">
                    {item.title}
                  </h4>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                    Qty: {item.quantity}
                  </span>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Unit Price
                    </span>
                    <span className="font-bold tabular-nums">
                      ৳{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {/* Actions Footer */}
      <CardFooter className="flex flex-col sm:flex-row gap-3 p-4 border-t bg-muted/10">
        <Button className="w-full sm:w-auto sm:flex-1" variant="default">
          Track Shipment
        </Button>
        {isCancellable ? (
          <Button
            className="w-full sm:w-auto sm:flex-1"
            variant="outline"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Order
          </Button>
        ) : (
          <Button className="w-full sm:w-auto sm:flex-1" variant="outline">
            Order Support
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ItemsCard;
