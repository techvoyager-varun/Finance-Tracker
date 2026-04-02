import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/context/DashboardContext";
import { incomeCategories, expenseCategories } from "@/data/mockData";
const getTodayDate = () => new Date().toISOString().split("T")[0];
const AddTransactionDialog = ({ open, onOpenChange, transaction }) => {
  const { addTransaction, updateTransaction } = useDashboard();
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const openNativeDatePicker = (input) => {
    if (!input) return;
    input.focus();
    const dateInput = input;
    if (typeof dateInput.showPicker === "function") {
      try {
        dateInput.showPicker();
      } catch {}
    }
  };
  const isEditMode = !!transaction;
  const resetForm = () => {
    setType("expense");
    setDescription("");
    setAmount("");
    setCategory("");
    setDate(getTodayDate());
  };
  useEffect(() => {
    if (!open) return;
    if (transaction) {
      setType(transaction.type);
      setDescription(transaction.description);
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      setDate(transaction.date);
      return;
    }
    resetForm();
  }, [open, transaction]);
  const cats = type === "income" ? incomeCategories : expenseCategories;
  const handleSubmit = () => {
    if (!description.trim() || !amount || !category || !date) return;
    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount)) return;
    const payload = {
      date,
      description: description.trim(),
      amount: parsedAmount,
      category,
      type,
    };
    if (transaction) {
      updateTransaction(transaction.id, payload);
    } else {
      addTransaction(payload);
    }
    onOpenChange(false);
    resetForm();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] overflow-y-auto p-4 sm:max-w-[420px] sm:p-6">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  setType(v);
                  setCategory("");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => openNativeDatePicker(e.currentTarget)}
                onTouchEnd={(e) => openNativeDatePicker(e.currentTarget)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Input
              placeholder="e.g. Monthly Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {cats.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!description.trim() || !amount || !category}
          >
            {isEditMode ? "Update Transaction" : "Add Transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddTransactionDialog;
