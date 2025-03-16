"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  XCircle, 
  Send, 
  AlertCircle,
  Users,
  Mail,
  Info
} from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SendNowFormProps {
  onSend: (data: any) => void;
  onCancel: () => void;
}

export default function SendNowForm({ onSend, onCancel }: SendNowFormProps) {
  const [formData, setFormData] = useState({
    messageType: "payment-reminder",
    recipients: "all-users",
    subject: "",
    message: "",
    sendEmail: true,
    sendPush: true,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message content is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message is too short (min 10 characters)";
    }
    
    if (!formData.sendEmail && !formData.sendPush) {
      newErrors.delivery = "Select at least one delivery method";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSend(formData);
  };

  const getUsers = () => {
    // In a real app, you'd fetch these from your backend
    return [
      { id: "1", name: "All Users", count: 253 },
      { id: "2", name: "Active Members", count: 187 },
      { id: "3", name: "Expired Memberships", count: 42 },
      { id: "4", name: "New Sign-ups (Last 30 days)", count: 18 },
    ];
  };

  const getMessageType = (type: string) => {
    switch (type) {
      case "payment-reminder":
        return "Payment Reminder";
      case "appointment":
        return "Appointment Reminder";
      case "promotional":
        return "Promotional Message";
      case "announcement":
        return "Announcement";
      default:
        return "Custom Message";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert className="bg-destructive/15 text-destructive border-destructive/30">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            Please correct the errors below before sending.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="messageType">Message Type</Label>
            <Select 
              value={formData.messageType} 
              onValueChange={(value) => handleChange("messageType", value)}
            >
              <SelectTrigger id="messageType">
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment-reminder">Payment Reminder</SelectItem>
                <SelectItem value="appointment">Appointment Reminder</SelectItem>
                <SelectItem value="promotional">Promotional Message</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="custom">Custom Message</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="recipients">Recipients</Label>
            <Select 
              value={formData.recipients} 
              onValueChange={(value) => handleChange("recipients", value)}
            >
              <SelectTrigger id="recipients">
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                {getUsers().map((userGroup) => (
                  <SelectItem key={userGroup.id} value={userGroup.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{userGroup.name}</span>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded-sm ml-2">
                        {userGroup.count}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-muted-foreground gap-1 cursor-help">
                      <Users className="h-3 w-3" />
                      <span>All Users (253 recipients)</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This message will be sent to all active users in your system.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <div>
          <Label 
            htmlFor="subject"
            className={`${errors.subject ? 'text-destructive' : ''}`}
          >
            Subject
          </Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="Enter message subject"
            className={errors.subject ? "border-destructive" : ""}
          />
          {errors.subject && (
            <p className="text-destructive text-xs mt-1">{errors.subject}</p>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label 
              htmlFor="message"
              className={`${errors.message ? 'text-destructive' : ''}`}
            >
              Message Content
            </Label>
            <span className="text-xs text-muted-foreground">
              {formData.message.length} characters
            </span>
          </div>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Enter your message here..."
            rows={5}
            className={errors.message ? "border-destructive" : ""}
          />
          {errors.message && (
            <p className="text-destructive text-xs mt-1">{errors.message}</p>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Delivery Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-toggle" className="cursor-pointer">
                  Send as Email
                </Label>
              </div>
              <Switch
                id="email-toggle"
                checked={formData.sendEmail}
                onCheckedChange={(value) => handleChange("sendEmail", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <path d="M18 8a3 3 0 0 0-3-3H8.89A6 6 0 0 1 9 4.007V4a2 2 0 0 0-2-2C5.343 2 4 3.343 4 5v6.5a5.5 5.5 0 1 0 11 0V8Z"/>
                  <path d="M18 9.5V14a7 7 0 0 1-7 7v0a6.992 6.992 0 0 1-5.125-2.233v0A7.004 7.004 0 0 1 3 12.274V2"/>
                  <path d="M2.5 2H7"/>
                  <path d="M21.5 9H17"/>
                </svg>
                <Label htmlFor="push-toggle" className="cursor-pointer">
                  Send as Push Notification
                </Label>
              </div>
              <Switch
                id="push-toggle"
                checked={formData.sendPush}
                onCheckedChange={(value) => handleChange("sendPush", value)}
              />
            </div>
            
            {errors.delivery && (
              <p className="text-destructive text-xs">{errors.delivery}</p>
            )}
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="border p-4 rounded-md bg-muted/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Message Preview</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="h-6 w-6 p-0"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-background rounded border p-3">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                  R
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Rise Admin</p>
                <p className="text-xs text-muted-foreground">
                  {getMessageType(formData.messageType)}
                </p>
              </div>
            </div>
            
            <h4 className="font-medium mb-1">{formData.subject}</h4>
            <p className="text-sm">{formData.message}</p>
          </div>
        </div>
      )}

      <DialogFooter className="flex justify-between gap-3 sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            <Info className="h-4 w-4" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send Now
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}