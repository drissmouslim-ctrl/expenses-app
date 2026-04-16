'use client'

import ExpenseForm from './ExpenseForm'
import type { Expense, ExpenseInput } from '@/lib/types'

interface EditModalProps {
  expense: Expense
  onSave: (data: ExpenseInput) => Promise<void>
  onClose: () => void
}

export default function EditModal({ expense, onSave, onClose }: EditModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <button
          onClick={onClose}
          className="text-gray-500 active:text-gray-700 p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-gray-900">Modifier la dépense</h2>
        <div className="w-8" />
      </div>

      {/* Formulaire */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <ExpenseForm
          initialData={expense}
          onSubmit={async (data) => {
            await onSave(data)
            onClose()
          }}
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </div>
  )
}
