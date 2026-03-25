import { Link } from "react-router-dom";
import { Edit, Trash2, ExternalLink } from "lucide-react";
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
import type { Banner } from "@/types/bannerType";
import { getImageUrl } from "@/lib/getImageUrl";

const statusStyles: Record<Banner["status"], string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-slate-100 text-slate-700 border-slate-200",
};

const typeStyles: Record<Banner["type"], string> = {
  banner: "bg-blue-100 text-blue-800 border-blue-200",
  promo: "bg-purple-100 text-purple-800 border-purple-200",
  offer: "bg-orange-100 text-orange-800 border-orange-200",
};

interface AdminBannerListItemProps {
  banner: Banner;
  onDelete?: (banner: Banner) => void;
}

const AdminBannerListItem = ({
  banner,
  onDelete,
}: AdminBannerListItemProps) => {
  return (
    <ListItem>
      <ListItemImage
        src={getImageUrl(banner.image, "mobile")}
        alt={banner.image?.altText || "Banner"}
      />

      {/* Main content */}
      <ListItemContent>
        <ListItemTitle className="flex items-center gap-2">
          <Badge
            className={cn(
              "border text-[11px] font-medium",
              typeStyles[banner.type],
            )}
            variant="outline"
          >
            {banner.type}
          </Badge>
          <span className="text-sm font-medium">
            Order #{banner.displayOrder}
          </span>
        </ListItemTitle>
        <ListItemDescription className="flex items-center gap-1 mt-0.5 truncate max-w-xs">
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="truncate text-xs">{banner.link}</span>
        </ListItemDescription>
        {(banner.startDate || banner.endDate) && (
          <ListItemDescription className="mt-0.5 text-xs">
            {banner.startDate
              ? new Date(banner.startDate).toLocaleDateString()
              : "—"}{" "}
            →{" "}
            {banner.endDate
              ? new Date(banner.endDate).toLocaleDateString()
              : "No end"}
          </ListItemDescription>
        )}
      </ListItemContent>

      {/* Status badge */}
      <ListItemMeta className="hidden sm:flex">
        <Badge
          className={cn(
            "border text-[11px] font-medium",
            statusStyles[banner.status],
          )}
          variant="outline"
        >
          {banner.status}
        </Badge>
      </ListItemMeta>

      {/* Actions */}
      <ListItemAction>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Edit banner"
        >
          <Link to={`/admin/banners/${banner._id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Delete banner"
            onClick={() => onDelete(banner)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </ListItemAction>
    </ListItem>
  );
};

export default AdminBannerListItem;
