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
  Info,
  CalendarIcon,
  ClockIcon,
  RepeatIcon,
  CheckCircle2
} from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ScheduleFormProps {
  onSchedule: (data: any) => void;
  onCancel: () => void;
}

export default function ScheduleForm({ onSchedule, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    messageType: "payment-reminder",
    recipients: "all-users",
    subject: "",
    message: "",
    sendEmail: true,
    sendPush: true,
    scheduleDate: new Date(Date.now() + 86400000), // Tomorrow
    scheduleTime: "09:00",
    recurring: false,
    recurringFrequency: "weekly",
    recurringDays: ["monday"],
    endDate: addDays(new Date(), 30),
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [schedulingOption, setSchedulingOption] = useState<'once' | 'recurring'>('once');

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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

    const now = new Date();
    const scheduleDateTime = new Date(
      formData.scheduleDate.getFullYear(),
      formData.scheduleDate.getMonth(),
      formData.scheduleDate.getDate(),
      parseInt(formData.scheduleTime.split(':')[0]),
      parseInt(formData.scheduleTime.split(':')[1])
    );

    if (scheduleDateTime <= now) {
      newErrors.scheduleDate = "Scheduled time must be in the future";
    }
    
    if (schedulingOption === 'recurring' && formData.recurring) {
      if (!formData.recurringDays || formData.recurringDays.length === 0) {
        newErrors.recurringDays = "Select at least one day for recurring messages";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const scheduleData = {
      ...formData,
      recurring: schedulingOption === 'recurring',
      scheduleOption: schedulingOption
    };
    
    onSchedule(scheduleData);
  };

  const getUsers = () => {
    // In a real app, you'd fetch these from your backend
    return [
      { id: "all-users", name: "All Users", count: 253 },
      { id: "active-members", name: "Active Members", count: 187 },
      { id: "expired", name: "Expired Memberships", count: 42 },
      { id: "new-signups", name: "New Sign-ups (Last 30 days)", count: 18 },
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

  const weekdays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const handleRecurringDayToggle = (day: string) => {
    const currentDays = [...formData.recurringDays];
    
    if (currentDays.includes(day)) {
      handleChange('recurringDays', currentDays.filter(d => d !== day));
    } else {
      handleChange('recurringDays', [...currentDays, day]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert className="bg-destructive/15 text-destructive border-destructive/30">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            Please correct the errors below before scheduling.
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
              {formData.recipients && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground gap-1 cursor-help">
                        <Users className="h-3 w-3" />
                        <span>
                          {getUsers().find(u => u.id === formData.recipients)?.name} 
                          ({getUsers().find(u => u.id === formData.recipients)?.count} recipients)
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This message will be scheduled for all selected recipients.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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
        
        {/* Scheduling Options */}
        <div className="space-y-4 pt-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h3 className="text-base font-medium">Schedule Options</h3>
          </div>
          
          <Tabs
            defaultValue="once"
            value={schedulingOption}
            onValueChange={(value) => setSchedulingOption(value as 'once' | 'recurring')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="once">One-time Send</TabsTrigger>
              <TabsTrigger value="recurring">Recurring Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="once" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleDate" className={errors.scheduleDate ? "text-destructive" : ""}>
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="scheduleDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.scheduleDate && "text-muted-foreground",
                          errors.scheduleDate && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.scheduleDate ? format(formData.scheduleDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.scheduleDate}
                        onSelect={(date) => handleChange("scheduleDate", date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scheduleTime">Time</Label>
                  <div className="relative">
                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="scheduleTime"
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => handleChange("scheduleTime", e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              
              {errors.scheduleDate && (
                <p className="text-destructive text-xs">{errors.scheduleDate}</p>
              )}
              
              <div className="bg-muted/40 p-3 rounded-md flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <p>Your message will be sent on <span className="font-medium">{format(formData.scheduleDate, "EEEE, MMMM d")} at {formData.scheduleTime}</span>.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="recurring" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Repeat Frequency</Label>
                <Select
                  value={formData.recurringFrequency}
                  onValueChange={(value) => handleChange("recurringFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.recurringFrequency === "weekly" && (
                <div className="space-y-2">
                  <Label className={errors.recurringDays ? "text-destructive" : ""}>
                    Repeat on Days
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {weekdays.map((day) => (
                      <Badge
                        key={day.value}
                        variant={formData.recurringDays.includes(day.value) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          formData.recurringDays.includes(day.value) 
                            ? "bg-primary" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleRecurringDayToggle(day.value)}
                      >
                        {day.label.slice(0, 3)}
                      </Badge>
                    ))}
                  </div>
                  {errors.recurringDays && (
                    <p className="text-destructive text-xs">{errors.recurringDays}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleTime">Time</Label>
                  <div className="relative">
                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="recurringTime"
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => handleChange("scheduleTime", e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick an end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => handleChange("endDate", date)}
                        disabled={(date) => date < formData.scheduleDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="bg-muted/40 p-3 rounded-md flex items-start gap-2 text-sm">
                <RepeatIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="mb-1">Your message will be sent:</p>
                  <ul className="list-disc list-inside pl-1 space-y-0.5 text-muted-foreground">
                    {formData.recurringFrequency === 'daily' && (
                      <li>Daily at {formData.scheduleTime}</li>
                    )}
                    {formData.recurringFrequency === 'weekly' && formData.recurringDays.length > 0 && (
                      <li>
                        Weekly on {formData.recurringDays.map(day => 
                          day.charAt(0).toUpperCase() + day.slice(1)
                        ).join(', ')} at {formData.scheduleTime}
                      </li>
                    )}
                    {formData.recurringFrequency === 'monthly' && (
                      <li>Monthly on day {formData.scheduleDate.getDate()} at {formData.scheduleTime}</li>
                    )}
                    <li>Until {format(formData.endDate, "MMMM d, yyyy")}</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
            <CalendarIcon className="h-4 w-4" />
            {schedulingOption === 'once' ? 'Schedule Message' : 'Set Recurring Schedule'}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}