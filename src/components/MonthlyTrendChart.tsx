"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MonthlyTotal } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

interface MonthlyTrendChartProps {
  data: MonthlyTotal[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#64748b" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickFormatter={(value: number) => formatCurrency(value)}
          width={70}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          cursor={{ fill: "#f1f5f9" }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 13,
          }}
        />
        <Bar dataKey="total" fill="#3b66f5" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
