// Removed MUI imports (Card, CardContent, Grid, Box, Typography)
import { Card } from "@/components/ui/card"
import { ClassItem } from "../../../types/customer"

export default function ClassesTab({ classes }: { classes: ClassItem[] }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {classes.map((classItem, index) => (
          <Card
            key={index}
            className="rounded-lg border border-gray-300 bg-white shadow hover:-translate-y-1 hover:shadow-lg transition-transform p-4"
          >
            <h3 className="text-base font-bold mb-1 text-blue-600">{classItem.classTitle}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Date:</strong> {classItem.date}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Time:</strong> {classItem.time}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Facility:</strong> {classItem.facility}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}