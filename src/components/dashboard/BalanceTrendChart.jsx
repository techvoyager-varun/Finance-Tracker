import { Card } from "@/components/ui/card";
import { monthlyBalanceData } from "@/data/mockData";
import { useDashboard } from "@/context/DashboardContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
const BalanceTrendChart = () => {
  const { theme } = useDashboard();
  const gridColor =
    theme === "dark" ? "hsl(220, 20%, 20%)" : "hsl(220, 13%, 91%)";
  const tickColor =
    theme === "dark" ? "hsl(220, 9%, 60%)" : "hsl(220, 9%, 46%)";
  const tooltipBg =
    theme === "dark" ? "hsl(222, 47%, 11%)" : "hsl(0, 0%, 100%)";
  return (
    <Card className="p-4 sm:p-5 card-shadow animate-fade-in h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Balance Trend
        </h3>
        <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-2 py-0.5">
          Last 7 months
        </span>
      </div>
      <div className="h-[220px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyBalanceData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(217, 91%, 60%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(217, 91%, 60%)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(0, 84%, 60%)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(0, 84%, 60%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: tickColor }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${gridColor}`,
                fontSize: "12px",
                color: tickColor,
              }}
              formatter={(value) => [
                `\u20B9${value.toLocaleString("en-IN")}`,
                void 0,
              ]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px" }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(217, 91%, 60%)"
              fill="url(#incomeGrad)"
              strokeWidth={2}
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(0, 84%, 60%)"
              fill="url(#expenseGrad)"
              strokeWidth={2}
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default BalanceTrendChart;
