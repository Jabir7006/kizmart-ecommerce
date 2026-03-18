import type { Order } from "@/types/orderType";
import { CheckCircle2 } from "lucide-react";

const StatusTimeline = ({
  statuses,
  orderStatus,
}: {
  statuses: Array<{ value: Order["status"]; label: string }>;
  orderStatus: Order["status"];
}) => {
  const currentStatusIndex = statuses.findIndex((s) => s.value === orderStatus);
  return (
    <div className="md:w-48 shrink-0 flex flex-nowrap overflow-x-auto md:flex-col gap-0 md:gap-0 pb-6 md:pb-0 scrollbar-none relative">
      {statuses.map((status, index) => {
        const isActive = currentStatusIndex === index;
        const isCompleted = currentStatusIndex >= index;
        const isLast = index === statuses.length - 1;

        return (
          <div
            key={status.value}
            className="relative flex md:flex-row items-center md:items-start min-w-[120px] md:min-w-0 flex-1 md:flex-none"
          >
            {/* Visual Indicator */}
            <div className="flex flex-col items-center mr-4 w-full md:w-auto relative cursor-default">
              {/* Connecting Line (Horizontal on mobile, Vertical on desktop) */}
              {!isLast && (
                <>
                  {/* Desktop vertical line */}
                  <div
                    className={`hidden md:block absolute top-[18px] left-[7px] w-0.5 h-full -bottom-4 ${isCompleted ? "bg-primary" : "bg-border"}`}
                  />
                  {/* Mobile horizontal line */}
                  <div
                    className={`md:hidden absolute top-[7px] left-[50%] w-full h-0.5 ${isCompleted ? "bg-primary" : "bg-border"}`}
                  />
                </>
              )}
              <div className="z-10 bg-background mb-3 md:mb-10">
                {isActive ? (
                  <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/20" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted bg-background" />
                )}
              </div>
            </div>
            {/* Label */}
            <div className="pt-8 md:pt-0 mt-[-24px] md:mt-[-2px] text-center md:text-left w-full md:pb-12 border-primary">
              <p
                className={`text-sm font-semibold ${isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}
              >
                {status.label}
              </p>
              {isActive && (
                <p className="text-xs text-primary/80 mt-0.5">Current</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
