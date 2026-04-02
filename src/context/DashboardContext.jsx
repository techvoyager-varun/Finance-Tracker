import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { transactions as initialTransactions } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
const DashboardContext = createContext(null);
const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
};
const STORAGE_KEY = "finance_dashboard_transactions";
const ROLE_KEY = "finance_dashboard_role";
const loadTransactions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return initialTransactions;
};
const loadRole = () => {
  try {
    const stored = localStorage.getItem(ROLE_KEY);
    if (stored === "admin" || stored === "viewer") return stored;
  } catch {}
  return "admin";
};
const DashboardProvider = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [role, setRoleState] = useState(loadRole);
  const [transactions, setTransactions] = useState(loadTransactions);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
    dateFrom: "",
    dateTo: "",
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);
  const setRole = useCallback((r) => {
    setRoleState(r);
    localStorage.setItem(ROLE_KEY, r);
  }, []);
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(s) ||
          t.category.toLowerCase().includes(s),
      );
    }
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }
    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo);
    }
    result.sort((a, b) => {
      const mul = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date")
        return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);
  const addTransaction = useCallback((tx) => {
    setTransactions((prev) => [{ ...tx, id: crypto.randomUUID() }, ...prev]);
  }, []);
  const updateTransaction = useCallback((id, tx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...tx, id } : t)),
    );
  }, []);
  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const totalBalance = totalIncome - totalExpenses;
  const exportData = useCallback(
    (format) => {
      const data = filteredTransactions;
      let content;
      let mimeType;
      let filename;
      if (format === "csv") {
        const header = "Date,Description,Category,Type,Amount";
        const rows = data.map(
          (t) =>
            `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`,
        );
        content = [header, ...rows].join("\n");
        mimeType = "text/csv";
        filename = "transactions.csv";
      } else {
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
        filename = "transactions.json";
      }
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    [filteredTransactions],
  );
  return (
    <DashboardContext.Provider
      value={{
        role,
        setRole,
        transactions,
        filters,
        setFilters,
        filteredTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        totalIncome,
        totalExpenses,
        totalBalance,
        theme,
        toggleTheme,
        exportData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
export { DashboardProvider, useDashboard };
