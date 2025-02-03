// Removed MUI imports (Box, Button, TextField, Typography)
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function Notes() {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Notes</h2>
      <Textarea
        placeholder="Add Note"
        className="resize-none h-24 rounded-md"
      />
      <Button variant="default" className="font-semibold">
        Save Note
      </Button>
    </div>
  )
}