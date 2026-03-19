import { Link } from "react-router-dom";
import { ShoppingBag, CheckCircle2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/userType";

interface UserInfoCardProps {
  user: User;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
};

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        {/* Avatar */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
          {getInitials(user.fullName)}
        </div>

        {/* Name & badges */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold leading-tight">{user.fullName}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {user.role === "admin" && (
              <Badge className="gap-1 capitalize" variant="secondary">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
            {user.verified ? (
              <Badge className="gap-1" variant="default">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Unverified
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Quick Links */}
        <div className="w-full space-y-2">
          <Button
            asChild
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <Link to="/orders">
              <ShoppingBag className="h-4 w-4" />
              My Orders
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
