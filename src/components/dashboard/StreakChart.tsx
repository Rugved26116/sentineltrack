import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

const data = [
  { date: "Jan 1", streak: 1 },
  { date: "Jan 2", streak: 2 },
  { date: "Jan 3", streak: 3 },
  { date: "Jan 4", streak: 4 },
  { date: "Jan 5", streak: 0 },
  { date: "Jan 6", streak: 1 },
  { date: "Jan 7", streak: 2 },
  { date: "Jan 8", streak: 3 },
  { date: "Jan 9", streak: 4 },
  { date: "Jan 10", streak: 5 },
  { date: "Jan 11", streak: 6 },
  { date: "Jan 12", streak: 7 },
  { date: "Jan 13", streak: 8 },
  { date: "Jan 14", streak: 9 },
];

export function StreakChart() {
  const currentStreak = data[data.length - 1].streak;
  const maxStreak = Math.max(...data.map(d => d.streak));

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Consistency Streak</CardTitle>
          <div className="flex items-center gap-1.5 rounded-full bg-[hsl(38_92%_50%/0.15)] px-2.5 py-1">
            <Flame className="h-3.5 w-3.5 text-[hsl(38_92%_50%)]" />
            <span className="text-xs font-medium text-[hsl(38_92%_50%)]">{currentStreak} days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis hide domain={[0, 'dataMax + 2']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(217 33% 17%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(210 40% 98%)" }}
                formatter={(value: number) => [`${value} days`, "Streak"]}
              />
              <Area
                type="monotone"
                dataKey="streak"
                stroke="hsl(38 92% 50%)"
                strokeWidth={2}
                fill="url(#streakGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Best streak</span>
          <span className="font-medium">{maxStreak} days</span>
        </div>
      </CardContent>
    </Card>
  );
}
