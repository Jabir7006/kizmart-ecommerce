import { MapPin, Star, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Address } from "@/types/addressType";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
}

const AddressCard = ({ address, onEdit, onDelete }: AddressCardProps) => {
  return (
    <Card className="relative shadow-sm hover:shadow-md transition-shadow border-border">
      {address.isDefault && (
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            Default
          </Badge>
        </div>
      )}
      <CardContent className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm leading-tight">
              {address.fullName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {address.phoneNumber}
            </p>
          </div>
        </div>

        {/* Address Details */}
        <div className="pl-10 text-sm text-muted-foreground leading-relaxed">
          <p>{address.streetAddress}</p>
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => onEdit(address)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(address)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
