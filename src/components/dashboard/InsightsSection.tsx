import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useDashboard } from "@/context/DashboardContext";
import { fmt } from "@/lib/currency";

const InsightsSection = () => {
  const { transactions, totalIncome, totalExpenses } = useDashboard();

  const insights = useMemo(() => {
    const expenseByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseByCategory[t.category] =
          (expenseByCategory[t.category] || 0) + t.amount;
      });
    const highestCategory = Object.entries(expenseByCategory).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const aprExpenses = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith("2025-04"))
      .reduce((s, t) => s + t.amount, 0);
    const marExpenses = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith("2025-03"))
      .reduce((s, t) => s + t.amount, 0);
    const monthlyChange =
      marExpenses > 0 ? ((aprExpenses - marExpenses) / marExpenses) * 100 : 0;

    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const largestExpense = transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0];

    return {
      highestCategory,
      monthlyChange,
      savingsRate,
      largestExpense,
      aprExpenses,
      marExpenses,
    };
  }, [transactions, totalIncome, totalExpenses]);

  const cards = [
    {
      title: "Top Spending",
      value: insights.highestCategory?.[0] || "N/A",
      detail: insights.highestCategory ? fmt(insights.highestCategory[1]) : "",
    },
    {
      title: "Monthly Change",
      value: `${insights.monthlyChange > 0 ? "+" : ""}${insights.monthlyChange.toFixed(1)}%`,
      detail: `Apr vs Mar expenses`,
    },
    {
      title: "Savings Rate",
      value: `${insights.savingsRate.toFixed(1)}%`,
      detail: "of income saved",
    },
    {
      title: "Largest Expense",
      value: insights.largestExpense?.description || "N/A",
      detail: insights.largestExpense
        ? `${fmt(insights.largestExpense.amount)} — ${insights.largestExpense.category}`
        : "",
    },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">Insights</h3>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Card
            key={i}
            className="p-3 sm:p-4 card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-hover group"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {c.title}
            </p>
            <p className="text-sm sm:text-lg font-bold text-card-foreground mt-0.5 truncate">
              {c.value}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
              {c.detail}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InsightsSection;
