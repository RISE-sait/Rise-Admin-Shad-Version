"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { RoomBooking } from "./PlaygroundTable";

interface AddBookingFormProps {
  initialData?: RoomBooking;
  onSave: (booking: RoomBooking) => void;
  onCancel: () => void;
}

// Form for creating or editing a booking
export default function AddBookingForm({
  initialData,
  onSave,
  onCancel,
}: AddBookingFormProps) {
  // Initialize form state with either provided data or blank values
  const [formData, setFormData] = useState<RoomBooking>(
    initialData || {
      id: Math.random().toString(),
      customer_name: "",
      room_number: "",
      start_at: new Date().toISOString(),
    }
  );

  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer name field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Customer Name</label>
        <Input
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
        />
      </div>

      {/* Room number field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Room Number</label>
        <Input
          name="room_number"
          value={formData.room_number}
          onChange={handleChange}
        />
      </div>

      {/* Start time field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Start Time</label>
        <Input
          type="datetime-local"
          name="start_at"
          value={format(
            new Date(formData.start_at || new Date()),
            "yyyy-MM-dd'T'HH:mm"
          )}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              start_at: new Date(e.target.value).toISOString(),
            }))
          }
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
