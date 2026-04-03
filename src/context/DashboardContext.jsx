import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { transactions as initialTransactions } from '../data/mockData';
import { useTheme } from '../hooks/useTheme';

const DashboardContext = createContext(null);

const STORAGE_KEY = "finance_dashboard_transactions";
const ROLE_KEY = "finance_dashboard_role";
const DEFAULT_FILTERS = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortOrder: "desc",
  dateFrom: "",
  dateTo: "",
};

const loadTransactions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialTransactions;
  } catch {
    return initialTransactions;
  }
};

const loadRole = () => {
  try {
    const stored = localStorage.getItem(ROLE_KEY);
    return stored === "admin" || stored === "viewer" ? stored : "admin";
  } catch {
    return "admin";
  }
};

const sortTransactions = (items, sortBy, sortOrder) => {
  const direction = sortOrder === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    if (sortBy === "date") {
      return (
        direction * (new Date(a.date).getTime() - new Date(b.date).getTime())
      );
    }

    return direction * (a.amount - b.amount);
  });
};

const filterTransactions = (transactions, filters) => {
  const search = filters.search.trim().toLowerCase();

  const result = transactions.filter((transaction) => {
    if (search) {
      const matchesSearch =
        transaction.description.toLowerCase().includes(search) ||
        transaction.category.toLowerCase().includes(search);

      if (!matchesSearch) {
        return false;
      }
    }

    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }

    if (
      filters.category !== "all" &&
      transaction.category !== filters.category
    ) {
      return false;
    }

    if (filters.dateFrom && transaction.date < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && transaction.date > filters.dateTo) {
      return false;
    }

    return true;
  });

  return sortTransactions(result, filters.sortBy, filters.sortOrder);
};

const downloadFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};

const totalsFromTransactions = (transactions) => {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === "income") {
        totals.income += transaction.amount;
      }

      if (transaction.type === "expense") {
        totals.expenses += transaction.amount;
      }

      return totals;
    },
    { income: 0, expenses: 0 },
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
};

export const DashboardProvider = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [role, setRoleState] = useState(loadRole);
  const [transactions, setTransactions] = useState(loadTransactions);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const setRole = useCallback((nextRole) => {
    setRoleState(nextRole);
    localStorage.setItem(ROLE_KEY, nextRole);
  }, []);

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filters);
  }, [transactions, filters]);

  const addTransaction = useCallback((transaction) => {
    setTransactions((previous) => [
      {
        ...transaction,
        id: crypto.randomUUID(),
      },
      ...previous,
    ]);
  }, []);

  const updateTransaction = useCallback((id, transaction) => {
    setTransactions((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...transaction,
          id,
        };
      }),
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const totals = useMemo(
    () => totalsFromTransactions(transactions),
    [transactions],
  );
  const totalIncome = totals.income;
  const totalExpenses = totals.expenses;
  const totalBalance = totalIncome - totalExpenses;

  const exportData = useCallback(
    (format) => {
      if (format === "csv") {
        const csvHeader = "Date,Description,Category,Type,Amount";
        const csvRows = filteredTransactions.map(
          (transaction) =>
            `${transaction.date},"${transaction.description}",${transaction.category},${transaction.type},${transaction.amount}`,
        );

        downloadFile(
          [csvHeader, ...csvRows].join("\n"),
          "transactions.csv",
          "text/csv",
        );

        return;
      }

      downloadFile(
        JSON.stringify(filteredTransactions, null, 2),
        "transactions.json",
        "application/json",
      );
    },
    [filteredTransactions],
  );

  const value = {
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
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
