// Removed MUI imports (Card, CardContent, Typography, Grid, Box, Divider)
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ClientDetails } from "../../../types/clients"

export default function DetailsTab({ detailsTab }: { detailsTab: ClientDetails }) {
  return (
    <Card className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Client Details</h2>
      <Separator />

      {/* Preferences */}
      <div className="space-y-2">
        <p className="text-base font-semibold text-gray-700">Preferences</p>
        <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded">
          {detailsTab.preferences.map((pref, index) => (
            <span
              key={index}
              className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded"
            >
              {pref}
            </span>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-2">
        <p className="text-base font-semibold text-gray-700">Emergency Contact</p>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-semibold text-gray-800">
            Name:{" "}
            <span className="font-normal text-gray-600">
              {detailsTab.emergencyContact.name}
            </span>
          </p>
          <p className="text-sm font-semibold text-gray-800">
            Relation:{" "}
            <span className="font-normal text-gray-600">
              {detailsTab.emergencyContact.relation}
            </span>
          </p>
          <p className="text-sm font-semibold text-gray-800">
            Phone:{" "}
            <span className="font-normal text-gray-600">
              {detailsTab.emergencyContact.phone}
            </span>
          </p>
        </div>
      </div>
    </Card>
  )
}