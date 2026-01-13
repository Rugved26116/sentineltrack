import { useState } from "react";
import { Plus, BookOpen, Calendar, Sparkles } from "lucide-react";
import { format, subDays } from "date-fns";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Reflection {
  id: string;
  date: Date;
  content: string;
  mood?: "great" | "good" | "neutral" | "bad";
}

const mockReflections: Reflection[] = [
  {
    id: "1",
    date: new Date(),
    content: "Productive day. Completed all planned study tasks and had a good workout. Need to focus on drinking more water.",
    mood: "great",
  },
  {
    id: "2",
    date: subDays(new Date(), 1),
    content: "Struggled with motivation in the morning but picked up momentum after lunch. The physics concepts are finally clicking.",
    mood: "good",
  },
  {
    id: "3",
    date: subDays(new Date(), 2),
    content: "Rest day. Spent time organizing notes and planning for the week ahead. Feeling prepared for the upcoming tests.",
    mood: "neutral",
  },
  {
    id: "4",
    date: subDays(new Date(), 3),
    content: "Challenging day. Multiple deadlines converged but managed to prioritize effectively. Sleep quality was poor.",
    mood: "bad",
  },
];

const moodEmojis = {
  great: "🌟",
  good: "😊",
  neutral: "😐",
  bad: "😔",
};

const moodColors = {
  great: "bg-health text-health-foreground",
  good: "bg-academic text-academic-foreground",
  neutral: "bg-secondary text-secondary-foreground",
  bad: "bg-destructive/20 text-destructive",
};

export default function ReflectionPage() {
  const [reflections] = useState(mockReflections);
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [newReflection, setNewReflection] = useState("");

  const currentStreak = 5; // Mock streak
  const totalReflections = reflections.length;

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
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-muted-foreground">This month</p>
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
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <button
                    key={mood}
                    className={cn(
                      "rounded-lg px-3 py-2 text-lg transition-all hover:scale-110",
                      "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsWriting(false)}>
                  Cancel
                </Button>
                <Button className="bg-reflection text-reflection-foreground hover:bg-reflection/90">
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reflections List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Past Reflections</h3>
          {reflections.map((reflection, index) => (
            <div
              key={reflection.id}
              className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all animate-slide-up hover:border-reflection/30"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() =>
                setSelectedReflection(
                  selectedReflection?.id === reflection.id ? null : reflection
                )
              }
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-sm",
                      reflection.mood && moodColors[reflection.mood]
                    )}
                  >
                    {reflection.mood && moodEmojis[reflection.mood]}
                  </span>
                  <span className="font-medium">
                    {format(reflection.date, "EEEE, MMMM d")}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(reflection.date, "yyyy")}
                </span>
              </div>
              <p
                className={cn(
                  "text-muted-foreground transition-all",
                  selectedReflection?.id === reflection.id
                    ? ""
                    : "line-clamp-2"
                )}
              >
                {reflection.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
