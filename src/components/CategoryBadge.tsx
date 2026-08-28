import { CATEGORY_COLORS, Category } from "@/lib/types";

export function CategoryBadge({ category }: { category: Category }) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {category}
    </span>
  );
}
