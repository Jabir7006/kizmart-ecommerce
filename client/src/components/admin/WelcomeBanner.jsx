import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

export function WelcomeBanner({ onDismiss }) {
  return (
    <Alert variant="default" className="border-primary/50 bg-primary/5">
      <Sparkles className="h-5 w-5 text-primary" />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <AlertTitle className="text-lg">
            Welcome to your Admin Dashboard!
          </AlertTitle>
          <AlertDescription className="mt-2">
            Get started by exploring your store analytics, managing products, or
            checking recent orders. Need help? Check out our documentation or
            contact support.
          </AlertDescription>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="default">
              Quick Tour
            </Button>
            <Button size="sm" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
