import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { useDashboard } from '../../context/DashboardContext';
import { incomeCategories, expenseCategories } from '../../data/mockData';

const getTodayDate = () => new Date().toISOString().split("T")[0];

const defaultFormState = () => ({
  type: "expense",
  description: "",
  amount: "",
  category: "",
  date: getTodayDate(),
});

const openNativeDatePicker = (input) => {
  if (!input) {
    return;
  }

  input.focus();

  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
    } catch {
      return;
    }
  }
};

const AddTransactionDialog = ({ open, onOpenChange, transaction }) => {
  const { addTransaction, updateTransaction } = useDashboard();
  const [form, setForm] = useState(defaultFormState);

  const isEditMode = Boolean(transaction);

  const resetForm = () => setForm(defaultFormState());

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    if (transaction) {
      setForm({
        type: transaction.type,
        description: transaction.description,
        amount: String(transaction.amount),
        category: transaction.category,
        date: transaction.date,
      });

      return;
    }

    resetForm();
  }, [open, transaction]);

  const categories =
    form.type === "income" ? incomeCategories : expenseCategories;

  const canSubmit =
    Boolean(form.description.trim()) &&
    Boolean(form.amount) &&
    Boolean(form.category) &&
    Boolean(form.date);

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    const parsedAmount = parseFloat(form.amount);
    if (Number.isNaN(parsedAmount)) {
      return;
    }

    const payload = {
      date: form.date,
      description: form.description.trim(),
      amount: parsedAmount,
      category: form.category,
      type: form.type,
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
                value={form.type}
                onValueChange={(v) => {
                  setForm((previous) => ({
                    ...previous,
                    type: v,
                    category: "",
                  }));
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
                value={form.date}
                onChange={(e) => updateForm("date", e.target.value)}
                onClick={(e) => openNativeDatePicker(e.currentTarget)}
                onTouchEnd={(e) => openNativeDatePicker(e.currentTarget)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Input
              placeholder="e.g. Monthly Salary"
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
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
                value={form.amount}
                onChange={(e) => updateForm("amount", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => updateForm("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
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
            disabled={!canSubmit}
          >
            {isEditMode ? "Update Transaction" : "Add Transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddTransactionDialog;
