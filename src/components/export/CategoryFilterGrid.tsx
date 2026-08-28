import { CATEGORIES, CATEGORY_COLORS, Category } from "@/lib/types";

interface CategoryFilterGridProps {
  selected: Set<Category>;
  onToggle: (category: Category) => void;
}

export function CategoryFilterGrid({ selected, onToggle }: CategoryFilterGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CATEGORIES.map((category) => {
        const isChecked = selected.has(category);
        const color = CATEGORY_COLORS[category];
        return (
          <label
            key={category}
            className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
              isChecked
                ? "border-slate-300 bg-white"
                : "border-slate-200 bg-slate-50 text-slate-400"
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(category)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: isChecked ? color : "#cbd5e1" }}
            />
            <span className={isChecked ? "text-slate-700" : ""}>
              {category}
            </span>
          </label>
        );
      })}
    </div>
  );
}
