import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const data = [
  { date: "Week 1", hours: 8 },
  { date: "Week 2", hours: 12 },
  { date: "Week 3", hours: 10 },
  { date: "Week 4", hours: 15 },
  { date: "Week 5", hours: 14 },
  { date: "Week 6", hours: 18 },
];

export function StudyHoursChart() {
  const currentHours = data[data.length - 1].hours;
  const previousHours = data[data.length - 2].hours;
  const change = ((currentHours - previousHours) / previousHours * 100).toFixed(0);
  const average = Math.round(data.reduce((acc, d) => acc + d.hours, 0) / data.length);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Study Hours Trend</CardTitle>
          <div className="flex items-center gap-1.5 text-[hsl(142_71%_45%)]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">+{change}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="studyGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                  <stop offset="100%" stopColor="hsl(270 70% 60%)" />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }}
              />
              <YAxis hide domain={[0, 'dataMax + 5']} />
              <ReferenceLine 
                y={average} 
                stroke="hsl(215 20% 35%)" 
                strokeDasharray="3 3"
                label={{ 
                  value: `Avg: ${average}h`, 
                  position: "right",
                  fill: "hsl(215 20% 55%)",
                  fontSize: 10
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(217 33% 17%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(210 40% 98%)" }}
                formatter={(value: number) => [`${value} hours`, "Study Time"]}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="url(#studyGradient)"
                strokeWidth={3}
                dot={{ fill: "hsl(217 91% 60%)", strokeWidth: 0, r: 4 }}
                activeDot={{ fill: "hsl(217 91% 60%)", strokeWidth: 2, stroke: "hsl(222 47% 8%)", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">This week</span>
          <span className="font-medium text-[hsl(217_91%_60%)]">{currentHours} hours</span>
        </div>
      </CardContent>
    </Card>
  );
}
