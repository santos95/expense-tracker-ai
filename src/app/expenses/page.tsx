"use client";

import { useMemo, useState } from "react";
import { useExpenses } from "@/context/ExpensesContext";
import { useToast } from "@/context/ToastContext";
import { FilterBar } from "@/components/FilterBar";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseFormModal } from "@/components/ExpenseFormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Expense } from "@/lib/types";
import { formatCurrency, exportExpensesToCSV } from "@/lib/utils";
import { DEFAULT_FILTERS, filterExpenses, getTotal, sortByDateDesc } from "@/lib/analytics";

export default function ExpensesPage() {
  const { expenses, isLoading, deleteExpense } = useExpenses();
  const { showToast } = useToast();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deletingExpense, setDeletingExpense] = useState<Expense | undefined>();

  const filteredExpenses = useMemo(
    () => sortByDateDesc(filterExpenses(expenses, filters)),
    [expenses, filters]
  );
  const filteredTotal = getTotal(filteredExpenses);

  function handleDeleteConfirm() {
    if (!deletingExpense) return;
    deleteExpense(deletingExpense.id);
    showToast("Expense deleted.", "info");
    setDeletingExpense(undefined);
  }

  function handleExport() {
    if (filteredExpenses.length === 0) {
      showToast("No expenses to export.", "error");
      return;
    }
    exportExpensesToCSV(filteredExpenses);
    showToast("Expenses exported to CSV.");
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {filteredExpenses.length} transaction
            {filteredExpenses.length === 1 ? "" : "s"} · {formatCurrency(filteredTotal)}{" "}
            total
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Expense
          </button>
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <ExpenseTable
        expenses={filteredExpenses}
        onEdit={(expense) => setEditingExpense(expense)}
        onDelete={(expense) => setDeletingExpense(expense)}
      />

      <ExpenseFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      <ExpenseFormModal
        isOpen={Boolean(editingExpense)}
        editingExpense={editingExpense}
        onClose={() => setEditingExpense(undefined)}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingExpense)}
        title="Delete Expense"
        message={
          deletingExpense
            ? `Are you sure you want to delete "${deletingExpense.description}"? This action cannot be undone.`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingExpense(undefined)}
      />
    </div>
  );
}
