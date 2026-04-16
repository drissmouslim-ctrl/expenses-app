import { createClient } from '@supabase/supabase-js'

// Client serveur — utilisé uniquement dans les API routes
// Les variables sont lues à l'intérieur de la fonction (pas au niveau du module)
// pour garantir leur disponibilité au moment de l'exécution dans Next.js 15.
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[Supabase] URL   :', supabaseUrl  ? `✓ ${supabaseUrl}`                        : '✗ MANQUANT')
  console.log('[Supabase] KEY   :', supabaseKey  ? `✓ ${supabaseKey.slice(0, 24)}…`          : '✗ MANQUANT')

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Configuration Supabase manquante — URL: ${!!supabaseUrl}, KEY: ${!!supabaseKey}`
    )
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  })
}
