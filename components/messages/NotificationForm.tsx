"use client";

import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { XCircle } from "lucide-react";
import SendNowForm from "./SendNowForm";
import ScheduleForm from "./ScheduleForm";

interface NotificationFormProps {
  setOpenDialog: (open: boolean) => void;
  setNotifications: (notifications: any) => void;
  notifications: any[];
}

export default function NotificationForm({ setOpenDialog, setNotifications, notifications }: NotificationFormProps) {
  const [selectedTab, setSelectedTab] = useState("sendNow");

  return (
    <Dialog open={true} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send New Notification</DialogTitle>
        </DialogHeader>

        {/* Tabs for "Send Now" or "Schedule" */}
        <Tabs defaultValue="sendNow" onValueChange={setSelectedTab} className="mt-4">
          <TabsList className="flex justify-center mb-4">
            <TabsTrigger value="sendNow">Send Now</TabsTrigger>
            <TabsTrigger value="schedule">Schedule for Later</TabsTrigger>
          </TabsList>

          <TabsContent value="sendNow">
            <SendNowForm setOpenDialog={setOpenDialog} setNotifications={setNotifications} notifications={notifications} />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleForm setOpenDialog={setOpenDialog} setNotifications={setNotifications} notifications={notifications} />
          </TabsContent>
        </Tabs>

        
      </DialogContent>
    </Dialog>
  );
}
