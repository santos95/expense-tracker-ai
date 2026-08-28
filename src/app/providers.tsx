"use client";

import { ExpensesProvider } from "@/context/ExpensesContext";
import { ToastProvider } from "@/context/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ExpensesProvider>{children}</ExpensesProvider>
    </ToastProvider>
  );
}
