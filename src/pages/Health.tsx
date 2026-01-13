import { useState } from "react";
import { Plus, Dumbbell, Flame, Calendar } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  completed: boolean;
}

const mockWorkouts: Workout[] = [
  {
    id: "1",
    name: "Push Day",
    date: "Today",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 10, weight: 60 },
      { name: "Shoulder Press", sets: 3, reps: 12, weight: 25 },
      { name: "Tricep Dips", sets: 3, reps: 15 },
    ],
    completed: false,
  },
  {
    id: "2",
    name: "Pull Day",
    date: "Yesterday",
    exercises: [
      { name: "Deadlift", sets: 4, reps: 8, weight: 80 },
      { name: "Bent Over Rows", sets: 4, reps: 10, weight: 40 },
      { name: "Bicep Curls", sets: 3, reps: 12, weight: 12 },
    ],
    completed: true,
  },
  {
    id: "3",
    name: "Leg Day",
    date: "2 days ago",
    exercises: [
      { name: "Squats", sets: 4, reps: 10, weight: 70 },
      { name: "Lunges", sets: 3, reps: 12 },
      { name: "Leg Press", sets: 4, reps: 12, weight: 100 },
    ],
    completed: true,
  },
];

const templates = ["Push", "Pull", "Legs", "Upper", "Lower", "Full Body"];

export default function HealthPage() {
  const [workouts] = useState(mockWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const weeklyWorkouts = workouts.filter((w) => w.completed).length;

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl animate-fade-in">
        <PageHeader
          title="Health 💪"
          description="Log your workouts and track your progress"
          actions={
            <Button className="bg-health text-health-foreground hover:bg-health/90">
              <Plus className="mr-2 h-4 w-4" />
              Log Workout
            </Button>
          }
        />

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-health-muted p-2">
                <Flame className="h-5 w-5 text-health" />
              </div>
              <div>
                <p className="text-2xl font-bold">{weeklyWorkouts}</p>
                <p className="text-sm text-muted-foreground">This week</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-health-muted p-2">
                <Dumbbell className="h-5 w-5 text-health" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Total workouts</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-health-muted p-2">
                <Calendar className="h-5 w-5 text-health" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Day streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            Quick Start
          </h3>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <button
                key={template}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-health-muted hover:text-health"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Workout List */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Recent Workouts</h3>
            <div className="space-y-3">
              {workouts.map((workout, index) => (
                <button
                  key={workout.id}
                  onClick={() => setSelectedWorkout(workout)}
                  className={cn(
                    "w-full rounded-xl border bg-card p-4 text-left transition-all animate-slide-up hover:border-health/50",
                    selectedWorkout?.id === workout.id && "border-health"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">{workout.name}</h4>
                    <span
                      className={cn(
                        "text-xs",
                        workout.completed
                          ? "text-health"
                          : "text-muted-foreground"
                      )}
                    >
                      {workout.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {workout.exercises.length} exercises
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Workout Details */}
          <div>
            {selectedWorkout ? (
              <div className="glass-panel animate-slide-up overflow-hidden">
                <div className="border-b border-border bg-health-muted p-4">
                  <h3 className="text-lg font-semibold text-health">
                    {selectedWorkout.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedWorkout.date}
                  </p>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-3">Exercise</th>
                        <th className="pb-3 text-center">Sets</th>
                        <th className="pb-3 text-center">Reps</th>
                        <th className="pb-3 text-right">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {selectedWorkout.exercises.map((ex, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="py-3 font-medium">{ex.name}</td>
                          <td className="py-3 text-center">{ex.sets}</td>
                          <td className="py-3 text-center">{ex.reps}</td>
                          <td className="py-3 text-right text-muted-foreground">
                            {ex.weight ? `${ex.weight}kg` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="glass-panel flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 rounded-full bg-health-muted p-4">
                  <Dumbbell className="h-8 w-8 text-health" />
                </div>
                <h3 className="mb-2 font-semibold">Select a Workout</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a workout to see the details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
