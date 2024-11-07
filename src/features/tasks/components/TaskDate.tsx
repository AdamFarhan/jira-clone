import { differenceInDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";

interface TaskDateProps {
  value: string;
  className?: string;
}

export const TaskDate: React.FC<TaskDateProps> = ({ value, className }) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";

  if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className={cn(textColor)}>
      <span className={cn("truncate", className)}>
        {format(endDate, "PPP")}
      </span>
    </div>
  );
};
