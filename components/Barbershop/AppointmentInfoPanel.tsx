"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HaircutEventEventResponseDto } from "@/app/api/Api";
import { format } from "date-fns";
import { fromZonedISOString } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { deleteHaircutEvent } from "@/services/haircuts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, ClipboardList, Clock, User, Scissors, TrashIcon } from "lucide-react";
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

        <TabsContent value="details" className="pt-4">
          <div className="space-y-6">
            {/* Appointment Time Section */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-lg">Appointment Time</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{getFormattedDate(appointment.start_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Duration: {getAppointmentDuration()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Barber Information Section */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Scissors className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-lg">Barber Information</h3>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong>{" "}
                    {appointment.barber_name || "Not assigned"}
                  </p>
                  <p>
                    <strong>ID:</strong> {appointment.barber_id || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Date Information Section */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-lg">Date Information</h3>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Created:</strong>{" "}
                    {getFormattedDate(appointment.created_at)}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {getFormattedDate(appointment.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="pt-4">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-lg">Customer Information</h3>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong>{" "}
                  {appointment.customer_name || "Not specified"}
                </p>
                <p>
                  <strong>ID:</strong> {appointment.customer_id || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex items-center justify-end gap-3 pt-2">
        <p className="text-sm text-muted-foreground mr-auto">
          ID: {appointment.id || "New Appointment"}
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isCancelling}
              className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
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
              <AlertDialogAction
                onClick={handleCancelAppointment}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
