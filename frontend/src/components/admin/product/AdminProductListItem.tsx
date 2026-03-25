import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import {
  ListItem,
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
  ListItemAction,
} from "@/components/ui/ListItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/productType";
import { getImageUrl } from "@/lib/getImageUrl";

/* ─── Status badge styles ─── */
const statusStyles: Record<Product["status"], string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  archived: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels: Record<Product["status"], string> = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
};

interface AdminProductListItemProps {
  product: Product;
  onDelete?: (product: Product) => void;
}

const AdminProductListItem = ({
  product,
  onDelete,
}: AdminProductListItemProps) => {
  return (
    <ListItem>
      {/* Thumbnail */}
      <ListItemImage
        src={getImageUrl(product.thumbnail, "thumbnail")}
        alt={product.thumbnail?.altText || product.title}
      />

      {/* Main content */}
      <ListItemContent>
        <ListItemTitle>{product.title}</ListItemTitle>
        <ListItemDescription>
          {product.category?.title}
          {product.brand?.title ? ` · ${product.brand.title}` : "No brand"}
        </ListItemDescription>
        <ListItemDescription className="mt-0.5">
          Stock: {product.quantity} · Sold: {product.sold}
        </ListItemDescription>
      </ListItemContent>

      {/* Meta — price + status */}
      <ListItemMeta className="hidden sm:flex">
        <span className="text-sm font-semibold">
          ৳{product.price.toLocaleString()}
        </span>
        <Badge
          className={cn(
            "border text-[11px] font-medium",
            statusStyles[product.status],
          )}
          variant="outline"
        >
          {statusLabels[product.status]}
        </Badge>
      </ListItemMeta>

      {/* Actions */}
      <ListItemAction>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Edit product"
        >
          <Link to={`/admin/products/${product.slug}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Delete product"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </ListItemAction>
    </ListItem>
  );
};

export default AdminProductListItem;
