"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Clock, Trash2, RefreshCw, MoreHorizontal, CheckCircle, AlertCircle, CalendarClock } from "lucide-react";
import { DataTable } from "@/components/messages/data-table-messages";
import { columns, Notification } from "./columns-messages";
import NotificationForm from "./NotificationForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RightDrawer from "@/components/reusable/RightDrawer";

// Enhanced dummy data with more examples
const dummyNotifications: Notification[] = [
  { id: "1", type: "Payment Reminder", message: "Your monthly payment of $49.99 is due tomorrow.", recipient: "alex@example.com", status: "Sent", date: "2024-03-08" },
  { id: "2", type: "Appointment Reminder", message: "Your fitness assessment is scheduled for tomorrow at 2:00 PM.", recipient: "john@example.com", status: "Scheduled", date: "2024-03-20" },
  { id: "3", type: "Subscription Renewal", message: "Your premium membership will renew on April 1st. Log in to manage your subscription.", recipient: "mike@example.com", status: "Sent", date: "2024-03-05" },
  { id: "4", type: "Promotional", message: "Spring Sale! Get 20% off all membership plans for the next 48 hours with code SPRING20.", recipient: "All Users", status: "Scheduled", date: "2024-03-28" },
  { id: "5", type: "Custom", message: "The gym will be closed on March 31st for scheduled maintenance.", recipient: "All Users", status: "Sent", date: "2024-03-01" },
  { id: "6", type: "Payment Reminder", message: "Your invoice #INV-2024-0123 is past due. Please make payment as soon as possible.", recipient: "sarah@example.com", status: "Failed", date: "2024-03-12" }
];

type FilterType = "all" | "sent" | "scheduled" | "failed";

export default function MessagesPage() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [showForm, setShowForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [formType, setFormType] = useState<"send" | "schedule">("send");
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    return notification.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedRows.length} selected notifications?`)) {
      setNotifications(notifications.filter(n => !selectedRows.includes(n.id)));
      setSelectedRows([]);
    }
  };

  const handleBulkResend = () => {
    if (selectedRows.length === 0) return;
    // In a real app, you'd have API logic here
    alert(`Resending ${selectedRows.length} notifications`);
  };

  const handleStatusUpdate = (id: string, newStatus: "Sent" | "Scheduled" | "Failed") => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, status: newStatus } : notification
    ));
  };

  const handleSendMessage = (message: Partial<Notification>) => {
    const newNotification: Notification = {
      id: `${Date.now()}`,
      type: message.type || "Custom",
      message: message.message || "",
      recipient: message.recipient || "All Users",
      status: formType === "send" ? "Sent" : "Scheduled",
      date: new Date().toISOString().split('T')[0]
    };
    
    setNotifications([newNotification, ...notifications]);
    setShowForm(false);
  };

  const sentCount = notifications.filter(n => n.status === "Sent").length;
  const scheduledCount = notifications.filter(n => n.status === "Scheduled").length;
  const failedCount = notifications.filter(n => n.status === "Failed").length;

  return (
    <div className="w-full p-6">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Messages & Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Manage and send notifications to your users
          </p>
        </div>

        <div className="flex gap-2">
          {selectedRows.length > 0 ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkResend} 
                className="gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Resend ({selectedRows.length})
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkDelete} 
                className="gap-1 border-destructive text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete ({selectedRows.length})
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Create New Message
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setFormType("send");
                  setShowForm(true);
                }}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setFormType("schedule");
                  setShowForm(true);
                }}>
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule for Later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Smaller cards in a 4-column grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card
          className={`bg-muted/20 ${activeFilter === "all" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveFilter("all")}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-base font-medium">All Messages</CardTitle>
            <CardDescription className="text-xs">View all types</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{notifications.length}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-muted/20 ${activeFilter === "sent" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveFilter("sent")}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              <CardTitle className="text-base font-medium">Sent</CardTitle>
            </div>
            <CardDescription className="text-xs">Delivered</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{sentCount}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-muted/20 ${activeFilter === "scheduled" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveFilter("scheduled")}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5 text-blue-500" />
              <CardTitle className="text-base font-medium">Scheduled</CardTitle>
            </div>
            <CardDescription className="text-xs">Future delivery</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{scheduledCount}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-muted/20 ${activeFilter === "failed" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveFilter("failed")}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-red-500" />
              <CardTitle className="text-base font-medium">Failed</CardTitle>
            </div>
            <CardDescription className="text-xs">Delivery failed</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{failedCount}</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={filteredNotifications}
        columns={columns}
        onStatusUpdate={handleStatusUpdate}
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
      />

      {/* Using your custom RightDrawer component */}
      <RightDrawer 
        drawerOpen={showForm}
        handleDrawerClose={() => setShowForm(false)}
        drawerWidth="w-full sm:w-[500px] md:w-[600px]"
      >
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold" id="sheet-title">
              {formType === "send" ? "Send New Message" : "Schedule Message"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {formType === "send" 
                ? "Create and immediately send a new message to users" 
                : "Schedule a message to be sent at a later time"}
            </p>
          </div>
          
          <NotificationForm 
            type={formType}
            onSend={handleSendMessage}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </RightDrawer>
    </div>
  );
}