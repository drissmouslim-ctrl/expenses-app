'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Expense, ExpenseInput } from '@/lib/types'
import EditModal from './EditModal'
import Toast from './Toast'

const USER_COLORS: Record<string, string> = {
  Driss: 'bg-blue-100 text-blue-700',
  Loubna: 'bg-rose-100 text-rose-700',
  Issa: 'bg-amber-100 text-amber-700',
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function formatAmount(n: number): string {
  return n.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Expense | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/expenses')
      if (!res.ok) throw new Error('Erreur de chargement')
      setExpenses(await res.json())
    } catch {
      setToast({ message: 'Impossible de charger les dépenses', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(data: ExpenseInput) {
    if (!editTarget) return
    const res = await fetch(`/api/expenses/${editTarget.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Erreur de mise à jour')
    setToast({ message: 'Dépense modifiée', type: 'success' })
    await load()
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      setToast({ message: 'Erreur lors de la suppression', type: 'error' })
      return
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    setDeleteId(null)
    setToast({ message: 'Dépense supprimée', type: 'success' })
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-14 h-14 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">Aucune dépense enregistrée</p>
      </div>
    )
  }

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="flex flex-col gap-2 px-4 pt-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Ligne 1: date + badge user */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">{formatDate(expense.expense_date)}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${USER_COLORS[expense.user_name] ?? 'bg-gray-100 text-gray-700'}`}>
                    {expense.user_name}
                  </span>
                </div>
                {/* Ligne 2: montant + catégorie */}
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatAmount(expense.amount)}</span>
                  <span className="text-sm text-gray-500 truncate">{expense.category}</span>
                </div>
                {/* Ligne 3: paiement + description */}
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-gray-400">{expense.payment_type}</span>
                  {expense.description && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400 truncate">{expense.description}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setEditTarget(expense)}
                  className="p-2 text-gray-400 active:text-primary-600 rounded-lg"
                  aria-label="Modifier"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteId(expense.id)}
                  className="p-2 text-gray-400 active:text-red-500 rounded-lg"
                  aria-label="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal édition */}
      {editTarget && (
        <EditModal
          expense={editTarget}
          onSave={handleSave}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Confirmation suppression */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <div className="w-full bg-white rounded-t-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Supprimer la dépense ?</h3>
            <p className="text-sm text-gray-500 mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium active:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
