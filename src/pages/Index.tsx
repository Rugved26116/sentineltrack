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

// Mock data for demonstration
const mockActivities = [
  { date: new Date(2026, 0, 10), domains: ["academic", "health"] as const },
  { date: new Date(2026, 0, 11), domains: ["health", "finance"] as const },
  { date: new Date(2026, 0, 12), domains: ["academic", "health", "reflection"] as const },
  { date: new Date(2026, 0, 13), domains: ["academic"] as const },
];

const stats = [
  { label: "Active Days", value: "18", change: 12, trend: "up" as const },
  { label: "Study Hours", value: "42h", change: 8, trend: "up" as const },
  { label: "Workouts", value: "12", change: -5, trend: "down" as const },
  { label: "Tracked Expenses", value: "₹8.5k", change: 0, trend: "neutral" as const },
];

export default function Dashboard() {
  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";

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
                status="good"
                statusText="On Track"
                description="Subject-wise study tracking and revision habits"
                metric="4"
                metricLabel="subjects active"
                href="/academic"
              />
              <DomainCard
                domain="health"
                title="Health"
                icon={<Dumbbell className="h-6 w-6" />}
                status="warning"
                statusText="Inconsistent"
                description="Workout logs, exercises, sets, and reps"
                metric="3"
                metricLabel="workouts this week"
                href="/health"
              />
              <DomainCard
                domain="finance"
                title="Finance"
                icon={<Wallet className="h-6 w-6" />}
                status="good"
                statusText="Controlled"
                description="Expense logging and spending awareness"
                metric="₹2.4k"
                metricLabel="spent this week"
                href="/finance"
              />
              <DomainCard
                domain="reflection"
                title="Reflection"
                icon={<BookOpen className="h-6 w-6" />}
                status="good"
                statusText="Active"
                description="Daily reflections and insights"
                metric="5"
                metricLabel="day streak"
                href="/reflection"
              />
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="lg:col-span-1">
            <h2 className="mb-6 text-lg font-semibold">Activity Calendar</h2>
            <MiniCalendar
              activities={mockActivities.map((a) => ({
                date: a.date,
                domains: [...a.domains],
              }))}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
