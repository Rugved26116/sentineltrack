import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

interface Activity {
  date: Date;
  domains: ("academic" | "health" | "finance" | "reflection")[];
}

interface MiniCalendarProps {
  activities?: Activity[];
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
}

const domainColors = {
  academic: "bg-academic",
  health: "bg-health",
  finance: "bg-finance",
  reflection: "bg-reflection",
};

export function MiniCalendar({
  activities = [],
  onDateClick,
  selectedDate,
}: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getActivitiesForDay = (date: Date) => {
    return activities.find((a) => isSameDay(a.date, date))?.domains || [];
  };

  return (
    <div className="glass-panel p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const dayActivities = getActivitiesForDay(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick?.(day)}
              className={cn(
                "relative flex h-10 flex-col items-center justify-center rounded-lg text-sm transition-all",
                !isCurrentMonth && "text-muted-foreground/40",
                isCurrentMonth && "hover:bg-secondary",
                isToday && "font-semibold text-primary",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary"
              )}
            >
              <span>{format(day, "d")}</span>
              {/* Activity indicators */}
              {dayActivities.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayActivities.slice(0, 3).map((domain, i) => (
                    <span
                      key={i}
                      className={cn("h-1 w-1 rounded-full", domainColors[domain])}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(domainColors).map(([domain, color]) => (
          <div key={domain} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", color)} />
            <span className="text-xs capitalize text-muted-foreground">
              {domain}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
