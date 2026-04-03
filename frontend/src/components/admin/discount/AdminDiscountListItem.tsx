import { Link } from "react-router-dom";
import { Edit, Power, Trash2 } from "lucide-react";
import {
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
  ListItemAction,
} from "@/components/ui/ListItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Discount } from "@/types/discountType";

const statusStyles: Record<Discount["status"], string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-slate-100 text-slate-700 border-slate-200",
  upcoming: "bg-amber-100 text-amber-800 border-amber-200",
  expired: "bg-rose-100 text-rose-800 border-rose-200",
};

const typeStyles: Record<Discount["discountType"], string> = {
  percentage: "bg-blue-100 text-blue-800 border-blue-200",
  fixed: "bg-violet-100 text-violet-800 border-violet-200",
};

const targetLabels: Record<Discount["targetType"], string> = {
  all: "All products",
  category: "Category",
  product: "Product",
};

interface AdminDiscountListItemProps {
  discount: Discount;
  onToggle?: (discount: Discount) => void;
  onDelete?: (discount: Discount) => void;
  isToggling?: boolean;
}

const formatDiscountValue = (discount: Discount) =>
  discount.discountType === "percentage"
    ? `${discount.value}% off`
    : `৳${discount.value.toLocaleString()} off`;

const formatDateRange = (startDate: string, endDate: string) =>
  `${new Date(startDate).toLocaleDateString()} → ${new Date(endDate).toLocaleDateString()}`;

const getTargetSummary = (discount: Discount) => {
  if (discount.targetType === "all") return "Applies to every product";

  const items =
    discount.targetType === "product"
      ? discount.targetProducts
      : discount.targetCategories;

  if (items.length === 0) {
    return `No ${discount.targetType === "product" ? "products" : "categories"} selected`;
  }

  const [firstItem] = items;
  if (!firstItem) return "No targets selected";

  return items.length === 1
    ? firstItem.title
    : `${firstItem.title} +${items.length - 1} more`;
};

const AdminDiscountListItem = ({
  discount,
  onToggle,
  onDelete,
  isToggling = false,
}: AdminDiscountListItemProps) => {
  return (
    <ListItem>
      <ListItemContent>
        <ListItemTitle className="flex items-center gap-2">
          <span>{discount.name}</span>
          <Badge
            className={cn(
              "border text-[11px] font-medium capitalize",
              typeStyles[discount.discountType],
            )}
            variant="outline"
          >
            {discount.discountType}
          </Badge>
        </ListItemTitle>

        <ListItemDescription>
          {formatDiscountValue(discount)} · {targetLabels[discount.targetType]}
        </ListItemDescription>

        <ListItemDescription className="mt-0.5">
          {getTargetSummary(discount)}
        </ListItemDescription>

        <ListItemDescription className="mt-0.5">
          {formatDateRange(discount.startDate, discount.endDate)}
        </ListItemDescription>
      </ListItemContent>

      <ListItemMeta className="hidden sm:flex">
        <Badge
          className={cn(
            "border text-[11px] font-medium capitalize",
            statusStyles[discount.status],
          )}
          variant="outline"
        >
          {discount.status}
        </Badge>
      </ListItemMeta>

      <ListItemAction className="sm:opacity-100">
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title={discount.isActive ? "Deactivate discount" : "Activate discount"}
            onClick={() => onToggle(discount)}
            disabled={isToggling}
            aria-label={discount.isActive ? "Deactivate discount" : "Activate discount"}
          >
            <Power className="h-4 w-4" />
          </Button>
        )}

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Edit discount"
        >
          <Link to={`/admin/discounts/${discount._id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Delete discount"
            onClick={() => onDelete(discount)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </ListItemAction>
    </ListItem>
  );
};

export default AdminDiscountListItem;
