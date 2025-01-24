// Removed MUI imports (Card, CardContent, Typography, Box)
import { Card } from "@/components/ui/card"

export default function TransactionsTab() {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Transactions</h2>
      <Card className="border border-gray-300 bg-white shadow p-4">
        <p className="text-sm text-gray-600 text-center">No transactions available.</p>
      </Card>
    </div>
  )
}