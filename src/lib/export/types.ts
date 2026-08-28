import { Category } from "@/lib/types";

export const EXPORT_FORMATS = ["csv", "json", "pdf"] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export interface ExportFormatMeta {
  format: ExportFormat;
  label: string;
  extension: string;
  description: string;
}

export const EXPORT_FORMAT_META: Record<ExportFormat, ExportFormatMeta> = {
  csv: {
    format: "csv",
    label: "CSV",
    extension: "csv",
    description: "Comma-separated values, opens in Excel or Sheets.",
  },
  json: {
    format: "json",
    label: "JSON",
    extension: "json",
    description: "Structured data, ideal for developers and scripts.",
  },
  pdf: {
    format: "pdf",
    label: "PDF",
    extension: "pdf",
    description: "Formatted report, ready to print or share.",
  },
};

export interface ExportFilters {
  startDate: string; // "" = unbounded
  endDate: string; // "" = unbounded
  categories: Category[]; // empty = all categories
}

export const DEFAULT_EXPORT_FILTERS: ExportFilters = {
  startDate: "",
  endDate: "",
  categories: [],
};

export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  filters: ExportFilters;
}
