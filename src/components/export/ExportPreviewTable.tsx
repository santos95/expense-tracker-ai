import { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const PREVIEW_LIMIT = 8;

export function ExportPreviewTable({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400">
        No expenses match these filters.
      </div>
    );
  }

  const visible = expenses.slice(0, PREVIEW_LIMIT);
  const remaining = expenses.length - visible.length;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="max-h-56 overflow-y-auto">
        <table className="min-w-full divide-y divide-slate-100 text-xs">
          <thead className="sticky top-0 bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Date
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Category
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Description
              </th>
              <th className="px-3 py-2 text-right font-medium text-slate-500">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((expense) => (
              <tr key={expense.id}>
                <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                  {formatDate(expense.date)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                  {expense.category}
                </td>
                <td className="max-w-[140px] truncate px-3 py-2 text-slate-700">
                  {expense.description}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-slate-900">
                  {formatCurrency(expense.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {remaining > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
          + {remaining} more record{remaining === 1 ? "" : "s"} not shown
        </div>
      )}
    </div>
  );
}
