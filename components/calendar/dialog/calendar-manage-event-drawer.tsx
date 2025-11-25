"use client";

import { useState, useEffect, useCallback } from "react";
// import * as React from "react";
import { useRouter } from "next/navigation";

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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Info,
  UserRound,
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  DollarSign,
  Award,
  Trophy,
} from "lucide-react";
import RightDrawer from "@/components/reusable/RightDrawer";
import { useCalendarContext } from "../calendar-context";
import EditEventForm from "../event/EditEventForm";
import EventStaffTab from "../event/EventStaffTab";
import AttendeesTable from "./manage/AttendeesTable";
import { deleteEvent, getEvent } from "@/services/events";
import { deletePractice } from "@/services/practices";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { revalidateEvents, revalidatePractices } from "@/actions/serverActions";
import { CalendarEvent } from "@/types/calendar";
import { EventParticipant } from "@/types/events";
import {
  getAllMembershipPlans,
  MembershipPlanWithMembershipName,
} from "@/services/membershipPlan";
import { StaffRoleEnum } from "@/types/user";

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
  const router = useRouter();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [membershipPlans, setMembershipPlans] = useState<
    MembershipPlanWithMembershipName[]
  >([]);
  const [fullEventData, setFullEventData] = useState<EventParticipant[] | null>(
    null
  );
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const requiredMembershipPlanLabels = selectedEvent?.required_membership_plan_ids
    ? selectedEvent.required_membership_plan_ids
        .map((planId) => {
          const plan = membershipPlans.find((item) => item.id === planId);
          if (!plan) return null;
          return `${plan.membershipName} – ${plan.name}`;
        })
        .filter(Boolean) as string[]
    : [];

  const eventType = selectedEvent?.program?.type?.toLowerCase();
  const eventTypeLabel = eventType
    ? eventType.charAt(0).toUpperCase() + eventType.slice(1)
    : "Event";
  const showStaffTab =
    !!selectedEvent && eventType !== "game" && eventType !== "practice";
  const showCustomersTab =
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

  // Fetch full event data when drawer opens for events (not games/practices)
  useEffect(() => {
    let isMounted = true;

    if (selectedEvent && showCustomersTab && manageEventDialogOpen) {
      setIsLoadingCustomers(true);
      getEvent(selectedEvent.id, user?.Jwt)
        .then((eventData) => {
          if (isMounted) {
            setFullEventData(eventData.customers);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch full event data:", error);
          if (isMounted) {
            setFullEventData([]);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingCustomers(false);
          }
        });
    } else {
      setFullEventData(null);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedEvent?.id, showCustomersTab, manageEventDialogOpen, user?.Jwt]);

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
    setFullEventData(null);
    setIsLoadingCustomers(false);
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

  const handleCustomerRemoved = useCallback(
    async (customerId: string) => {
      setFullEventData((prev) => {
        if (!prev) {
          return prev;
        }

        return prev.filter((customer) => customer.id !== customerId);
      });

      if (!selectedEvent) {
        await revalidateEvents();
        return;
      }

      const updatedEvent: CalendarEvent = {
        ...selectedEvent,
        customers: selectedEvent.customers.filter(
          (customer) => customer.id !== customerId
        ),
      };

      setSelectedEvent(updatedEvent);
      setEvents(
        events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );

      await revalidateEvents();
    },
    [
      events,
      revalidateEvents,
      selectedEvent,
      setEvents,
      setFullEventData,
      setSelectedEvent,
    ]
  );

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
              {showCustomersTab && (
                <TabsTrigger
                  value="customers"
                  className="flex items-center gap-2 px-6 py-3 rounded-none bg-transparent hover:bg-muted/50 transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <Users className="h-4 w-4" />
                  Customers
                </TabsTrigger>
              )}
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
                  {/* Header Section */}
                  <div className="space-y-3">
                    {eventTypeLabel && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xs font-semibold px-3 py-1">
                        {eventTypeLabel}
                      </Badge>
                    )}
                    <h1 className="text-2xl font-bold">
                      {selectedEvent.program.name || "Unnamed Event"}
                    </h1>
                  </div>

                  {/* Date & Time Card */}
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-semibold text-lg">Schedule</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm font-medium">Date</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedEvent.start_at.toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm font-medium">Time</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedEvent.start_at.toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}{" "}
                              -{" "}
                              {selectedEvent.end_at.toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Card */}
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-semibold text-lg">Venue</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          {selectedEvent.location.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent.location.address}
                        </p>
                        {(() => {
                          const eventCourt = (selectedEvent as any).court;
                          const courtName =
                            (selectedEvent as any).court_name ||
                            (typeof eventCourt === "string"
                              ? eventCourt
                              : eventCourt?.name || "");

                          return courtName ? (
                            <p className="text-sm text-muted-foreground">
                              Court: {courtName}
                            </p>
                          ) : null;
                        })()}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Card (if applicable) */}
                  {selectedEvent.team?.name && (
                    <Card className="border-l-4 border-l-yellow-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="h-5 w-5 text-yellow-500" />
                          <h3 className="font-semibold text-lg">Team</h3>
                        </div>
                        <p className="text-sm font-medium">
                          {selectedEvent.team.name}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Payment & Access Card (if applicable) */}
                  {(selectedEvent.credit_cost != null ||
                    selectedEvent.price_id ||
                    (selectedEvent.required_membership_plan_ids && selectedEvent.required_membership_plan_ids.length > 0)) && (
                    <Card className="border-l-4 border-l-yellow-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <CreditCard className="h-5 w-5 text-yellow-500" />
                          <h3 className="font-semibold text-lg">
                            Payment & Access
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {selectedEvent.credit_cost != null && (
                            <div className="flex items-start gap-3">
                              <Trophy className="h-4 w-4 text-muted-foreground mt-1" />
                              <div>
                                <p className="text-sm font-medium">
                                  Credit Cost
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedEvent.credit_cost} credits
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedEvent.price_id && (
                            <div className="flex items-start gap-3">
                              <DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
                              <div>
                                <p className="text-sm font-medium">Price ID</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedEvent.price_id}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedEvent.required_membership_plan_ids && selectedEvent.required_membership_plan_ids.length > 0 && (
                            <div className="flex items-start gap-3">
                              <Award className="h-4 w-4 text-muted-foreground mt-1" />
                              <div>
                                <p className="text-sm font-medium">
                                  Required Membership{selectedEvent.required_membership_plan_ids.length > 1 ? 's' : ''}
                                </p>
                                <div className="space-y-1">
                                  {requiredMembershipPlanLabels.length > 0 ? (
                                    requiredMembershipPlanLabels.map((label, index) => (
                                      <p key={index} className="text-sm text-muted-foreground">
                                        {label}
                                      </p>
                                    ))
                                  ) : (
                                    selectedEvent.required_membership_plan_ids.map((planId, index) => (
                                      <p key={index} className="text-sm text-muted-foreground">
                                        {planId}
                                      </p>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Separator />

                  {/* Action Buttons */}
                  {!isReceptionist && (
                    <div className="space-y-3">
                      {eventType === "game" ? (
                        <Button
                          variant="outline"
                          className="w-full h-11"
                          onClick={() => router.push("/manage/games")}
                        >
                          Edit Game on Games Page
                        </Button>
                      ) : eventType === "practice" ? (
                        <Button
                          variant="outline"
                          className="w-full h-11"
                          onClick={() => router.push("/manage/practices")}
                        >
                          Edit Practice on Practices Page
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full h-11"
                          onClick={() => setShowEditForm(true)}
                        >
                          Edit this Event
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full h-11">
                            Delete Event
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
                  )}
                </div>
              )}
            </TabsContent>
            {showCustomersTab && (
              <TabsContent value="customers" className="mt-4">
                {isLoadingCustomers ? (
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-6">
                      <div className="text-center py-12">
                        <p className="text-sm text-muted-foreground">
                          Loading customers...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <AttendeesTable
                    eventId={selectedEvent.id}
                    data={fullEventData || []}
                    onCustomerRemoved={handleCustomerRemoved}
                  />
                )}
              </TabsContent>
            )}
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
