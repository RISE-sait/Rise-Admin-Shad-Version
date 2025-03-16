"use client";

import React from "react";
import SendNowForm from "./SendNowForm";
import ScheduleForm from "./ScheduleForm";
import { Notification } from "./columns-messages";

interface NotificationFormProps {
  type: "send" | "schedule"; // Add this missing prop
  onSend: (message: Partial<Notification>) => void;
  onCancel: () => void;
}

export default function NotificationForm({ type, onSend, onCancel }: NotificationFormProps) {
  return type === "send" ? (
    <SendNowForm onSend={onSend} onCancel={onCancel} />
  ) : (
    <ScheduleForm onSchedule={onSend} onCancel={onCancel} />
  );
}