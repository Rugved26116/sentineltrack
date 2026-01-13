import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

interface QuickStatsProps {
  stats: StatItem[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="glass-panel p-5 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">
              {stat.value}
            </span>
            {stat.change !== undefined && (
              <span
                className={cn(
                  "flex items-center text-xs font-medium",
                  stat.trend === "up"
                    ? "text-status-good"
                    : stat.trend === "down"
                    ? "text-status-bad"
                    : "text-muted-foreground"
                )}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-0.5 h-3 w-3" />
                ) : stat.trend === "down" ? (
                  <TrendingDown className="mr-0.5 h-3 w-3" />
                ) : (
                  <Minus className="mr-0.5 h-3 w-3" />
                )}
                {Math.abs(stat.change)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
