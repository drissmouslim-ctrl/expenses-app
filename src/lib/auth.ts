export const SESSION_COOKIE = 'app_session'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 jours

/**
 * Génère le token attendu à partir du PIN et du secret serveur.
 * Utilise Web Crypto API (compatible Edge Runtime et Node.js).
 */
export async function getExpectedToken(): Promise<string> {
  const pin = process.env.NEXT_PUBLIC_APP_PIN
  const secret = process.env.SESSION_SECRET
  if (!pin || !secret) throw new Error("APP_PIN ou SESSION_SECRET manquant dans les variables d'environnement")
  const encoder = new TextEncoder()
  const data = encoder.encode(`${pin}:${secret}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
