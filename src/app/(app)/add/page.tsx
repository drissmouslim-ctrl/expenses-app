'use client'

import { useState } from 'react'
import ExpenseForm from '@/components/ExpenseForm'
import Toast from '@/components/Toast'
import type { ExpenseInput } from '@/lib/types'

export default function AddPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleSubmit(data: ExpenseInput) {
    let res: Response
    try {
      res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (fetchErr) {
      console.error('Fetch error:', fetchErr)
      throw new Error(`Impossible de contacter l'API : ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`)
    }

    const json = await res.json().catch(() => ({}))
    console.log('API response:', res.status, json)

    if (!res.ok) {
      throw new Error(json.error ?? `Erreur ${res.status}`)
    }
    setToast({ message: 'Dépense enregistrée !', type: 'success' })
  }

  return (
    <div className="px-4 pt-5 pb-4">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <h1 className="text-xl font-bold text-gray-900 mb-5">Nouvelle dépense</h1>
      <ExpenseForm
        onSubmit={async (data) => {
          try {
            await handleSubmit(data)
          } catch (err) {
            setToast({ message: err instanceof Error ? err.message : 'Erreur', type: 'error' })
            throw err
          }
        }}
      />
    </div>
  )
}
