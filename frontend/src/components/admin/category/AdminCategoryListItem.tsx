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
import type { Category } from "@/types/categoryType";

interface AdminCategoryListItemProps {
  category: Category;
  onDelete?: (category: Category) => void;
}

const AdminCategoryListItem = ({
  category,
  onDelete,
}: AdminCategoryListItemProps) => {
  return (
    <ListItem>
      {/* Thumbnail */}
      {category.thumbnail?.secureUrl ? (
        <ListItemImage
          src={category.thumbnail.secureUrl}
          alt={category.thumbnail.altText || category.title}
        />
      ) : (
        <ListItemImage
          src=""
          alt={category.title}
        />
      )}

      {/* Main content */}
      <ListItemContent>
        <ListItemTitle>{category.title}</ListItemTitle>
        <ListItemDescription className="mt-0.5">
          /{category.slug}
        </ListItemDescription>
      </ListItemContent>

      {/* Actions */}
      <ListItemAction>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Edit category"
        >
          <Link to={`/admin/categories/${category._id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Delete category"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </ListItemAction>
    </ListItem>
  );
};

export default AdminCategoryListItem;
