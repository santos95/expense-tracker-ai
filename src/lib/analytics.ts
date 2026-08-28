import { Category, Expense } from "./types";

export interface ExpenseFilters {
  search: string;
  category: Category | "All";
  startDate: string; // "" means unbounded
  endDate: string; // "" means unbounded
}

export const DEFAULT_FILTERS: ExpenseFilters = {
  search: "",
  category: "All",
  startDate: "",
  endDate: "",
};

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters
): Expense[] {
  const search = filters.search.trim().toLowerCase();
  return expenses.filter((expense) => {
    if (filters.category !== "All" && expense.category !== filters.category) {
      return false;
    }
    if (filters.startDate && expense.date < filters.startDate) return false;
    if (filters.endDate && expense.date > filters.endDate) return false;
    if (search && !expense.description.toLowerCase().includes(search)) {
      return false;
    }
    return true;
  });
}

export function sortByDateDesc(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => {
    if (a.date === b.date) {
      return b.createdAt.localeCompare(a.createdAt);
    }
    return b.date.localeCompare(a.date);
  });
}

export function getTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getExpensesForMonth(
  expenses: Expense[],
  monthKey: string
): Expense[] {
  return expenses.filter((expense) => expense.date.startsWith(monthKey));
}

export interface CategoryTotal {
  category: Category;
  total: number;
  percentage: number;
}

export function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const total = getTotal(expenses);
  const totalsMap = new Map<Category, number>();
  for (const expense of expenses) {
    totalsMap.set(
      expense.category,
      (totalsMap.get(expense.category) ?? 0) + expense.amount
    );
  }
  return Array.from(totalsMap.entries())
    .map(([category, amount]) => ({
      category,
      total: amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export interface MonthlyTotal {
  monthKey: string;
  label: string;
  total: number;
}

export function getMonthlyTrend(
  expenses: Expense[],
  months = 6
): MonthlyTotal[] {
  const now = new Date();
  const buckets: MonthlyTotal[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short" });
    buckets.push({ monthKey, label, total: 0 });
  }

  const bucketMap = new Map(buckets.map((b) => [b.monthKey, b]));
  for (const expense of expenses) {
    const monthKey = expense.date.slice(0, 7);
    const bucket = bucketMap.get(monthKey);
    if (bucket) bucket.total += expense.amount;
  }

  return buckets;
}
