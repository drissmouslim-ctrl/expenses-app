'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PinPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!pin) return
    setLoading(true)
    setError('')
    console.log('[PIN] Saisi:', pin, '| Longueur:', pin.length)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      console.log('[PIN] Réponse API:', res.status, res.ok)
      if (res.ok) {
        window.location.href = '/add'
      } else {
        const data = await res.json().catch(() => ({}))
        console.log('[PIN] Erreur serveur:', data)
        setError('Code PIN incorrect')
        setPin('')
        inputRef.current?.focus()
      }
    } catch (err) {
      console.error('[PIN] Erreur réseau:', err)
      setError('Erreur réseau, réessaie')
    } finally {
      setLoading(false)
    }
  }

  // Clavier PIN visuel
  function pressKey(k: string) {
    if (k === 'del') {
      setPin((p) => p.slice(0, -1))
    } else if (pin.length < 8) {
      setPin((p) => p + k)
    }
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-xs">
        {/* Icône */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Dépenses Famille</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Entrez votre code PIN pour accéder à l&apos;application</p>

        {/* Indicateurs de saisie */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: Math.max(pin.length || 1, 4) }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < pin.length ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Erreur */}
        {error && (
          <p className="text-center text-sm text-red-500 mb-4 font-medium">{error}</p>
        )}

        {/* Input caché pour focus mobile */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
            className="sr-only"
            aria-label="Code PIN"
          />
        </form>

        {/* Clavier visuel */}
        <div className="grid grid-cols-3 gap-3">
          {keys.map((k, i) => {
            if (k === '') return <div key={i} />
            if (k === 'del') {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pressKey('del')}
                  className="h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 active:bg-gray-100 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                  </svg>
                </button>
              )
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => pressKey(k)}
                className="h-14 rounded-xl bg-white border border-gray-200 text-xl font-semibold text-gray-800 active:bg-gray-100 shadow-sm"
              >
                {k}
              </button>
            )
          })}
        </div>

        {/* Valider */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={pin.length === 0 || loading}
          className="w-full mt-4 bg-primary-600 text-white font-semibold py-3.5 rounded-xl active:bg-primary-700 disabled:opacity-40 transition-colors"
        >
          {loading ? 'Vérification…' : 'Déverrouiller'}
        </button>
      </div>
    </div>
  )
}
