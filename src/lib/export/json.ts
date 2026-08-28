import { Expense } from "@/lib/types";
import { triggerBlobDownload } from "./download";

interface ExportedExpenseRecord {
  date: string;
  category: string;
  amount: number;
  description: string;
}

export function buildExpensesJSON(expenses: Expense[]): string {
  const records: ExportedExpenseRecord[] = expenses.map((expense) => ({
    date: expense.date,
    category: expense.category,
    amount: expense.amount,
    description: expense.description,
  }));

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      count: records.length,
      expenses: records,
    },
    null,
    2
  );
}

export function downloadExpensesJSON(expenses: Expense[], filename: string): void {
  const jsonContent = buildExpensesJSON(expenses);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  triggerBlobDownload(blob, filename);
}
