import { Card } from "@/components/ui/card";
import { useDashboard } from "@/context/DashboardContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import { fmtShort } from "@/lib/currency";
const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 67%, 60%)",
  "hsl(350, 80%, 60%)",
  "hsl(190, 80%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(30, 80%, 55%)",
];
const SpendingBreakdownChart = () => {
  const { transactions } = useDashboard();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const pieContainerRef = useRef(null);
  const data = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  useEffect(() => {
    if (data.length === 0) {
      setSelectedIndex(null);
      return;
    }
    setSelectedIndex((prev) =>
      prev !== null && prev < data.length ? prev : null,
    );
  }, [data]);
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleOutsideClick = (event) => {
      if (!pieContainerRef.current?.contains(event.target)) {
        setSelectedIndex(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", handleOutsideClick);
  }, [selectedIndex]);
  const selectedItem =
    selectedIndex !== null && selectedIndex < data.length
      ? data[selectedIndex]
      : null;
  const selectedPct =
    selectedItem && total > 0
      ? ((selectedItem.value / total) * 100).toFixed(1)
      : "0";
  return (
    <Card className="p-4 sm:p-5 card-shadow animate-fade-in h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Spending Breakdown
        </h3>
        <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-2 py-0.5">
          {data.length} categories
        </span>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">
          No expense data available
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div
            ref={pieContainerRef}
            className="w-full h-[180px] sm:h-[200px] spending-pie-chart"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  rootTabIndex={-1}
                  onClick={(_, index) => setSelectedIndex(index)}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {selectedItem && (
            <div className="w-full rounded-md border border-border/60 bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-card-foreground">
                {selectedItem.name}
              </span>{" "}
              - {fmtShort(selectedItem.value)} ({selectedPct}%)
            </div>
          )}
          <div className="w-full space-y-1.5 max-h-[120px] overflow-y-auto overflow-x-hidden pr-1">
            {data.map((item, i) => {
              const pct =
                total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
              return (
                <div
                  key={item.name}
                  className="grid grid-cols-[minmax(0,1fr)_46px_84px] items-center text-xs sm:text-sm hover:bg-muted/50 transition-colors duration-150 px-1.5 py-1 gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2 h-2 flex-shrink-0"
                      style={{
                        backgroundColor: COLORS[i % COLORS.length],
                      }}
                    />
                    <span className="text-muted-foreground truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-[10px] text-right tabular-nums">
                    {pct}%
                  </span>
                  <span className="font-medium text-card-foreground text-right tabular-nums">
                    {fmtShort(item.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
export default SpendingBreakdownChart;
