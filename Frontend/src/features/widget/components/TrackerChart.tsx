import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export interface TransactionChartItem {
  id: string;
  name: string;
  amount: number;
  type: "income" | "expense";
}

interface TrackerChartProps {
  data: TransactionChartItem[];
}

const PIE_COLORS = [
  "#3b82f6", 
  "#10b981", 
  "#f97316", 
  "#ef4444", 
  "#8b5cf6", 
  "#ec4899", 
  "#06b6d4", 
  "#eab308", 
  "#14b8a6",
];

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const isIncome = item.type === "income";

    return (
      <div className="bg-popover text-popover-foreground border border-border/80 px-3 py-2 rounded-lg shadow-lg text-xs min-w-[120px] pointer-events-none z-50">
        <span className="font-semibold text-foreground block truncate max-w-[160px]">
          {item.name}
        </span>
        <span
          className={`font-bold block mt-0.5 ${
            isIncome
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isIncome ? "+" : "-"}${Number(item.amount).toFixed(2)}
        </span>
      </div>
    );
  }
  return null;
}

export function TrackerChart({ data }: TrackerChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl bg-muted/10">
        No transactions to display chart
      </div>
    );
  }

  return (
    <div className="relative h-40 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            paddingAngle={3}
            dataKey="amount"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                className="hover:opacity-85 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-base font-bold text-foreground leading-none">
          {data.length}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
          total
        </span>
      </div>
    </div>
  );
}