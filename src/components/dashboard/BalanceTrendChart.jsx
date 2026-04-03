import { Card } from '../ui/card';
import { monthlyBalanceData } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
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

const CHART_COLORS = {
  income: "hsl(217, 91%, 60%)",
  expense: "hsl(0, 84%, 60%)",
};

const THEME_STYLES = {
  dark: {
    gridColor: "hsl(220, 20%, 20%)",
    tickColor: "hsl(220, 9%, 60%)",
    tooltipBg: "hsl(222, 47%, 11%)",
  },
  light: {
    gridColor: "hsl(220, 13%, 91%)",
    tickColor: "hsl(220, 9%, 46%)",
    tooltipBg: "hsl(0, 0%, 100%)",
  },
};

const BalanceTrendChart = () => {
  const { theme } = useDashboard();
  const { gridColor, tickColor, tooltipBg } =
    theme === "dark" ? THEME_STYLES.dark : THEME_STYLES.light;

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
            margin={{
              top: 5,
              right: 5,
              left: 8,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.income}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.income}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.expense}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.expense}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="month"
              tick={{
                fontSize: 11,
                fill: tickColor,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 11,
                fill: tickColor,
              }}
              tickMargin={8}
              axisLine={false}
              tickLine={false}
              width={56}
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
                undefined,
              ]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: "11px",
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke={CHART_COLORS.income}
              fill="url(#incomeGrad)"
              strokeWidth={2}
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={CHART_COLORS.expense}
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
