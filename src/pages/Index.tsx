import { GraduationCap, Dumbbell, Wallet, BookOpen } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { DomainCard } from "@/components/dashboard/DomainCard";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { MiniCalendar } from "@/components/calendar/MiniCalendar";
import { WeeklyActivityChart } from "@/components/dashboard/WeeklyActivityChart";
import { DomainProgressChart } from "@/components/dashboard/DomainProgressChart";
import { StreakChart } from "@/components/dashboard/StreakChart";
import { StudyHoursChart } from "@/components/dashboard/StudyHoursChart";
import { useAcademicTasks } from "@/hooks/useAcademicTasks";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useExpenses } from "@/hooks/useExpenses";
import { useReflections } from "@/hooks/useReflections";
import { isThisWeek, parseISO, isToday, subDays, format } from "date-fns";

export default function Dashboard() {
  const { tasks } = useAcademicTasks();
  const { workouts } = useWorkouts();
  const { expenses } = useExpenses();
  const { reflections } = useReflections();

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";

  // Calculate real stats
  const weeklyWorkouts = workouts.filter(w => isThisWeek(parseISO(w.workout_date))).length;
  const weeklyExpenses = expenses
    .filter(e => isThisWeek(parseISO(e.expense_date)))
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const activeSubjects = [...new Set(tasks.map(t => t.subject))].length;

  // Calculate reflection streak
  const calculateStreak = () => {
    if (reflections.length === 0) return 0;
    let streak = 0;
    for (let i = 0; i < reflections.length; i++) {
      const refDate = parseISO(reflections[i].reflection_date);
      const expectedDate = subDays(today, i);
      if (format(refDate, "yyyy-MM-dd") === format(expectedDate, "yyyy-MM-dd")) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const reflectionStreak = calculateStreak();

  // Build activity data for calendar
  const activityMap = new Map<string, Set<string>>();
  
  tasks.forEach(task => {
    const date = format(parseISO(task.created_at), "yyyy-MM-dd");
    if (!activityMap.has(date)) activityMap.set(date, new Set());
    activityMap.get(date)!.add("academic");
  });
  
  workouts.forEach(workout => {
    const date = workout.workout_date;
    if (!activityMap.has(date)) activityMap.set(date, new Set());
    activityMap.get(date)!.add("health");
  });
  
  expenses.forEach(expense => {
    const date = expense.expense_date;
    if (!activityMap.has(date)) activityMap.set(date, new Set());
    activityMap.get(date)!.add("finance");
  });
  
  reflections.forEach(reflection => {
    const date = reflection.reflection_date;
    if (!activityMap.has(date)) activityMap.set(date, new Set());
    activityMap.get(date)!.add("reflection");
  });

  const activities = Array.from(activityMap.entries()).map(([date, domains]) => ({
    date: parseISO(date),
    domains: Array.from(domains) as ("academic" | "health" | "finance" | "reflection")[],
  }));

  // Determine statuses
  const academicStatus = tasks.length > 0 && completedTasks / tasks.length >= 0.5 ? "good" : tasks.length === 0 ? "warning" : "bad";
  const healthStatus = weeklyWorkouts >= 3 ? "good" : weeklyWorkouts > 0 ? "warning" : "bad";
  const financeStatus = expenses.length > 0 ? "good" : "warning";
  const reflectionStatus = reflectionStreak >= 3 ? "good" : reflectionStreak > 0 ? "warning" : "bad";

  const stats = [
    { label: "Tasks", value: `${completedTasks}/${tasks.length}`, trend: "neutral" as const },
    { label: "Workouts", value: String(weeklyWorkouts), trend: weeklyWorkouts >= 3 ? "up" as const : "down" as const },
    { label: "Expenses", value: `₹${(weeklyExpenses / 1000).toFixed(1)}k`, trend: "neutral" as const },
    { label: "Streak", value: `${reflectionStreak} days`, trend: reflectionStreak > 0 ? "up" as const : "neutral" as const },
  ];

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl animate-fade-in">
        <PageHeader
          title={`${greeting} 👋`}
          description={`Today is ${today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}. Here's how your systems are doing.`}
        />

        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats stats={stats} />
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <WeeklyActivityChart />
          <DomainProgressChart />
          <StreakChart />
          <StudyHoursChart />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Domain Cards */}
          <div className="space-y-6 lg:col-span-2">
            <h2 className="text-lg font-semibold">Your Systems</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <DomainCard
                domain="academic"
                title="Academic Weapon"
                icon={<GraduationCap className="h-6 w-6" />}
                status={academicStatus}
                statusText={academicStatus === "good" ? "On Track" : academicStatus === "warning" ? "Getting Started" : "Needs Focus"}
                description="Subject-wise study tracking and revision habits"
                metric={String(activeSubjects)}
                metricLabel="subjects active"
                href="/academic"
              />
              <DomainCard
                domain="health"
                title="Health"
                icon={<Dumbbell className="h-6 w-6" />}
                status={healthStatus}
                statusText={healthStatus === "good" ? "Consistent" : healthStatus === "warning" ? "Warming Up" : "Inconsistent"}
                description="Workout logs, exercises, sets, and reps"
                metric={String(weeklyWorkouts)}
                metricLabel="workouts this week"
                href="/health"
              />
              <DomainCard
                domain="finance"
                title="Finance"
                icon={<Wallet className="h-6 w-6" />}
                status={financeStatus}
                statusText={financeStatus === "good" ? "Tracking" : "Start Tracking"}
                description="Expense logging and spending awareness"
                metric={`₹${(weeklyExpenses / 1000).toFixed(1)}k`}
                metricLabel="spent this week"
                href="/finance"
              />
              <DomainCard
                domain="reflection"
                title="Reflection"
                icon={<BookOpen className="h-6 w-6" />}
                status={reflectionStatus}
                statusText={reflectionStatus === "good" ? "Active" : reflectionStatus === "warning" ? "Building" : "Start Reflecting"}
                description="Daily reflections and insights"
                metric={String(reflectionStreak)}
                metricLabel="day streak"
                href="/reflection"
              />
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="lg:col-span-1">
            <h2 className="mb-6 text-lg font-semibold">Activity Calendar</h2>
            <MiniCalendar activities={activities} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
