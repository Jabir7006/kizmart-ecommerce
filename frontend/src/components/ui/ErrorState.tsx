import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const ErrorState = ({
  title = "Something went wrong",
  description,
  onRetry,
  className,
  icon,
}: ErrorStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center",
        className,
      )}
    >
      {icon ?? <AlertCircle className="mb-3 h-10 w-10 text-destructive/60" />}
      <h3 className="text-sm font-semibold text-destructive">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
