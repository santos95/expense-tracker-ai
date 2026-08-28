import { Expense } from "@/lib/types";
import { triggerBlobDownload } from "./download";

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildExpensesCSV(expenses: Expense[]): string {
  const header = ["Date", "Category", "Amount", "Description"];
  const rows = expenses.map((expense) => [
    expense.date,
    expense.category,
    expense.amount.toFixed(2),
    expense.description,
  ]);

  return [header, ...rows]
    .map((row) => row.map((cell) => escapeCell(String(cell))).join(","))
    .join("\n");
}

export function downloadExpensesCSV(expenses: Expense[], filename: string): void {
  const csvContent = buildExpensesCSV(expenses);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerBlobDownload(blob, filename);
}
