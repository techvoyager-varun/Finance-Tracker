import { useDashboard } from "@/context/DashboardContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowUpDown,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  CalendarDays,
  FileText,
  X,
} from "lucide-react";
import { categories, type Transaction } from "@/data/mockData";
import { useEffect, useMemo, useRef, useState } from "react";
import AddTransactionDialog from "./AddTransactionDialog";
import { fmt } from "@/lib/currency";

const PAGE_SIZE = 10;

const TransactionsTable = () => {
  const { role, filteredTransactions, filters, setFilters, deleteTransaction } =
    useDashboard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const openNativeDatePicker = (event: React.MouseEvent<HTMLInputElement>) => {
    const dateInput = event.currentTarget as HTMLInputElement & {
      showPicker?: () => void;
    };
    if (typeof dateInput.showPicker === "function") {
      try {
        dateInput.showPicker();
      } catch {
        // Ignore browsers/environments where showPicker is blocked.
      }
    }
  };

  const openDatePickerFromRef = (input: HTMLInputElement | null) => {
    if (!input) return;
    input.focus();
    const pickerInput = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof pickerInput.showPicker === "function") {
      try {
        pickerInput.showPicker();
      } catch {
        // Ignore browsers/environments where showPicker is blocked.
      }
    }
  };

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;

  const paginatedTransactions = useMemo(
    () => filteredTransactions.slice(pageStart, pageEnd),
    [filteredTransactions, pageStart, pageEnd],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.search,
    filters.type,
    filters.category,
    filters.dateFrom,
    filters.dateTo,
    filters.sortOrder,
    filters.sortBy,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setFilters((f) => ({
      ...f,
      search: "",
      type: "all",
      category: "all",
      dateFrom: "",
      dateTo: "",
    }));
  };

  const openAddDialog = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
  };

  return (
    <Card className="card-shadow animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-card-foreground">
            Transactions
          </h3>
          <Badge
            variant="secondary"
            className="text-[10px] font-normal px-1.5 py-0"
          >
            {filteredTransactions.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs gap-1 text-muted-foreground"
            >
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
          {role === "admin" && (
            <Button
              size="sm"
              onClick={openAddDialog}
              className="h-8 gap-1.5 text-xs transition-transform duration-200 hover:scale-105"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center p-3 sm:p-4 bg-muted/30 border-b border-border flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="pl-8 h-8 text-xs bg-background"
          />
        </div>
        <Select
          value={filters.type}
          onValueChange={(v) => setFilters((f) => ({ ...f, type: v as any }))}
        >
          <SelectTrigger className="w-full sm:w-[110px] h-8 text-xs bg-background">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.category}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, category: v as any }))
          }
        >
          <SelectTrigger className="w-full sm:w-[130px] h-8 text-xs bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:flex-nowrap">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 hidden sm:block" />
          <div className="relative min-w-[130px] flex-1 sm:w-[140px] sm:flex-none">
            <Input
              ref={fromDateRef}
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateFrom: e.target.value }))
              }
              onClick={openNativeDatePicker}
              max={filters.dateTo || undefined}
              className="date-field-input h-8 w-full bg-background pr-8 text-xs"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => openDatePickerFromRef(fromDateRef.current)}
            >
              <CalendarDays className="h-3.5 w-3.5" />
            </Button>
          </div>
          <span className="text-muted-foreground text-[10px]">to</span>
          <div className="relative min-w-[130px] flex-1 sm:w-[140px] sm:flex-none">
            <Input
              ref={toDateRef}
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateTo: e.target.value }))
              }
              onClick={openNativeDatePicker}
              min={filters.dateFrom || undefined}
              className="date-field-input h-8 w-full bg-background pr-8 text-xs"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => openDatePickerFromRef(toDateRef.current)}
            >
              <CalendarDays className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setFilters((f) => ({
              ...f,
              sortOrder: f.sortOrder === "asc" ? "desc" : "asc",
            }))
          }
          className="h-8 gap-1 text-xs"
        >
          <ArrowUpDown className="h-3 w-3" />
          {filters.sortOrder === "asc" ? "Old" : "New"}
        </Button>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="p-3 bg-muted/50 mb-3">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No transactions found
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your filters or add a new transaction
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-3 text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-hidden">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="w-[10%] text-left font-medium text-muted-foreground py-2.5 px-3 text-xs">
                    Date
                  </th>
                  <th className="w-[36%] text-left font-medium text-muted-foreground py-2.5 px-3 text-xs">
                    Description
                  </th>
                  <th className="w-[12%] text-left font-medium text-muted-foreground py-2.5 px-3 text-xs">
                    Type
                  </th>
                  <th className="w-[16%] text-left font-medium text-muted-foreground py-2.5 px-3 text-xs">
                    Category
                  </th>
                  <th className="w-[16%] text-right font-medium text-muted-foreground py-2.5 px-3 text-xs">
                    Amount
                  </th>
                  {role === "admin" && (
                    <th className="w-[10%] text-right font-medium text-muted-foreground py-2.5 px-3 text-xs"></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150"
                  >
                    <td className="py-3 px-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-3 font-medium text-card-foreground text-sm truncate">
                      <span className="block truncate">{t.description}</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium leading-none whitespace-nowrap ${
                          t.type === "income"
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }`}
                      >
                        {t.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="secondary"
                        className="rounded-md border border-border/60 bg-muted/70 px-2 py-0.5 text-[10px] font-medium leading-none whitespace-nowrap text-muted-foreground hover:bg-muted/70"
                      >
                        {t.category}
                      </Badge>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-semibold text-sm ${t.type === "income" ? "text-success" : "text-destructive"}`}
                    >
                      <span className="inline-flex w-full items-center justify-end whitespace-nowrap tabular-nums">
                        {t.type === "income" ? "+" : "-"}
                        {fmt(t.amount)}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => openEditDialog(t)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => deleteTransaction(t.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-border">
            {paginatedTransactions.map((t) => (
              <div
                key={t.id}
                className="p-3 hover:bg-muted/30 transition-colors duration-150"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 font-medium text-sm text-card-foreground truncate">
                      {t.description}
                    </p>
                    <span
                      className={`flex-shrink-0 whitespace-nowrap tabular-nums font-semibold text-sm ${t.type === "income" ? "text-success" : "text-destructive"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {fmt(t.amount)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        })}
                      </span>
                      <Badge
                        variant="outline"
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium leading-none whitespace-nowrap ${
                          t.type === "income"
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }`}
                      >
                        {t.type === "income" ? "Income" : "Expense"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="rounded-md border border-border/60 bg-muted/70 px-2 py-0.5 text-[10px] font-medium leading-none whitespace-nowrap text-muted-foreground hover:bg-muted/70"
                      >
                        {t.category}
                      </Badge>
                    </div>

                    {role === "admin" && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-primary"
                          onClick={() => openEditDialog(t)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTransaction(t.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length > 0 && (
            <div className="border-t border-border px-3 py-3 sm:px-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-muted-foreground">
                  Showing {pageStart + 1}-{Math.min(pageEnd, totalItems)} of{" "}
                  {totalItems}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </Button>
                  <span className="text-[11px] text-muted-foreground min-w-[72px] text-center">
                    Page {currentPage}/{totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        transaction={editingTransaction}
      />
    </Card>
  );
};

export default TransactionsTable;
