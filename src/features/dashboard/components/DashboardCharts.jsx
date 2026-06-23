"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function DashboardCharts({ weeklyDurationData, weeklyNutritionData }) {
  const weeklyCalories = weeklyNutritionData.reduce((sum, day) => sum + day.calories, 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-white/5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Weekly Training Volume</h3>
          <span className="material-icons cursor-pointer text-primary">bar_chart</span>
        </div>
        <div className="h-40">
          <ChartContainer className="h-40 w-full" config={{ minutes: { label: "Minutes", color: "#0df259" } }}>
            <BarChart data={weeklyDurationData}>
              <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-white/5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Weekly Calories</h3>
          <div className="flex space-x-4">
            <span className="text-xs font-bold text-primary">{weeklyCalories} kcal</span>
          </div>
        </div>
        <div className="h-40">
          <ChartContainer className="h-40 w-full" config={{ calories: { label: "Calories", color: "#0df259" } }}>
            <LineChart data={weeklyNutritionData}>
              <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="var(--color-calories)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-calories)" }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
