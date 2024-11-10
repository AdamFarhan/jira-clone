import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Props {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}
export const TasksCalendarToolbar = ({ date, onNavigate }: Props) => {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        onClick={() => onNavigate("PREV")}
        variant={"secondary"}
        size="icon"
      >
        <ChevronLeft />
      </Button>
      <Button
        onClick={() => onNavigate("TODAY")}
        variant={"secondary"}
        className="text-sm font-normal w-full lg:w-auto"
        size={"sm"}
      >
        <Calendar />
        {format(date, "MMMM yyyy")}
      </Button>
      {/* <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <Calendar className="size-4 mr-2" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div> */}
      <Button
        onClick={() => onNavigate("NEXT")}
        variant={"secondary"}
        size="icon"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
