"use client";

import { Expense, ExpenseInput } from "@/lib/types";
import { useExpenses } from "@/context/ExpensesContext";
import { useToast } from "@/context/ToastContext";
import { Modal } from "./Modal";
import { ExpenseForm } from "./ExpenseForm";

interface ExpenseFormModalProps {
  isOpen: boolean;
  editingExpense?: Expense;
  onClose: () => void;
}

export function ExpenseFormModal({
  isOpen,
  editingExpense,
  onClose,
}: ExpenseFormModalProps) {
  const { addExpense, updateExpense } = useExpenses();
  const { showToast } = useToast();

  function handleSubmit(input: ExpenseInput) {
    if (editingExpense) {
      updateExpense(editingExpense.id, input);
      showToast("Expense updated successfully.");
    } else {
      addExpense(input);
      showToast("Expense added successfully.");
    }
    onClose();
  }

  return (
    <Modal
      title={editingExpense ? "Edit Expense" : "Add Expense"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ExpenseForm
        initialExpense={editingExpense}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
