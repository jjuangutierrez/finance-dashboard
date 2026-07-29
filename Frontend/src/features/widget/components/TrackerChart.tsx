import { useState } from "react";
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartData {
  name: string;
  amount: number;
}

interface TrackerChartProps {
  data: ChartData[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function TrackerChart({ data }: TrackerChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-lg">
        No expense data to display chart
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end gap-1">
        <Button
          variant={chartType === "bar" ? "secondary" : "ghost"}
          size="icon"
          className="h-6 w-6"
          onClick={() => setChartType("bar")}
          title="Bar Chart"
        >
          <BarChart3 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant={chartType === "pie" ? "secondary" : "ghost"}
          size="icon"
          className="h-6 w-6"
          onClick={() => setChartType("pie")}
          title="Pie Chart"
        >
          <PieChartIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} />
              <YAxis fontSize={10} tickLine={false} />
              <Tooltip formatter={(value: any) => [`$${value ?? 0}`, "Amount"]} />
              <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={4}
                dataKey="amount"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`$${value ?? 0}`, "Amount"]} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}