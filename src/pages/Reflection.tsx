import { useState } from "react";
import { Plus, BookOpen, Calendar, Sparkles, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useReflections } from "@/hooks/useReflections";

const moodEmojis = {
  great: "🌟",
  good: "😊",
  neutral: "😐",
  bad: "😔",
  terrible: "😢",
};

const moodColors = {
  great: "bg-health text-health-foreground",
  good: "bg-academic text-academic-foreground",
  neutral: "bg-secondary text-secondary-foreground",
  bad: "bg-destructive/20 text-destructive",
  terrible: "bg-destructive/30 text-destructive",
};

export default function ReflectionPage() {
  const { reflections, isLoading, addReflection, deleteReflection } = useReflections();
  const [selectedReflection, setSelectedReflection] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [newReflection, setNewReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState<keyof typeof moodEmojis | null>(null);

  const handleSave = () => {
    if (!newReflection.trim()) return;
    addReflection.mutate({
      content: newReflection,
      mood: selectedMood,
      reflection_date: format(new Date(), "yyyy-MM-dd"),
    });
    setNewReflection("");
    setSelectedMood(null);
    setIsWriting(false);
  };

  // Calculate streak
  const calculateStreak = () => {
    if (reflections.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < reflections.length; i++) {
      const refDate = parseISO(reflections[i].reflection_date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      if (format(refDate, "yyyy-MM-dd") === format(expectedDate, "yyyy-MM-dd")) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const totalReflections = reflections.length;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-reflection border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl animate-fade-in">
        <PageHeader
          title="Daily Reflection 🪞"
          description="Turn your data into insights. One reflection at a time."
          actions={
            <Button
              onClick={() => setIsWriting(true)}
              className="bg-reflection text-reflection-foreground hover:bg-reflection/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Write Today's Reflection
            </Button>
          }
        />

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-reflection-muted p-2">
                <Sparkles className="h-5 w-5 text-reflection" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day streak</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-reflection-muted p-2">
                <BookOpen className="h-5 w-5 text-reflection" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalReflections}</p>
                <p className="text-sm text-muted-foreground">Total entries</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-reflection-muted p-2">
                <Calendar className="h-5 w-5 text-reflection" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {reflections.length > 0 ? "Active" : "Start"}
                </p>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Writing Mode */}
        {isWriting && (
          <div className="mb-8 animate-slide-up rounded-xl border border-reflection/30 bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">
              How was {format(new Date(), "EEEE, MMMM d")}?
            </h3>
            <Textarea
              value={newReflection}
              onChange={(e) => setNewReflection(e.target.value)}
              placeholder="Write your thoughts..."
              className="mb-4 min-h-[120px] resize-none border-border bg-secondary/50 focus:border-reflection"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(Object.entries(moodEmojis) as [keyof typeof moodEmojis, string][]).map(([mood, emoji]) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-lg transition-all hover:scale-110",
                      selectedMood === mood
                        ? "bg-reflection text-reflection-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => {
                  setIsWriting(false);
                  setNewReflection("");
                  setSelectedMood(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-reflection text-reflection-foreground hover:bg-reflection/90"
                  disabled={!newReflection.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reflections List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Past Reflections</h3>
          {reflections.length === 0 ? (
            <div className="glass-panel flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-reflection-muted p-4">
                <BookOpen className="h-8 w-8 text-reflection" />
              </div>
              <h3 className="mb-2 font-semibold">No reflections yet</h3>
              <p className="text-sm text-muted-foreground">
                Write your first reflection to start your journey
              </p>
            </div>
          ) : (
            reflections.map((reflection, index) => (
              <div
                key={reflection.id}
                className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all animate-slide-up hover:border-reflection/30"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() =>
                  setSelectedReflection(
                    selectedReflection === reflection.id ? null : reflection.id
                  )
                }
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {reflection.mood && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-sm",
                          moodColors[reflection.mood]
                        )}
                      >
                        {moodEmojis[reflection.mood]}
                      </span>
                    )}
                    <span className="font-medium">
                      {format(parseISO(reflection.reflection_date), "EEEE, MMMM d")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(reflection.reflection_date), "yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReflection.mutate(reflection.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-muted-foreground transition-all",
                    selectedReflection === reflection.id
                      ? ""
                      : "line-clamp-2"
                  )}
                >
                  {reflection.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
