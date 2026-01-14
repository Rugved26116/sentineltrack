import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { day: "Mon", academic: 3, health: 1, finance: 2 },
  { day: "Tue", academic: 2, health: 1, finance: 1 },
  { day: "Wed", academic: 4, health: 1, finance: 0 },
  { day: "Thu", academic: 2, health: 0, finance: 3 },
  { day: "Fri", academic: 3, health: 1, finance: 1 },
  { day: "Sat", academic: 1, health: 2, finance: 2 },
  { day: "Sun", academic: 0, health: 1, finance: 0 },
];

export function WeeklyActivityChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
              <XAxis 
                dataKey="day" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(217 33% 17%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(210 40% 98%)" }}
                itemStyle={{ color: "hsl(210 40% 98%)" }}
              />
              <Bar 
                dataKey="academic" 
                stackId="a" 
                fill="hsl(217 91% 60%)" 
                radius={[0, 0, 0, 0]}
                name="Academic"
              />
              <Bar 
                dataKey="health" 
                stackId="a" 
                fill="hsl(142 71% 45%)" 
                radius={[0, 0, 0, 0]}
                name="Health"
              />
              <Bar 
                dataKey="finance" 
                stackId="a" 
                fill="hsl(38 92% 50%)" 
                radius={[4, 4, 0, 0]}
                name="Finance"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(217_91%_60%)]" />
            <span className="text-xs text-muted-foreground">Academic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(142_71%_45%)]" />
            <span className="text-xs text-muted-foreground">Health</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(38_92%_50%)]" />
            <span className="text-xs text-muted-foreground">Finance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
