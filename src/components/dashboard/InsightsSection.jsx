import { useMemo } from "react";
import { Card } from '../ui/card';
import { useDashboard } from '../../context/DashboardContext';
import { fmt } from '../../lib/currency';

const getExpenseTotalsByCategory = (transactions) => {
  return transactions.reduce((totals, transaction) => {
    if (transaction.type !== "expense") {
      return totals;
    }

    totals[transaction.category] =
      (totals[transaction.category] || 0) + transaction.amount;

    return totals;
  }, {});
};

const getMonthExpenses = (transactions, monthPrefix) => {
  return transactions.reduce((sum, transaction) => {
    if (
      transaction.type !== "expense" ||
      !transaction.date.startsWith(monthPrefix)
    ) {
      return sum;
    }

    return sum + transaction.amount;
  }, 0);
};

const findLargestExpense = (transactions) => {
  return transactions.reduce((largest, transaction) => {
    if (transaction.type !== "expense") {
      return largest;
    }

    if (!largest || transaction.amount > largest.amount) {
      return transaction;
    }

    return largest;
  }, null);
};

const InsightsSection = () => {
  const { transactions, totalIncome, totalExpenses } = useDashboard();
  const insights = useMemo(() => {
    const expenseByCategory = getExpenseTotalsByCategory(transactions);
    const highestCategory = Object.entries(expenseByCategory).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const aprExpenses = getMonthExpenses(transactions, "2025-04");
    const marExpenses = getMonthExpenses(transactions, "2025-03");

    const monthlyChange =
      marExpenses > 0 ? ((aprExpenses - marExpenses) / marExpenses) * 100 : 0;

    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const largestExpense = findLargestExpense(transactions);

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
        ? `${fmt(insights.largestExpense.amount)} - ${insights.largestExpense.category}`
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
            style={{
              animationDelay: `${i * 80}ms`,
            }}
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
