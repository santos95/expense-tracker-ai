"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, Category, Expense } from "@/lib/types";
import { formatCurrency, formatDate, todayISO } from "@/lib/utils";
import { sortByDateDesc } from "@/lib/analytics";
import { useToast } from "@/context/ToastContext";
import {
  EXPORT_FORMAT_META,
  EXPORT_FORMATS,
  ExportFilters,
  ExportFormat,
  runExpenseExport,
  selectExpensesForExport,
} from "@/lib/export";
import { FormatOption } from "./FormatOption";
import { CategoryFilterGrid } from "./CategoryFilterGrid";
import { ExportPreviewTable } from "./ExportPreviewTable";

interface ExportDrawerProps {
  isOpen: boolean;
  expenses: Expense[];
  onClose: () => void;
}

const ALL_CATEGORIES = new Set<Category>(CATEGORIES);

export function ExportDrawer({ isOpen, expenses, onClose }: ExportDrawerProps) {
  const { showToast } = useToast();

  const [format, setFormat] = useState<ExportFormat>("csv");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    ALL_CATEGORIES
  );
  const [filename, setFilename] = useState(() => `expenses-${todayISO()}`);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen) return;
    const timeout = window.setTimeout(() => {
      setFormat("csv");
      setStartDate("");
      setEndDate("");
      setSelectedCategories(ALL_CATEGORIES);
      setFilename(`expenses-${todayISO()}`);
      setIsExporting(false);
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isExporting) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isExporting, onClose]);

  const filters: ExportFilters = useMemo(
    () => ({
      startDate,
      endDate,
      categories:
        selectedCategories.size === CATEGORIES.length
          ? []
          : Array.from(selectedCategories),
    }),
    [startDate, endDate, selectedCategories]
  );

  const matchedExpenses = useMemo(
    () => sortByDateDesc(selectExpensesForExport(expenses, filters)),
    [expenses, filters]
  );
  const matchedTotal = matchedExpenses.reduce((sum, e) => sum + e.amount, 0);

  function toggleCategory(category: Category) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function toggleAllCategories() {
    setSelectedCategories((prev) =>
      prev.size === CATEGORIES.length ? new Set() : new Set(ALL_CATEGORIES)
    );
  }

  async function handleExport() {
    if (matchedExpenses.length === 0 || isExporting) return;
    setIsExporting(true);
    try {
      await runExpenseExport(expenses, { format, filename, filters });
      showToast(
        `Exported ${matchedExpenses.length} record${matchedExpenses.length === 1 ? "" : "s"} as ${EXPORT_FORMAT_META[format].label}.`
      );
      onClose();
    } catch {
      showToast("Export failed. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={isExporting ? undefined : onClose}
        className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Export expenses"
        className={`absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Export Expenses
            </h2>
            <p className="text-xs text-slate-500">
              Choose a format, filter your data, and preview before you
              download.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            aria-label="Close export panel"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Format
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {EXPORT_FORMATS.map((f) => (
                <FormatOption
                  key={f}
                  meta={EXPORT_FORMAT_META[f]}
                  isSelected={format === f}
                  onSelect={() => setFormat(f)}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date range
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="export-start-date"
                  className="mb-1 block text-xs font-medium text-slate-500"
                >
                  From
                </label>
                <input
                  id="export-start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label
                  htmlFor="export-end-date"
                  className="mb-1 block text-xs font-medium text-slate-500"
                >
                  To
                </label>
                <input
                  id="export-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Categories
              </h3>
              <button
                type="button"
                onClick={toggleAllCategories}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                {selectedCategories.size === CATEGORIES.length
                  ? "Clear all"
                  : "Select all"}
              </button>
            </div>
            <CategoryFilterGrid
              selected={selectedCategories}
              onToggle={toggleCategory}
            />
          </section>

          <section>
            <label
              htmlFor="export-filename"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Filename
            </label>
            <div className="flex items-center overflow-hidden rounded-md border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-brand-500">
              <input
                id="export-filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full border-none px-3 py-2 text-sm focus:outline-none focus:ring-0"
              />
              <span className="whitespace-nowrap bg-slate-50 px-3 py-2 text-sm text-slate-400">
                .{EXPORT_FORMAT_META[format].extension}
              </span>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {matchedExpenses.length} record
                  {matchedExpenses.length === 1 ? "" : "s"} match your
                  filters
                </p>
                <p className="text-xs text-slate-500">
                  Total {formatCurrency(matchedTotal)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Preview
            </h3>
            <ExportPreviewTable expenses={matchedExpenses} />
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={matchedExpenses.length === 0 || isExporting}
            className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {isExporting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                Exporting...
              </>
            ) : (
              `Export ${EXPORT_FORMAT_META[format].label}`
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
