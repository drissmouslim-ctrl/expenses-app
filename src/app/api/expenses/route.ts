import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { USERS, CATEGORIES, PAYMENT_TYPES } from '@/lib/types'

export async function GET() {
  let supabase
  try {
    supabase = createServerSupabaseClient()
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log("BODY:", body)
  const { expense_date, user_name, amount, category, payment_type, description } = body

  // Validation basique
  if (!expense_date || !user_name || !amount || !category || !payment_type) {
    return NextResponse.json({ data: null, error: 'Champs obligatoires manquants' }, { status: 400 })
  }
  if (!USERS.includes(user_name)) {
    return NextResponse.json({ data: null, error: 'Utilisateur invalide' }, { status: 400 })
  }
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ data: null, error: 'Catégorie invalide' }, { status: 400 })
  }
  if (!PAYMENT_TYPES.includes(payment_type)) {
    return NextResponse.json({ data: null, error: 'Type de paiement invalide' }, { status: 400 })
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ data: null, error: 'Montant invalide' }, { status: 400 })
  }

  let supabase
  try {
    supabase = createServerSupabaseClient()
  } catch (e) {
    return NextResponse.json({ data: null, error: String(e) }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert({ expense_date, user_name, amount, category, payment_type, description: description || null })
    .select()
    .single()

  console.log("SUPABASE RESPONSE:", data, error)
  return NextResponse.json({ data, error: error ? error.message : null }, { status: error ? 500 : 201 })
}
