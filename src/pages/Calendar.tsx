import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { GraduationCap, Dumbbell, Wallet, BookOpen, X } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { MiniCalendar } from "@/components/calendar/MiniCalendar";
import { cn } from "@/lib/utils";

// Mock data
const mockData = {
  "2026-01-10": {
    academic: [{ subject: "Mathematics", topic: "Calculus - Integration", duration: "2h" }],
    health: [{ workout: "Push Day", exercises: ["Bench Press", "Shoulder Press", "Tricep Dips"] }],
    finance: [],
    reflection: null,
  },
  "2026-01-11": {
    academic: [],
    health: [{ workout: "Pull Day", exercises: ["Deadlift", "Rows", "Bicep Curls"] }],
    finance: [{ category: "Food", amount: "₹450" }, { category: "Transport", amount: "₹200" }],
    reflection: null,
  },
  "2026-01-12": {
    academic: [{ subject: "Physics", topic: "Electromagnetism", duration: "1.5h" }],
    health: [{ workout: "Leg Day", exercises: ["Squats", "Lunges", "Leg Press"] }],
    finance: [],
    reflection: "Good productive day. Managed to complete all planned tasks. Need to focus more on physics tomorrow.",
  },
};

const mockActivities = [
  { date: new Date(2026, 0, 10), domains: ["academic", "health"] as const },
  { date: new Date(2026, 0, 11), domains: ["health", "finance"] as const },
  { date: new Date(2026, 0, 12), domains: ["academic", "health", "reflection"] as const },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDataForDate = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return mockData[key as keyof typeof mockData] || null;
  };

  const dayData = selectedDate ? getDataForDate(selectedDate) : null;

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl animate-fade-in">
        <PageHeader
          title="Master Calendar"
          description="A unified view of all your activities. Click any day to see what happened."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <MiniCalendar
              activities={mockActivities.map((a) => ({
                date: a.date,
                domains: [...a.domains],
              }))}
              selectedDate={selectedDate || undefined}
              onDateClick={setSelectedDate}
            />
          </div>

          {/* Day Details Panel */}
          <div className="lg:col-span-1">
            {selectedDate ? (
              <div className="glass-panel animate-slide-up overflow-hidden">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDate, "EEEE")}
                    </p>
                    <h3 className="text-lg font-semibold">
                      {format(selectedDate, "MMMM d, yyyy")}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 p-4">
                  {dayData ? (
                    <>
                      {/* Academic */}
                      {dayData.academic.length > 0 && (
                        <div className="rounded-lg bg-academic-muted p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-academic" />
                            <span className="font-medium text-academic">Academic</span>
                          </div>
                          {dayData.academic.map((item, i) => (
                            <div key={i} className="text-sm">
                              <p className="font-medium">{item.subject}</p>
                              <p className="text-muted-foreground">{item.topic}</p>
                              <p className="text-xs text-muted-foreground">{item.duration}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Health */}
                      {dayData.health.length > 0 && (
                        <div className="rounded-lg bg-health-muted p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Dumbbell className="h-4 w-4 text-health" />
                            <span className="font-medium text-health">Health</span>
                          </div>
                          {dayData.health.map((item, i) => (
                            <div key={i} className="text-sm">
                              <p className="font-medium">{item.workout}</p>
                              <p className="text-muted-foreground">
                                {item.exercises.join(", ")}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Finance */}
                      {dayData.finance.length > 0 && (
                        <div className="rounded-lg bg-finance-muted p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-finance" />
                            <span className="font-medium text-finance">Finance</span>
                          </div>
                          {dayData.finance.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.category}</span>
                              <span className="font-medium">{item.amount}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reflection */}
                      {dayData.reflection && (
                        <div className="rounded-lg bg-reflection-muted p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-reflection" />
                            <span className="font-medium text-reflection">Reflection</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {dayData.reflection}
                          </p>
                        </div>
                      )}

                      {/* No data message */}
                      {dayData.academic.length === 0 &&
                        dayData.health.length === 0 &&
                        dayData.finance.length === 0 &&
                        !dayData.reflection && (
                          <p className="py-8 text-center text-muted-foreground">
                            No activities logged for this day
                          </p>
                        )}
                    </>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No data available for this day
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-panel flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 rounded-full bg-secondary p-4">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-semibold">Select a Date</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any day in the calendar to see your activities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
