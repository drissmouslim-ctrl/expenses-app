'use client'

import { useState } from 'react'

export default function ExportPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleExport() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/export')
      if (!res.ok) throw new Error('Erreur lors de la génération du CSV')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const date = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `depenses-${date}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-5">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Export CSV</h1>
      <p className="text-sm text-gray-500 mb-8">
        Exporte toutes les dépenses dans un fichier CSV compatible Excel (séparateur&nbsp;;, encodage UTF-8).
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Toutes les dépenses</p>
            <p className="text-xs text-gray-500">Format .csv · UTF-8 · séparateur ;</p>
          </div>
        </div>

        <div className="text-xs text-gray-400 mb-4 space-y-0.5">
          <p>Colonnes exportées :</p>
          <p className="font-mono text-gray-500">date · user · amount · category · payment_type · description</p>
        </div>

        <button
          onClick={handleExport}
          disabled={loading}
          className="w-full bg-primary-600 text-white font-semibold py-3.5 rounded-xl active:bg-primary-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Génération…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le CSV
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-700">
          <strong>Conseil Excel :</strong> Pour ouvrir le fichier correctement en français/belge, utilise
          &laquo;&nbsp;Données → Données externes → À partir du texte/CSV&nbsp;&raquo; et sélectionne le
          séparateur <code>;</code>.
        </p>
      </div>
    </div>
  )
}
