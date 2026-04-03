import { useDashboard } from '../../context/DashboardContext';
import { Card } from '../ui/card';
import { fmt } from '../../lib/currency';

const SummaryCards = () => {
  const { totalBalance, totalIncome, totalExpenses } = useDashboard();

  const cards = [
    {
      label: "Total Balance",
      value: totalBalance,
      change: "+12.5%",
      tone: "positive",
    },
    {
      label: "Total Income",
      value: totalIncome,
      change: "+8.2%",
      tone: "positive",
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      change: "-3.1%",
      tone: "negative",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c, i) => (
        <Card
          key={c.label}
          className="p-4 sm:p-5 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 animate-fade-in group"
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {c.label}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-card-foreground tracking-tight">
              {fmt(c.value)}
            </p>
            <div
              className={`text-xs font-medium ${c.tone === "positive" ? "text-success" : "text-destructive"}`}
            >
              {c.change}
              <span className="text-muted-foreground font-normal ml-1 hidden sm:inline">
                vs last month
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
export default SummaryCards;
