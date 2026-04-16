export interface Expense {
  id: string
  created_at: string
  expense_date: string
  user_name: string
  amount: number
  category: string
  payment_type: string
  description: string | null
}

export type ExpenseInput = Omit<Expense, 'id' | 'created_at'>

export const USERS = ['Driss', 'Loubna', 'Issa'] as const

export const CATEGORIES = [
  'Ménage',
  'Nourriture',
  'Loyer, eau, gaz, électricité',
  'Telecom',
  'Voiture',
  'Loisirs',
  'Vêtements',
  'Santé',
  'Divers',
] as const

export const PAYMENT_TYPES = [
  'Cash',
  'Bancontact',
  'Visa',
  'Apple Pay',
  'Chèque-repas',
] as const

export type User = (typeof USERS)[number]
export type Category = (typeof CATEGORIES)[number]
export type PaymentType = (typeof PAYMENT_TYPES)[number]
