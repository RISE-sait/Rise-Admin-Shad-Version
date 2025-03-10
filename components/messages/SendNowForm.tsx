"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";
import { DialogFooter } from "../ui/dialog";

interface SendNowFormProps {
  setOpenDialog: (open: boolean) => void;
  setNotifications: (notifications: any) => void;
  notifications: any[];
}

export default function SendNowForm({ setOpenDialog, setNotifications, notifications }: SendNowFormProps) {
  const [sendToAll, setSendToAll] = useState(false); // Toggle for sending to all users
  const [newNotification, setNewNotification] = useState({
    type: "Select Type",
    message: "",
    recipient: "",
    status: "Sent",
  });

  const handleSendNotification = () => {
    if (!newNotification.message || (!sendToAll && !newNotification.recipient)) return;

    const newEntry = {
      id: String(notifications.length + 1),
      type: newNotification.type,
      message: newNotification.message,
      recipient: sendToAll ? "All Users" : newNotification.recipient, // Handle "All Users" case
      status: "Sent",
      date: new Date().toISOString(),
    };

    setNotifications([...notifications, newEntry]);
    setOpenDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">{newNotification.type}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setNewNotification({ ...newNotification, type: "Payment Reminder" })}>Payment Reminder</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setNewNotification({ ...newNotification, type: "Appointment Reminder" })}>Appointment Reminder</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setNewNotification({ ...newNotification, type: "Subscription Renewal" })}>Subscription Renewal</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setNewNotification({ ...newNotification, type: "Promotional" })}>Promotional</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setNewNotification({ ...newNotification, type: "Custom" })}>Custom</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Message Input */}
      <Input 
        placeholder="Enter Message" 
        value={newNotification.message} 
        onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
      />

      {/* Send to All Users Toggle */}
      <div className="flex items-center gap-3">
        <Switch id="send-to-all" checked={sendToAll} onCheckedChange={setSendToAll} />
        <Label htmlFor="send-to-all">Send to all users?</Label>
      </div>

      {/* Recipient Email Input (Disabled if "Send to All" is ON) */}
      {!sendToAll && (
        <Input 
          placeholder="Recipient Email" 
          value={newNotification.recipient} 
          onChange={(e) => setNewNotification({ ...newNotification, recipient: e.target.value })}
        />
      )}

      <DialogFooter>
        <Button onClick={handleSendNotification} disabled={!newNotification.message || (!sendToAll && !newNotification.recipient)}>
          Send Now
        </Button>
        <Button variant="ghost" onClick={() => setOpenDialog(false)}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </DialogFooter>
    </div>
  );
}
