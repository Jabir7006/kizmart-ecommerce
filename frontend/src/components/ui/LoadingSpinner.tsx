import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

const LoadingSpinner = ({ className, size = 20 }: LoadingSpinnerProps) => (
  <Loader2 className={cn("animate-spin", className)} size={size} />
);

export default LoadingSpinner;
