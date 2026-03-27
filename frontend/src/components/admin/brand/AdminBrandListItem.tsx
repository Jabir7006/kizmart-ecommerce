import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import {
  ListItem,
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemAction,
} from "@/components/ui/ListItem";
import { Button } from "@/components/ui/button";
import type { Brand } from "@/types/brandType";
import { getImageUrl } from "@/lib/getImageUrl";

interface AdminBrandListItemProps {
  brand: Brand;
  onDelete?: (brand: Brand) => void;
}

const AdminBrandListItem = ({
  brand,
  onDelete,
}: AdminBrandListItemProps) => {
  return (
    <ListItem>
      <ListItemImage
        src={getImageUrl(brand.logo, "thumbnail")}
        alt={brand.logo?.altText || brand.title}
      />

      <ListItemContent>
        <ListItemTitle>{brand.title}</ListItemTitle>
        <ListItemDescription className="mt-0.5">
          /{brand.slug}
        </ListItemDescription>
      </ListItemContent>

      <ListItemAction>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Edit brand"
        >
          <Link to={`/admin/brands/${brand._id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Delete brand"
            onClick={() => onDelete(brand)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </ListItemAction>
    </ListItem>
  );
};

export default AdminBrandListItem;
