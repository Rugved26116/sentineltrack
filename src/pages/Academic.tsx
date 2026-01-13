import { useState } from "react";
import { Plus, Check, Clock, BookOpen } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  subject: string;
  topic: string;
  completed: boolean;
  duration?: string;
}

const mockTasks: Task[] = [
  { id: "1", subject: "Mathematics", topic: "Integration by Parts", completed: true, duration: "1h 30m" },
  { id: "2", subject: "Mathematics", topic: "Definite Integrals", completed: false },
  { id: "3", subject: "Physics", topic: "Electromagnetic Induction", completed: false },
  { id: "4", subject: "Chemistry", topic: "Organic Reactions", completed: true, duration: "45m" },
  { id: "5", subject: "Computer Science", topic: "Data Structures - Trees", completed: false },
];

const subjects = ["Mathematics", "Physics", "Chemistry", "Computer Science"];

export default function AcademicPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = filter
    ? tasks.filter((t) => t.subject === filter)
    : tasks;

  const completedToday = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl animate-fade-in">
        <PageHeader
          title="Academic Weapon ⚔️"
          description="Track your study sessions and conquer your subjects"
          actions={
            <Button className="bg-academic text-academic-foreground hover:bg-academic/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          }
        />

        {/* Progress Bar */}
        <div className="mb-8 rounded-xl bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedToday} / {totalTasks} tasks
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-academic transition-all duration-500"
              style={{ width: `${(completedToday / totalTasks) * 100}%` }}
            />
          </div>
        </div>

        {/* Subject Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === null
                ? "bg-academic text-academic-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setFilter(subject)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                filter === subject
                  ? "bg-academic text-academic-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all animate-slide-up",
                task.completed && "opacity-60"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  task.completed
                    ? "border-academic bg-academic text-academic-foreground"
                    : "border-muted-foreground hover:border-academic"
                )}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-academic">
                    {task.subject}
                  </span>
                </div>
                <p
                  className={cn(
                    "font-medium",
                    task.completed && "line-through"
                  )}
                >
                  {task.topic}
                </p>
              </div>

              {task.duration ? (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {task.duration}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Clock className="mr-1 h-4 w-4" />
                  Start
                </Button>
              )}
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-academic-muted p-4">
              <BookOpen className="h-8 w-8 text-academic" />
            </div>
            <h3 className="mb-2 font-semibold">No tasks found</h3>
            <p className="text-sm text-muted-foreground">
              Add a new study task to get started
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
