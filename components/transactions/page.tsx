import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    { id: "a3f6b2c", amount: 432, status: "pending", email: "alex@example.com", name: "Alex Johnson" },
    { id: "b1d9e0f", amount: 275, status: "success", email: "jane.smith@example.com", name: "Jane Smith" },
    { id: "c2a8d5e", amount: 650, status: "failed", email: "mike@example.com", name: "Mike Brown" },
    { id: "d4f7h9j", amount: 300, status: "pending", email: "susan@example.com", name: "Susan Lee" },
    { id: "e5g1i3k", amount: 480, status: "success", email: "emily.johnson@example.com", name: "Emily Johnson" },
    { id: "f6h2j4l", amount: 390, status: "processing", email: "robert@example.com", name: "Robert Martin" },
    { id: "g7i3k5m", amount: 525, status: "pending", email: "chris@example.com", name: "Chris Evans" },
    { id: "h8j4l6n", amount: 310, status: "success", email: "laura@example.com", name: "Laura Wilson" },
    { id: "i9k5m7o", amount: 220, status: "failed", email: "patrick@example.com", name: "Patrick O'Neil" },
    { id: "j0l6n8p", amount: 415, status: "pending", email: "olivia@example.com", name: "Olivia Davis" },
    { id: "k1m7o9q", amount: 330, status: "processing", email: "andrew@example.com", name: "Andrew Thompson" },
    { id: "l2n8p0r", amount: 510, status: "success", email: "samantha@example.com", name: "Samantha Carter" },
    { id: "m3o9q1s", amount: 605, status: "pending", email: "daniel@example.com", name: "Daniel Rodriguez" },
    { id: "n4p0r2t", amount: 275, status: "failed", email: "karen@example.com", name: "Karen Walker" },
    { id: "o5q1s3u", amount: 450, status: "processing", email: "george@example.com", name: "George Harris" },
    { id: "p6r2t4v", amount: 370, status: "success", email: "michael@example.com", name: "Michael Brown" },
    { id: "q7s3u5w", amount: 290, status: "pending", email: "rachel@example.com", name: "Rachel Green" },
    { id: "r8t4v6x", amount: 520, status: "success", email: "brian@example.com", name: "Brian Lee" },
    { id: "s9u5w7y", amount: 480, status: "failed", email: "nicole@example.com", name: "Nicole Adams" },
    { id: "t0v6x8z", amount: 540, status: "pending", email: "david@example.com", name: "David Kim" },
    // ...
  ]
}

export default async function TransactionsPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Transactions</h1>
        <p className="text-gray-500">Manage your Payments.</p>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
