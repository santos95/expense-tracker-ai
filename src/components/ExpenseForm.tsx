"use client";

import { FormEvent, useState } from "react";
import { CATEGORIES, Category, Expense, ExpenseInput } from "@/lib/types";
import { todayISO } from "@/lib/utils";

interface ExpenseFormProps {
  initialExpense?: Expense;
  onSubmit: (input: ExpenseInput) => void;
  onCancel: () => void;
}

interface FormErrors {
  date?: string;
  amount?: string;
  category?: string;
  description?: string;
}

export function ExpenseForm({
  initialExpense,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [date, setDate] = useState(initialExpense?.date ?? todayISO());
  const [amount, setAmount] = useState(
    initialExpense ? String(initialExpense.amount) : ""
  );
  const [category, setCategory] = useState<Category>(
    initialExpense?.category ?? "Food"
  );
  const [description, setDescription] = useState(
    initialExpense?.description ?? ""
  );
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!date) {
      nextErrors.date = "Date is required.";
    }

    const numericAmount = Number(amount);
    if (!amount.trim()) {
      nextErrors.amount = "Amount is required.";
    } else if (Number.isNaN(numericAmount)) {
      nextErrors.amount = "Amount must be a number.";
    } else if (numericAmount <= 0) {
      nextErrors.amount = "Amount must be greater than zero.";
    }

    if (!CATEGORIES.includes(category)) {
      nextErrors.category = "Select a valid category.";
    }

    if (!description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (description.trim().length > 200) {
      nextErrors.description = "Description must be 200 characters or fewer.";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      date,
      amount: Number(amount),
      category,
      description: description.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label
          htmlFor="date"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          max={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            errors.date ? "border-red-400" : "border-slate-300"
          }`}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "date-error" : undefined}
        />
        {errors.date && (
          <p id="date-error" className="mt-1 text-xs text-red-600">
            {errors.date}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="amount"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Amount (USD)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            $
          </span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={`w-full rounded-md border py-2 pl-7 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              errors.amount ? "border-red-400" : "border-slate-300"
            }`}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : undefined}
          />
        </div>
        {errors.amount && (
          <p id="amount-error" className="mt-1 text-xs text-red-600">
            {errors.amount}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Grocery run at Trader Joe's"
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            errors.description ? "border-red-400" : "border-slate-300"
          }`}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-xs text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
        >
          {initialExpense ? "Save Changes" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
