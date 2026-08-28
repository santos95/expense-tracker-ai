import { ExportFormatMeta } from "@/lib/export";

const FORMAT_ICONS: Record<string, JSX.Element> = {
  csv: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 17v-6h1.5a1.5 1.5 0 010 3H9m6-3v6m0-6h1.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75H15m0 0v3M5 17v-6h2.25M5 14h1.5M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"
    />
  ),
  json: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 20.5a2 2 0 01-2-2v-2.5a2 2 0 00-2-2 2 2 0 002-2V9.5a2 2 0 012-2m4 13a2 2 0 002-2v-2.5a2 2 0 012-2 2 2 0 01-2-2V9.5a2 2 0 00-2-2"
    />
  ),
  pdf: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 13h1.5a1.25 1.25 0 000-2.5H9V17m4.5-4.5V17m0-4.5H15a1 1 0 011 1v.5a1 1 0 01-1 1h-1.5m0 2h1.5"
    />
  ),
};

interface FormatOptionProps {
  meta: ExportFormatMeta;
  isSelected: boolean;
  onSelect: () => void;
}

export function FormatOption({ meta, isSelected, onSelect }: FormatOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors ${
        isSelected
          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${isSelected ? "text-brand-600" : "text-slate-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {FORMAT_ICONS[meta.format]}
      </svg>
      <span
        className={`text-sm font-semibold ${
          isSelected ? "text-brand-700" : "text-slate-700"
        }`}
      >
        {meta.label}
      </span>
      <span className="text-[11px] leading-tight text-slate-500">
        {meta.description}
      </span>
    </button>
  );
}
