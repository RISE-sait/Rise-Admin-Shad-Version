"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Gamepad2, User, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { RoomBooking } from "./PlaygroundTable";

interface BookingInfoPanelProps {
  booking: RoomBooking;
  onEdit: (booking: RoomBooking) => void;
  onDelete: (id: string) => void;
}

// Panel showing booking details in a tabbed layout
export default function BookingInfoPanel({
  booking,
  onEdit,
  onDelete,
}: BookingInfoPanelProps) {
  const [tabValue, setTabValue] = useState("details");

  // Confirm before deleting a booking
  const handleDelete = () => {
    if (confirm("Delete this booking?")) {
      onDelete(booking.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab selector */}
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <div className="border-b mb-6">
          <TabsList className="w-full flex gap-1 bg-transparent">
            <TabsTrigger value="details" className="...">
              <Gamepad2 className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="customer" className="...">
              <User className="h-4 w-4" />
              Customer
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Room and start time */}
        <TabsContent value="details" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Room</h3>
            <p>{booking.room_number}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Start Time</h3>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>
                {booking.start_at
                  ? format(new Date(booking.start_at), "MMM dd, yyyy h:mm a")
                  : "N/A"}
              </span>
            </div>
          </div>
        </TabsContent>

        {/* Customer name */}
        <TabsContent value="customer" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Customer Name</h3>
            <p>{booking.customer_name}</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sticky footer with actions */}
      <div className="sticky bottom-0 bg-background/95 py-4 border-t z-10 mt-8">
        <div className="flex justify-between items-center px-2">
          <p className="text-sm text-muted-foreground">ID: {booking.id}</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => onEdit(booking)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
