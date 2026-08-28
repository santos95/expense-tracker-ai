"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Expense, ExpenseInput } from "@/lib/types";
import { loadExpenses, persistExpenses } from "@/lib/storage";
import { generateId } from "@/lib/utils";

interface ExpensesContextValue {
  expenses: Expense[];
  isLoading: boolean;
  addExpense: (input: ExpenseInput) => void;
  updateExpense: (id: string, input: ExpenseInput) => void;
  deleteExpense: (id: string) => void;
}

const ExpensesContext = createContext<ExpensesContextValue | undefined>(
  undefined
);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setExpenses(loadExpenses());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      persistExpenses(expenses);
    }
  }, [expenses, isLoading]);

  const addExpense = useCallback((input: ExpenseInput) => {
    const newExpense: Expense = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const updateExpense = useCallback((id: string, input: ExpenseInput) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...input } : expense
      )
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const value = useMemo(
    () => ({ expenses, isLoading, addExpense, updateExpense, deleteExpense }),
    [expenses, isLoading, addExpense, updateExpense, deleteExpense]
  );

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses(): ExpensesContextValue {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
}
