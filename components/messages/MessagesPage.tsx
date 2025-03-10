"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { DataTable } from "@/components/messages/data-table-messages";
import { columns, Notification } from "./columns-messages";
import NotificationForm from "./NotificationForm"; // Import the form

const dummyNotifications: Notification[] = [
  { id: "1", type: "Payment Reminder", message: "Your payment is due.", recipient: "alex@example.com", status: "Sent", date: "2024-03-08" },
  { id: "2", type: "Appointment Reminder", message: "Your appointment is tomorrow.", recipient: "john@example.com", status: "Scheduled", date: "2024-03-20" },
  { id: "3", type: "Subscription Renewal", message: "Your subscription renews soon.", recipient: "mike@example.com", status: "Sent", date: "2024-03-05" },
  { id: "4", type: "Promotional", message: "Get 20% off on your next purchase!", recipient: "sara@example.com", status: "Sent", date: "2024-03-10" }
];

export default function MessagesPage() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto py-10">
      <header className="mb-6 flex justify-between">
        <h1 className="text-3xl font-bold">Messages & Notifications</h1>
        {/* Open Notification Form Modal */}
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Send className="mr-2 h-4 w-4" /> Draft a Message
        </Button>
      </header>

      <DataTable columns={columns} data={notifications} />

      {showForm && (
        <NotificationForm setOpenDialog={setShowForm} setNotifications={setNotifications} notifications={notifications} />
      )}
    </div>
  );
}
