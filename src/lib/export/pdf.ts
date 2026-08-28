import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function downloadExpensesPDF(expenses: Expense[], filename: string): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt" });

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const generatedAt = new Date().toLocaleString("en-US");

  doc.setFontSize(16);
  doc.text("Expense Report", 40, 44);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated ${generatedAt}`, 40, 60);
  doc.text(
    `${expenses.length} record${expenses.length === 1 ? "" : "s"} - Total ${formatCurrency(total)}`,
    40,
    74
  );

  autoTable(doc, {
    startY: 90,
    head: [["Date", "Category", "Amount", "Description"]],
    body: expenses.map((expense) => [
      formatDate(expense.date),
      expense.category,
      formatCurrency(expense.amount),
      expense.description,
    ]),
    headStyles: { fillColor: [59, 102, 245] },
    styles: { fontSize: 9, cellPadding: 6 },
    columnStyles: {
      2: { halign: "right" },
    },
  });

  doc.save(filename);
}
