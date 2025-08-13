"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HaircutEventEventResponseDto } from "@/app/api/Api";
import { format } from "date-fns";
import { fromZonedISOString } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { deleteHaircutEvent } from "@/services/haircuts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, ClipboardList, Clock, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppointmentInfoPanelProps {
  appointment: HaircutEventEventResponseDto;
  onAppointmentUpdated?: () => void;
}

export default function AppointmentInfoPanel({
  appointment,
  onAppointmentUpdated,
}: AppointmentInfoPanelProps) {
  const [tabValue, setTabValue] = useState("details");
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  // Format appointment date
  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return format(fromZonedISOString(dateString), "MMMM d, yyyy h:mm a");
  };

  // Calculate appointment duration in minutes
  const getAppointmentDuration = () => {
    if (!appointment.start_at || !appointment.end_at) return "Unknown";
    const start = fromZonedISOString(appointment.start_at);
    const end = fromZonedISOString(appointment.end_at);
    const diffMinutes = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60)
    );
    return `${diffMinutes} minutes`;
  };

  // Handle cancel appointment
  const handleCancelAppointment = async () => {
    if (!appointment.id || !user?.Jwt) {
      toast({
        status: "error",
        description: "Unable to cancel appointment: Missing information",
      });
      return;
    }

    try {
      setIsCancelling(true);
      await deleteHaircutEvent(appointment.id, user.Jwt);
      toast({
        status: "success",
        description: "Appointment canceled successfully",
      });
      if (onAppointmentUpdated) {
        onAppointmentUpdated();
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({ status: "error", description: "Failed to cancel appointment" });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <ClipboardList className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="customer"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <User className="h-4 w-4" />
              Customer
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-secondary/10 p-4 rounded-lg">
                <h3 className="font-medium text-muted-foreground mb-2">
                  Appointment Time
                </h3>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span>{getFormattedDate(appointment.start_at)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>Duration: {getAppointmentDuration()}</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Barber Information</h3>
                <p>
                  <strong>Name:</strong>{" "}
                  {appointment.barber_name || "Not assigned"}
                </p>
                <p>
                  <strong>ID:</strong> {appointment.barber_id || "N/A"}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Date Information</h3>
                <p>
                  <strong>Created:</strong>{" "}
                  {getFormattedDate(appointment.created_at)}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {getFormattedDate(appointment.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customer">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <p>
                <strong>Name:</strong>{" "}
                {appointment.customer_name || "Not specified"}
              </p>
              <p>
                <strong>ID:</strong> {appointment.customer_id || "N/A"}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="max-w-full mx-auto px-2 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            ID: {appointment.id || "New Appointment"}
          </p>

          <div className="flex items-center gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isCancelling}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isCancelling ? "Canceling..." : "Cancel Appointment"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this appointment?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelAppointment}>
                    Confirm Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
