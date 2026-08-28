import { Expense } from "@/lib/types";
import { sortByDateDesc } from "@/lib/analytics";
import { sanitizeFilename } from "./download";
import { downloadExpensesCSV } from "./csv";
import { downloadExpensesJSON } from "./json";
import { selectExpensesForExport } from "./filter";
import { EXPORT_FORMAT_META, ExportOptions } from "./types";

export { selectExpensesForExport } from "./filter";
export * from "./types";

export async function runExpenseExport(
  expenses: Expense[],
  options: ExportOptions
): Promise<void> {
  const meta = EXPORT_FORMAT_META[options.format];
  const filename = `${sanitizeFilename(options.filename)}.${meta.extension}`;
  const sorted = sortByDateDesc(selectExpensesForExport(expenses, options.filters));

  // PDF generation (layout + font embedding) is CPU-bound and can briefly
  // block the main thread; yielding first lets the loading state paint.
  await new Promise((resolve) => setTimeout(resolve, 0));

  switch (options.format) {
    case "csv":
      downloadExpensesCSV(sorted, filename);
      break;
    case "json":
      downloadExpensesJSON(sorted, filename);
      break;
    case "pdf": {
      const { downloadExpensesPDF } = await import("./pdf");
      downloadExpensesPDF(sorted, filename);
      break;
    }
  }
}
