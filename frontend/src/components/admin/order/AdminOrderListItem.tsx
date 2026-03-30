import { Link } from "react-router-dom";
import { Eye, ChevronDown } from "lucide-react";
import {
  ListItem,
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemAction,
} from "@/components/ui/ListItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Order } from "@/types/orderType";
import { getImageUrl } from "@/lib/getImageUrl";
import { useUpdateOrderStatus } from "@/hooks/useOrder";

interface AdminOrderListItemProps {
  order: Order;
}

const AdminOrderListItem = ({ order }: AdminOrderListItemProps) => {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const firstItemImage = order.items?.[0]?.thumbnail;
  const itemCount = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const statuses: Order["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  const statusColors: Record<Order["status"], string> = {
    pending: "text-amber-500 hover:text-amber-600",
    confirmed: "text-blue-500 hover:text-blue-600",
    shipped: "text-indigo-500 hover:text-indigo-600",
    delivered: "text-emerald-500 hover:text-emerald-600",
    cancelled: "text-red-500 hover:text-red-600",
  };

  return (
    <ListItem>
      {/* Thumbnail */}
      <ListItemImage
        src={firstItemImage ? getImageUrl(firstItemImage, "thumbnail") : undefined}
        alt={`Order ${order._id}`}
        className="object-cover"
      />

      {/* Main content */}
      <ListItemContent>
        <ListItemTitle>
          Order #{order._id.slice(-8).toUpperCase()}{" "}
          {order.userDetails?.email && (
            <span className="ml-2 font-normal text-muted-foreground">
              ({order.userDetails.email})
            </span>
          )}
        </ListItemTitle>
        <ListItemDescription className="mt-0.5 flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span>{itemCount} item{itemCount !== 1 && 's'}</span>
          <span className="hidden sm:inline">•</span>
          <span>Total: ৳{order.total}</span>
          <span className="capitalize font-medium block sm:hidden">
            Status: <span className={statusColors[order.status]}>{order.status}</span>
          </span>
        </ListItemDescription>
      </ListItemContent>

      {/* Actions */}
      <ListItemAction className="flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-8 capitalize font-medium ${statusColors[order.status]}`}
              disabled={isPending}
            >
              {order.status}
              <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                className="capitalize cursor-pointer"
                onClick={() => {
                  if (status !== order.status) {
                    updateStatus({ orderId: order._id, status });
                  }
                }}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="View Order"
        >
          <Link to={`/orders/${order._id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </ListItemAction>
    </ListItem>
  );
};

export default AdminOrderListItem;
