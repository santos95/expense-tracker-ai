"use client";

import Link from "next/link";
import { useState } from "react";
import { useExpenses } from "@/context/ExpensesContext";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { MonthlyTrendChart } from "@/components/MonthlyTrendChart";
import { ExpenseFormModal } from "@/components/ExpenseFormModal";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  getCategoryTotals,
  getCurrentMonthKey,
  getExpensesForMonth,
  getMonthlyTrend,
  sortByDateDesc,
} from "@/lib/analytics";

export default function DashboardPage() {
  const { expenses, isLoading } = useExpenses();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const monthExpenses = getExpensesForMonth(expenses, getCurrentMonthKey());
  const categoryTotals = getCategoryTotals(monthExpenses);
  const monthlyTrend = getMonthlyTrend(expenses, 6);
  const recentExpenses = sortByDateDesc(expenses).slice(0, 5);

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
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            An overview of your spending activity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
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

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-3 text-sm font-medium text-slate-700">
            No expenses yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Start tracking your spending by adding your first expense.
          </p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            Add your first expense
          </button>
        </div>
      ) : (
        <>
          <SummaryCards expenses={expenses} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <h2 className="text-sm font-semibold text-slate-900">
                Spending by Category (This Month)
              </h2>
              <CategoryPieChart data={categoryTotals} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <h2 className="text-sm font-semibold text-slate-900">
                Monthly Trend (Last 6 Months)
              </h2>
              <MonthlyTrendChart data={monthlyTrend} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Expenses
              </h2>
              <Link
                href="/expenses"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View all
              </Link>
            </div>
            <ul className="divide-y divide-slate-100">
              {recentExpenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <CategoryBadge category={expense.category} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {expense.description}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <ExpenseFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
