import { useState } from "react";
import { Plus, Dumbbell, Flame, Calendar, Trash2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useWorkouts, Workout } from "@/hooks/useWorkouts";
import { format, parseISO } from "date-fns";

const templates = ["Push", "Pull", "Legs", "Upper", "Lower", "Full Body"];

export default function HealthPage() {
  const { workouts, isLoading, addWorkout, deleteWorkout } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    workout_date: format(new Date(), "yyyy-MM-dd"),
    duration_minutes: 0,
    notes: "",
    exercises: [{ exercise_name: "", sets: 3, reps: 10, weight: null as number | null, order_index: 0 }],
  });

  const handleAddExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [
        ...newWorkout.exercises,
        { exercise_name: "", sets: 3, reps: 10, weight: null, order_index: newWorkout.exercises.length },
      ],
    });
  };

  const handleRemoveExercise = (index: number) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.filter((_, i) => i !== index),
    });
  };

  const handleExerciseChange = (index: number, field: string, value: any) => {
    const updated = [...newWorkout.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setNewWorkout({ ...newWorkout, exercises: updated });
  };

  const handleSubmit = () => {
    if (!newWorkout.name) return;
    addWorkout.mutate({
      name: newWorkout.name,
      workout_date: newWorkout.workout_date,
      duration_minutes: newWorkout.duration_minutes || undefined,
      notes: newWorkout.notes || undefined,
      exercises: newWorkout.exercises.filter(e => e.exercise_name).map((e, i) => ({
        exercise_name: e.exercise_name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        order_index: i,
        notes: null,
      })),
    });
    setNewWorkout({
      name: "",
      workout_date: format(new Date(), "yyyy-MM-dd"),
      duration_minutes: 0,
      notes: "",
      exercises: [{ exercise_name: "", sets: 3, reps: 10, weight: null, order_index: 0 }],
    });
    setIsOpen(false);
  };

  const weeklyWorkouts = workouts.length;
  const totalExercises = workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-health border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl animate-fade-in">
        <PageHeader
          title="Health 💪"
          description="Log your workouts and track your progress"
          actions={
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-health text-health-foreground hover:bg-health/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Log Workout
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Log Workout</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Workout Name</Label>
                      <Input
                        value={newWorkout.name}
                        onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                        placeholder="e.g., Push Day"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newWorkout.workout_date}
                        onChange={(e) => setNewWorkout({ ...newWorkout, workout_date: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={newWorkout.duration_minutes || ""}
                      onChange={(e) => setNewWorkout({ ...newWorkout, duration_minutes: parseInt(e.target.value) || 0 })}
                      placeholder="e.g., 60"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Exercises</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddExercise}>
                        <Plus className="mr-1 h-3 w-3" /> Add
                      </Button>
                    </div>
                    {newWorkout.exercises.map((ex, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 items-end">
                        <div className="col-span-2">
                          <Input
                            value={ex.exercise_name}
                            onChange={(e) => handleExerciseChange(i, "exercise_name", e.target.value)}
                            placeholder="Exercise name"
                          />
                        </div>
                        <Input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(i, "sets", parseInt(e.target.value))}
                          placeholder="Sets"
                        />
                        <Input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(i, "reps", parseInt(e.target.value))}
                          placeholder="Reps"
                        />
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            value={ex.weight || ""}
                            onChange={(e) => handleExerciseChange(i, "weight", parseFloat(e.target.value) || null)}
                            placeholder="kg"
                          />
                          {newWorkout.exercises.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveExercise(i)}
                              className="shrink-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-health text-health-foreground hover:bg-health/90"
                    disabled={!newWorkout.name}
                  >
                    Log Workout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                <p className="text-sm text-muted-foreground">Total workouts</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-health-muted p-2">
                <Dumbbell className="h-5 w-5 text-health" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExercises}</p>
                <p className="text-sm text-muted-foreground">Total exercises</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-health-muted p-2">
                <Calendar className="h-5 w-5 text-health" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workouts.length > 0 ? "Active" : "0"}</p>
                <p className="text-sm text-muted-foreground">Status</p>
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
                onClick={() => {
                  setNewWorkout({ ...newWorkout, name: template });
                  setIsOpen(true);
                }}
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
            {workouts.length === 0 ? (
              <div className="glass-panel flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 rounded-full bg-health-muted p-4">
                  <Dumbbell className="h-8 w-8 text-health" />
                </div>
                <h3 className="mb-2 font-semibold">No workouts yet</h3>
                <p className="text-sm text-muted-foreground">
                  Log your first workout to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {workouts.map((workout, index) => (
                  <div
                    key={workout.id}
                    onClick={() => setSelectedWorkout(workout)}
                    className={cn(
                      "cursor-pointer rounded-xl border bg-card p-4 text-left transition-all animate-slide-up hover:border-health/50",
                      selectedWorkout?.id === workout.id && "border-health"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold">{workout.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(workout.workout_date), "MMM d")}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkout.mutate(workout.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {workout.exercises?.length || 0} exercises
                      {workout.duration_minutes && ` • ${workout.duration_minutes}min`}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
                    {format(parseISO(selectedWorkout.workout_date), "EEEE, MMMM d")}
                  </p>
                </div>
                <div className="p-4">
                  {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 ? (
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
                        {selectedWorkout.exercises.map((ex) => (
                          <tr key={ex.id} className="border-t border-border">
                            <td className="py-3 font-medium">{ex.exercise_name}</td>
                            <td className="py-3 text-center">{ex.sets}</td>
                            <td className="py-3 text-center">{ex.reps}</td>
                            <td className="py-3 text-right text-muted-foreground">
                              {ex.weight ? `${ex.weight}kg` : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No exercises recorded</p>
                  )}
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
