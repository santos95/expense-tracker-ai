"use client";

import { CATEGORIES, Category } from "@/lib/types";
import { ExpenseFilters } from "@/lib/analytics";

interface FilterBarProps {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "All" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label
            htmlFor="search"
            className="mb-1 block text-xs font-medium text-slate-500"
          >
            Search description
          </label>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
            <input
              id="search"
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Search expenses..."
              className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category-filter"
            className="mb-1 block text-xs font-medium text-slate-500"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) =>
              onChange({
                ...filters,
                category: e.target.value as Category | "All",
              })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="start-date"
            className="mb-1 block text-xs font-medium text-slate-500"
          >
            From
          </label>
          <input
            id="start-date"
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              onChange({ ...filters, startDate: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label
            htmlFor="end-date"
            className="mb-1 block text-xs font-medium text-slate-500"
          >
            To
          </label>
          <input
            id="end-date"
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() =>
              onChange({
                search: "",
                category: "All",
                startDate: "",
                endDate: "",
              })
            }
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
