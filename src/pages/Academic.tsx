import { useState } from "react";
import { Plus, Check, Clock, BookOpen, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAcademicTasks } from "@/hooks/useAcademicTasks";

const defaultSubjects = ["Mathematics", "Physics", "Chemistry", "Computer Science", "English", "Other"];

export default function AcademicPage() {
  const { tasks, isLoading, addTask, updateTask, deleteTask } = useAcademicTasks();
  const [filter, setFilter] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState<{
    subject: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>({
    subject: "",
    title: "",
    description: "",
    priority: "medium",
  });

  const toggleTask = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    updateTask.mutate({
      id,
      status: newStatus,
      completed_at: newStatus === "completed" ? new Date().toISOString() : null,
    });
  };

  const handleAddTask = () => {
    if (!newTask.subject || !newTask.title) return;
    addTask.mutate({
      subject: newTask.subject,
      title: newTask.title,
      description: newTask.description || null,
      priority: newTask.priority,
      status: "pending",
      due_date: null,
    });
    setNewTask({ subject: "", title: "", description: "", priority: "medium" });
    setIsOpen(false);
  };

  const subjects = [...new Set(tasks.map(t => t.subject))];
  const allSubjects = [...new Set([...defaultSubjects, ...subjects])];

  const filteredTasks = filter
    ? tasks.filter((t) => t.subject === filter)
    : tasks;

  const completedToday = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-academic border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl animate-fade-in">
        <PageHeader
          title="Academic Weapon ⚔️"
          description="Track your study sessions and conquer your subjects"
          actions={
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-academic text-academic-foreground hover:bg-academic/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select
                      value={newTask.subject}
                      onValueChange={(v) => setNewTask({ ...newTask, subject: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {allSubjects.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Topic/Title</Label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="e.g., Integration by Parts"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Input
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Additional notes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(v: "low" | "medium" | "high") => setNewTask({ ...newTask, priority: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddTask}
                    className="w-full bg-academic text-academic-foreground hover:bg-academic/90"
                    disabled={!newTask.subject || !newTask.title}
                  >
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
              style={{ width: `${totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0}%` }}
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
                task.status === "completed" && "opacity-60"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleTask(task.id, task.status)}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  task.status === "completed"
                    ? "border-academic bg-academic text-academic-foreground"
                    : "border-muted-foreground hover:border-academic"
                )}
              >
                {task.status === "completed" && <Check className="h-3 w-3" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-academic">
                    {task.subject}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded",
                    task.priority === "high" ? "bg-destructive/20 text-destructive" :
                    task.priority === "medium" ? "bg-finance-muted text-finance" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    {task.priority}
                  </span>
                </div>
                <p
                  className={cn(
                    "font-medium",
                    task.status === "completed" && "line-through"
                  )}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteTask.mutate(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
