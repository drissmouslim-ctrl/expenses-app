import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { Expense } from '@/lib/types'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const expenses = data as Expense[]

  const headers = ['date', 'user', 'amount', 'category', 'payment_type', 'description']
  const sep = ';'

  const rows = expenses.map((e) =>
    [
      e.expense_date,
      e.user_name,
      String(e.amount).replace('.', ','), // format européen pour Excel
      e.category,
      e.payment_type,
      e.description ?? '',
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(sep)
  )

  // BOM UTF-8 pour Excel francophone
  const bom = '\uFEFF'
  const csv = bom + headers.join(sep) + '\r\n' + rows.join('\r\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="depenses-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
