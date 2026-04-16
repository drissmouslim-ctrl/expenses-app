'use client'

import { useState, useEffect } from 'react'
import { USERS, CATEGORIES, PAYMENT_TYPES } from '@/lib/types'
import type { Expense, ExpenseInput } from '@/lib/types'

interface ExpenseFormProps {
  initialData?: Expense
  onSubmit: (data: ExpenseInput) => Promise<void>
  submitLabel?: string
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

const LS_USER = 'lastUser'
const LS_CATEGORY = 'lastCategory'
const LS_PAYMENT = 'lastPaymentType'

export default function ExpenseForm({ initialData, onSubmit, submitLabel = 'Enregistrer' }: ExpenseFormProps) {
  const [user_name, setUserName] = useState(initialData?.user_name ?? '')
  const [expense_date, setExpenseDate] = useState(initialData?.expense_date ?? today())
  const [amount, setAmount] = useState(initialData ? String(initialData.amount) : '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [payment_type, setPaymentType] = useState(initialData?.payment_type ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Préremplissage depuis localStorage (seulement pour un nouveau formulaire)
  useEffect(() => {
    if (!initialData) {
      const lastUser = localStorage.getItem(LS_USER)
      const lastCat = localStorage.getItem(LS_CATEGORY)
      const lastPay = localStorage.getItem(LS_PAYMENT)
      if (lastUser) setUserName(lastUser)
      if (lastCat) setCategory(lastCat)
      if (lastPay) setPaymentType(lastPay)
    }
  }, [initialData])

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!user_name) e.user_name = 'Champ obligatoire'
    if (!expense_date) e.expense_date = 'Champ obligatoire'
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) e.amount = 'Montant invalide (> 0)'
    if (!category) e.category = 'Champ obligatoire'
    if (!payment_type) e.payment_type = 'Champ obligatoire'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({
        expense_date,
        user_name,
        amount: parseFloat(amount),
        category,
        payment_type,
        description: description || null,
      })
      // Persistance localStorage
      localStorage.setItem(LS_USER, user_name)
      localStorage.setItem(LS_CATEGORY, category)
      localStorage.setItem(LS_PAYMENT, payment_type)
      // Reset des champs transitoires
      if (!initialData) {
        setAmount('')
        setDescription('')
        setExpenseDate(today())
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Utilisateur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
        <div className="flex gap-2">
          {USERS.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUserName(u)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                user_name === u
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 active:bg-gray-50'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
        {errors.user_name && <p className="text-red-500 text-xs mt-1">{errors.user_name}</p>}
      </div>

      {/* Date */}
      <div>
        <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          id="expense_date"
          type="date"
          value={expense_date}
          onChange={(e) => setExpenseDate(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.expense_date && <p className="text-red-500 text-xs mt-1">{errors.expense_date}</p>}
      </div>

      {/* Montant */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      {/* Catégorie */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
        >
          <option value="">Choisir…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      {/* Type de paiement */}
      <div>
        <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700 mb-1">Type de paiement</label>
        <select
          id="payment_type"
          value={payment_type}
          onChange={(e) => setPaymentType(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
        >
          <option value="">Choisir…</option>
          {PAYMENT_TYPES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.payment_type && <p className="text-red-500 text-xs mt-1">{errors.payment_type}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-400 font-normal">(facultatif)</span>
        </label>
        <textarea
          id="description"
          rows={2}
          placeholder="Détails optionnels…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
        />
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white font-semibold py-3.5 rounded-xl text-base active:bg-primary-700 disabled:opacity-60 transition-colors mt-1"
      >
        {loading ? 'Enregistrement…' : submitLabel}
      </button>
    </form>
  )
}
