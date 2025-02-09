// Removed MUI imports (Card, CardContent, Typography, Grid, Box, Divider)
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MembershipDetails } from "../../../types/customer"

export default function MembershipTab({
  membershipTab,
}: {
  membershipTab: MembershipDetails
}) {
  return (
    <Card className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Membership Details</h2>
      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Join Date */}
        <div>
          <p className="text-base font-semibold text-gray-700">Join Date</p>
          <p className="text-sm text-gray-600">{membershipTab.joinDate}</p>
        </div>
        {/* Renewal Date */}
        <div>
          <p className="text-base font-semibold text-gray-700">Renewal Date</p>
          <p className="text-sm text-gray-600">{membershipTab.renewalDate}</p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Status */}
        <p className="text-base font-semibold text-gray-700">Status</p>
        <p
          className={`text-sm font-bold ${
            membershipTab.status === "Active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {membershipTab.status}
        </p>
        {/* Benefits */}
        <p className="text-base font-semibold text-gray-700">Benefits</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {membershipTab.benefits.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      </div>
    </Card>
  )
}