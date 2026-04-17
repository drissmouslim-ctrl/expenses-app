import ExpenseList from '@/components/ExpenseList'

export default function HistoryPage() {
  return (
    <div className="pb-4">
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-xl font-bold text-gray-900">Historique</h1>
      </div>
      <ExpenseList />
    </div>
  )
}
