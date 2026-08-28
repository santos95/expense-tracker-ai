import { Expense } from "@/lib/types";
import { ExportFilters } from "./types";

export function selectExpensesForExport(
  expenses: Expense[],
  filters: ExportFilters
): Expense[] {
  return expenses.filter((expense) => {
    if (filters.startDate && expense.date < filters.startDate) return false;
    if (filters.endDate && expense.date > filters.endDate) return false;
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(expense.category)
    ) {
      return false;
    }
    return true;
  });
}
