import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  getCategoryTotals,
  getCurrentMonthKey,
  getExpensesForMonth,
  getTotal,
} from "@/lib/analytics";
import { CategoryBadge } from "./CategoryBadge";

interface SummaryCardsProps {
  expenses: Expense[];
}

export function SummaryCards({ expenses }: SummaryCardsProps) {
  const total = getTotal(expenses);
  const monthExpenses = getExpensesForMonth(expenses, getCurrentMonthKey());
  const monthTotal = getTotal(monthExpenses);
  const categoryTotals = getCategoryTotals(monthExpenses);
  const topCategory = categoryTotals[0];

  const cards = [
    {
      label: "Total Spending",
      value: formatCurrency(total),
      hint: `${expenses.length} transaction${expenses.length === 1 ? "" : "s"}`,
    },
    {
      label: "This Month",
      value: formatCurrency(monthTotal),
      hint: `${monthExpenses.length} transaction${monthExpenses.length === 1 ? "" : "s"}`,
    },
    {
      label: "Top Category (This Month)",
      value: topCategory ? formatCurrency(topCategory.total) : "—",
      hint: topCategory ? undefined : "No spending yet",
      badge: topCategory ? topCategory.category : undefined,
    },
    {
      label: "Avg. Transaction",
      value: formatCurrency(
        expenses.length > 0 ? total / expenses.length : 0
      ),
      hint: "All-time average",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-card"
        >
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {card.value}
          </p>
          {card.badge && (
            <div className="mt-2">
              <CategoryBadge category={card.badge} />
            </div>
          )}
          {card.hint && (
            <p className="mt-2 text-xs text-slate-400">{card.hint}</p>
          )}
        </div>
      ))}
    </div>
  );
}
