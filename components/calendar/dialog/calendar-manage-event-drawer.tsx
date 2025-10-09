"use client";

import { useState, useEffect } from "react";
// import * as React from "react";

import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, UserRound } from "lucide-react";
import RightDrawer from "@/components/reusable/RightDrawer";
import { useCalendarContext } from "../calendar-context";
import EditEventForm from "../event/EditEventForm";
import EventStaffTab from "../event/EventStaffTab";
import { deleteEvent } from "@/services/events";
import { deletePractice } from "@/services/practices";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { revalidateEvents, revalidatePractices } from "@/actions/serverActions";
import { CalendarEvent } from "@/types/calendar";
import {
  getAllMembershipPlans,
  MembershipPlanWithMembershipName,
} from "@/services/membershipPlan";

export default function CalendarManageEventDrawer() {
  const {
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents,
  } = useCalendarContext();
  const { user } = useUser();
  const { toast } = useToast();

  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [membershipPlans, setMembershipPlans] = useState<
    MembershipPlanWithMembershipName[]
  >([]);
  const requiredMembershipPlanLabel = selectedEvent?.required_membership_plan_id
    ? (() => {
        const plan = membershipPlans.find(
          (item) => item.id === selectedEvent.required_membership_plan_id
        );

        if (!plan) {
          return undefined;
        }

        return `${plan.membershipName} – ${plan.name}`;
      })()
    : undefined;

  const eventType = selectedEvent?.program?.type?.toLowerCase();
  const eventTypeLabel = eventType
    ? eventType.charAt(0).toUpperCase() + eventType.slice(1)
    : "Event";
  const showStaffTab =
    !!selectedEvent && eventType !== "game" && eventType !== "practice";

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const plans = await getAllMembershipPlans();
        if (isMounted) {
          setMembershipPlans(plans);
        }
      } catch (error) {
        console.error("Failed to load membership plans", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showStaffTab && activeTab === "staff") {
      setActiveTab("details");
    }
  }, [showStaffTab, activeTab]);

  async function handleDelete() {
    if (!selectedEvent) return;
    try {
      const isPractice = selectedEvent.program.type === "practice";
      const error = isPractice
        ? await deletePractice(selectedEvent.id, user?.Jwt!)
        : await deleteEvent(selectedEvent.id, user?.Jwt!);

      if (error === null) {
        toast({
          status: "success",
          description: `${isPractice ? "Practice" : "Event"} deleted successfully`,
        });
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        await revalidateEvents();
        if (isPractice) {
          await revalidatePractices();
        }
        handleClose();
      } else {
        toast({
          status: "error",
          description: `Failed to delete event: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        status: "error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  }

  function handleClose() {
    setManageEventDialogOpen(false);
    setSelectedEvent(null);
    // form.reset()
    setShowEditForm(false);
    setActiveTab("details");
  }

  const handleStaffUpdated = (updatedStaff: CalendarEvent["staff"]) => {
    if (!selectedEvent) return;

    const updatedEvent: CalendarEvent = {
      ...selectedEvent,
      staff: updatedStaff,
    };

    setSelectedEvent(updatedEvent);
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return (
    <RightDrawer
      drawerOpen={manageEventDialogOpen}
      handleDrawerClose={handleClose}
      drawerWidth="w-[40%]"
    >
      {selectedEvent && (
        <div className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              if (value !== "details") {
                setShowEditForm(false);
              }
            }}
            className="space-y-6"
          >
            <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1 rounded-none border-b border-border">
              <TabsTrigger
                value="details"
                className="flex items-center gap-2 px-6 py-3 rounded-none bg-transparent hover:bg-muted/50 transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <Info className="h-4 w-4" />
                Details
              </TabsTrigger>
              {showStaffTab && (
                <TabsTrigger
                  value="staff"
                  className="flex items-center gap-2 px-6 py-3 rounded-none bg-transparent hover:bg-muted/50 transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <UserRound className="h-4 w-4" />
                  Staff
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="details">
              {showEditForm ? (
                <EditEventForm onClose={handleClose} />
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    {eventTypeLabel && (
                      <p className="font-bold uppercase text-primary">
                        {eventTypeLabel}
                      </p>
                    )}
                    <h1 className="text-xl font-semibold">
                      {selectedEvent.program.name || "Unnamed Event"}
                    </h1>
                    <p className="text-base text-muted-foreground">
                      Date:{" "}
                      {selectedEvent.start_at.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-base text-muted-foreground">
                      Start Time:{" "}
                      {selectedEvent.start_at.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-base text-muted-foreground">
                      End Time:{" "}
                      {selectedEvent.end_at.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {selectedEvent.location.name}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {selectedEvent.location.address}
                    </p>
                    {selectedEvent.credit_cost != null && (
                      <p className="text-base text-muted-foreground">
                        Credit cost: {selectedEvent.credit_cost}
                      </p>
                    )}
                    {selectedEvent.price_id && (
                      <p className="text-base text-muted-foreground">
                        Price ID: {selectedEvent.price_id}
                      </p>
                    )}
                    {selectedEvent.required_membership_plan_id && (
                      <p className="text-base text-muted-foreground">
                        Required Membership Plan:{" "}
                        {requiredMembershipPlanLabel ||
                          selectedEvent.required_membership_plan_id}
                      </p>
                    )}
                    {selectedEvent.team?.name && (
                      <p className="text-base text-muted-foreground">
                        Team: {selectedEvent.team.name}
                      </p>
                    )}
                    {(() => {
                      const eventCourt = (selectedEvent as any).court;
                      const courtName =
                        (selectedEvent as any).court_name ||
                        (typeof eventCourt === "string"
                          ? eventCourt
                          : eventCourt?.name || "");

                      return courtName ? (
                        <p className="text-base text-muted-foreground">
                          Court: {courtName}
                        </p>
                      ) : null;
                    })()}
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowEditForm(true)}
                    >
                      Edit this Event
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this event? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Confirm Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </TabsContent>
            {showStaffTab && (
              <TabsContent value="staff" className="mt-4">
                <EventStaffTab
                  event={selectedEvent}
                  onStaffChange={handleStaffUpdated}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </RightDrawer>
  );
}
