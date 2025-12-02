"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MapPin, Clock, Users, Trophy, CreditCard, Award, Info, X, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { createEvent, createEvents } from "@/services/events";
import {
  EventCreateRequest,
  EventRecurrenceCreateRequest,
} from "@/types/events";
import { EventEventResponseDto } from "@/app/api/Api";
import { getAllPrograms } from "@/services/program";
import { getAllTeams } from "@/services/teams";
import { getAllLocations } from "@/services/location";
import { getAllCourts } from "@/services/court";
import {
  getAllMembershipPlans,
  MembershipPlanWithMembershipName,
} from "@/services/membershipPlan";
import { Program } from "@/types/program";
import { Team } from "@/types/team";
import { Location } from "@/types/location";
import { Court } from "@/types/court";
import { revalidateEvents } from "@/actions/serverActions";
import { useCalendarContext } from "../calendar-context";
import { CalendarEvent } from "@/types/calendar";
import { colorOptions } from "@/components/calendar/calendar-tailwind-classes";
import { toZonedISOString } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function getColorFromProgramType(programType?: string): string {
  switch (programType) {
    case "course":
      return colorOptions[2].value;
    case "tournament":
      return colorOptions[0].value;
    case "tryouts":
      return colorOptions[1].value;
    case "event":
      return colorOptions[3].value;
    case "game":
      return colorOptions[0].value;
    case "practice":
      return colorOptions[1].value;
    default:
      return "gray";
  }
}

export default function AddEventForm({ onClose }: { onClose?: () => void }) {
  const { data, updateField, resetData } = useFormData({
    program_id: "",
    team_id: "",
    location_id: "",
    court_id: "",
    start_at: "",
    end_at: "",
    recurrence_start_at: "",
    recurrence_end_at: "",
    event_start_at: "",
    event_end_at: "",
    day: "MONDAY",
    capacity: 0,
    credit_cost: "",
    price_amount: "", // Dollar amount (e.g., "25.00")
    currency: "cad",
    required_membership_plan_ids: [] as string[],
    registration_required: true,
  });
  const { user } = useUser();
  const { toast } = useToast();
  const { setEvents, events } = useCalendarContext();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<
    MembershipPlanWithMembershipName[]
  >([]);

  const filteredCourts = courts.filter(
    (c) => c.location_id === data.location_id
  );
  const [mode, setMode] = useState<"once" | "recurring">("once");
  const [usingCredits, setUsingCredits] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [progs, tms, locs, crts, plans] = await Promise.all([
          getAllPrograms("all"),
          getAllTeams(),
          getAllLocations(),
          getAllCourts(),
          getAllMembershipPlans(),
        ]);
        setPrograms(progs);
        setTeams(tms);
        setLocations(locs);
        setCourts(crts);
        setMembershipPlans(plans);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };

    fetchLists();
  }, []);

  const handleAddEvent = async () => {
    if (!data.program_id || !data.location_id) {
      toast({
        status: "error",
        description: "Program and location are required",
        variant: "destructive",
      });
      return;
    }

    let result: EventEventResponseDto | string | null = null;
    let creditCost: number | undefined;

    if (usingCredits) {
      const parsedCreditCost = Number(data.credit_cost);
      if (
        !data.credit_cost ||
        Number.isNaN(parsedCreditCost) ||
        parsedCreditCost <= 0
      ) {
        toast({
          status: "error",
          description: "Please provide a valid credit cost greater than zero",
          variant: "destructive",
        });
        return;
      }
      creditCost = parsedCreditCost;
    }

    if (mode === "once") {
      if (!data.start_at || !data.end_at) {
        toast({
          status: "error",
          description: "Start and end time are required",
          variant: "destructive",
        });
        return;
      }

      // Convert price_amount (dollars) to unit_amount (cents)
      const unitAmount = data.price_amount
        ? Math.round(parseFloat(data.price_amount) * 100)
        : undefined;

      const eventData: EventCreateRequest = {
        program_id: data.program_id,
        team_id: data.team_id || undefined,
        location_id: data.location_id,
        court_id: data.court_id ? data.court_id : null,
        start_at: toZonedISOString(new Date(data.start_at)),
        end_at: toZonedISOString(new Date(data.end_at)),
        capacity: data.capacity ? Number(data.capacity) : undefined,
        credit_cost: creditCost,
        ...(unitAmount ? { unit_amount: unitAmount, currency: data.currency } : {}),
        ...(data.required_membership_plan_ids && data.required_membership_plan_ids.length > 0
          ? { required_membership_plan_ids: data.required_membership_plan_ids }
          : {}),
        registration_required: data.registration_required,
      };

      result = await createEvent(eventData, user?.Jwt!);
    } else {
      if (
        !data.recurrence_start_at ||
        !data.recurrence_end_at ||
        !data.event_start_at ||
        !data.event_end_at ||
        !data.day
      ) {
        toast({
          status: "error",
          description: "All recurring fields are required",
          variant: "destructive",
        });
        return;
      }

      const formatTime = (t: string) => {
        const [h, m] = t.split(":");
        return `${h}:${m}:00+00:00`;
      };

      const startDate = new Date(data.recurrence_start_at);
      const endDate = new Date(data.recurrence_end_at);
      endDate.setHours(23, 59, 59, 999);

      // Convert price_amount (dollars) to unit_amount (cents) for recurring events
      const unitAmountRecurring = data.price_amount
        ? Math.round(parseFloat(data.price_amount) * 100)
        : undefined;

      const eventData: EventRecurrenceCreateRequest = {
        program_id: data.program_id,
        team_id: data.team_id || undefined,
        location_id: data.location_id,
        court_id: data.court_id ? data.court_id : null,
        recurrence_start_at: toZonedISOString(startDate),
        recurrence_end_at: toZonedISOString(endDate),
        event_start_at: formatTime(data.event_start_at),
        event_end_at: formatTime(data.event_end_at),
        day: data.day,
        credit_cost: creditCost,
        ...(unitAmountRecurring ? { unit_amount: unitAmountRecurring, currency: data.currency } : {}),
        ...(data.required_membership_plan_ids && data.required_membership_plan_ids.length > 0
          ? { required_membership_plan_ids: data.required_membership_plan_ids }
          : {}),
        registration_required: data.registration_required,
      };

      try {
        const createdEvents = await createEvents(eventData, user?.Jwt!);
        // Map the returned events to CalendarEvents using real IDs
        const newEvents: CalendarEvent[] = createdEvents.map((event) => ({
          id: event.id!,
          color: getColorFromProgramType(event.program?.type),
          start_at: new Date(event.start_at!),
          end_at: new Date(event.end_at!),
          capacity: event.capacity ?? 0,
          credit_cost: event.credit_cost ?? undefined,
          price_id: event.price_id ?? undefined,
          required_membership_plan_ids: event.required_membership_plan_ids ?? undefined,
          registration_required: event.registration_required ?? true,
          createdBy: {
            id: event.created_by?.id ?? "",
            firstName: event.created_by?.first_name ?? "",
            lastName: event.created_by?.last_name ?? "",
          },
          updatedBy: {
            id: event.updated_by?.id ?? "",
            firstName: event.updated_by?.first_name ?? "",
            lastName: event.updated_by?.last_name ?? "",
          },
          customers: [],
          staff: [],
          program: {
            id: event.program?.id ?? "",
            name: event.program?.name ?? "",
            type: event.program?.type ?? "",
          },
          location: {
            id: event.location?.id ?? "",
            name: event.location?.name ?? "",
            address: event.location?.address ?? "",
          },
          court: event.court
            ? { id: event.court.id ?? "", name: event.court.name ?? "" }
            : undefined,
          team: {
            id: event.team?.id ?? "",
            name: event.team?.name ?? "",
          },
        }));

        toast({
          status: "success",
          description: "Events created successfully",
        });
        resetData();
        setUsingCredits(false);
        await revalidateEvents();
        setEvents([...events, ...newEvents]);
        if (onClose) onClose();
      } catch (error) {
        toast({
          status: "error",
          description: `Failed to create events: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        });
      }
      return;
    }

    // Handle one-time event result
    const isError = typeof result === "string";

    if (!isError && result !== null) {
      toast({
        status: "success",
        description: "Event created successfully",
      });
      resetData();
      setUsingCredits(false);
      await revalidateEvents();

      // Use the real event data returned from the API
      const createdEvent = result as EventEventResponseDto;
      const newEvent: CalendarEvent = {
        id: createdEvent.id!,
        color: getColorFromProgramType(createdEvent.program?.type),
        start_at: new Date(createdEvent.start_at!),
        end_at: new Date(createdEvent.end_at!),
        capacity: createdEvent.capacity ?? 0,
        credit_cost: createdEvent.credit_cost ?? undefined,
        price_id: createdEvent.price_id ?? undefined,
        required_membership_plan_ids: createdEvent.required_membership_plan_ids ?? undefined,
        registration_required: createdEvent.registration_required ?? true,
        createdBy: {
          id: createdEvent.created_by?.id ?? "",
          firstName: createdEvent.created_by?.first_name ?? "",
          lastName: createdEvent.created_by?.last_name ?? "",
        },
        updatedBy: {
          id: createdEvent.updated_by?.id ?? "",
          firstName: createdEvent.updated_by?.first_name ?? "",
          lastName: createdEvent.updated_by?.last_name ?? "",
        },
        customers: [],
        staff: [],
        program: {
          id: createdEvent.program?.id ?? "",
          name: createdEvent.program?.name ?? "",
          type: createdEvent.program?.type ?? "",
        },
        location: {
          id: createdEvent.location?.id ?? "",
          name: createdEvent.location?.name ?? "",
          address: createdEvent.location?.address ?? "",
        },
        court: createdEvent.court
          ? { id: createdEvent.court.id ?? "", name: createdEvent.court.name ?? "" }
          : undefined,
        team: {
          id: createdEvent.team?.id ?? "",
          name: createdEvent.team?.name ?? "",
        },
      };
      setEvents([...events, newEvent]);
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Failed to create event: ${result}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      {/* Program Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Program</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Program <span className="text-red-500">*</span>
            </label>
            <Select
              value={data.program_id}
              onValueChange={(value) => updateField("program_id", value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Venue Details</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.location_id}
                onValueChange={(value) => {
                  updateField("location_id", value);
                  updateField("court_id", "");
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Court (Optional)
              </label>
              <Select
                value={data.court_id}
                onValueChange={(value) => updateField("court_id", value)}
                disabled={!data.location_id || filteredCourts.length === 0}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue
                    placeholder={
                      !data.location_id
                        ? "Select location first"
                        : filteredCourts.length === 0
                        ? "No courts available"
                        : "Select court"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourts.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Schedule</h3>
          </div>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "once" | "recurring")}
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="once">One-time</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
            </TabsList>
            <TabsContent value="once" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.start_at}
                  onChange={(e) => updateField("start_at", e.target.value)}
                  type="datetime-local"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Time <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.end_at}
                  onChange={(e) => updateField("end_at", e.target.value)}
                  type="datetime-local"
                  className="bg-background"
                />
              </div>
            </TabsContent>
            <TabsContent value="recurring" className="space-y-4 pt-4">
              <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>How recurring events work:</strong> Select a date range and day of the week. An event will be created for every occurrence of that day within the range. For example, selecting "Monday" from Jan 1-31 will create an event for each Monday in January. Users can book any individual occurrence.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Recurrence Start <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.recurrence_start_at}
                  onChange={(e) =>
                    updateField("recurrence_start_at", e.target.value)
                  }
                  type="date"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Recurrence End <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.recurrence_end_at}
                  onChange={(e) =>
                    updateField("recurrence_end_at", e.target.value)
                  }
                  type="date"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Day of Week <span className="text-red-500">*</span>
                </label>
                <Select
                  value={data.day}
                  onValueChange={(value) => updateField("day", value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "MONDAY",
                      "TUESDAY",
                      "WEDNESDAY",
                      "THURSDAY",
                      "FRIDAY",
                      "SATURDAY",
                      "SUNDAY",
                    ].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.event_start_at}
                  onChange={(e) => updateField("event_start_at", e.target.value)}
                  type="time"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Time <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.event_end_at}
                  onChange={(e) => updateField("event_end_at", e.target.value)}
                  type="time"
                  className="bg-background"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment & Access Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Payment & Access</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="event-using-credits"
                checked={usingCredits}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setUsingCredits(isChecked);
                  if (!isChecked) {
                    updateField("credit_cost", "");
                  }
                }}
              />
              <Label
                htmlFor="event-using-credits"
                className="text-sm font-medium cursor-pointer"
              >
                Use credits
              </Label>
            </div>
            {usingCredits && (
              <div className="space-y-2">
                <Label htmlFor="event-credit-cost" className="text-sm font-medium">
                  Credit Cost <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="event-credit-cost"
                  type="number"
                  min="1"
                  value={data.credit_cost}
                  onChange={(e) => updateField("credit_cost", e.target.value)}
                  className="bg-background"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="event-price-amount" className="text-sm font-medium text-muted-foreground">
                Price (Optional)
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="event-price-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={data.price_amount}
                    onChange={(e) => updateField("price_amount", e.target.value)}
                    className="bg-background pl-7"
                  />
                </div>
                <Select
                  value={data.currency}
                  onValueChange={(value) => updateField("currency", value)}
                >
                  <SelectTrigger className="w-24 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cad">CAD</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="event-required-membership-plan-ids"
                className="text-sm font-medium text-muted-foreground"
              >
                Required Membership Plans (Optional)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-background"
                  >
                    <span className="truncate">
                      {data.required_membership_plan_ids && data.required_membership_plan_ids.length > 0
                        ? `${data.required_membership_plan_ids.length} plan${data.required_membership_plan_ids.length > 1 ? 's' : ''} selected`
                        : "No membership requirement"}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="max-h-64 overflow-y-auto p-2">
                    {membershipPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                        onClick={() => {
                          const currentIds = data.required_membership_plan_ids || [];
                          const newIds = currentIds.includes(plan.id)
                            ? currentIds.filter((id) => id !== plan.id)
                            : [...currentIds, plan.id];
                          updateField("required_membership_plan_ids", newIds);
                        }}
                      >
                        <Checkbox
                          checked={data.required_membership_plan_ids?.includes(plan.id)}
                          onCheckedChange={() => {}}
                        />
                        <label className="text-sm cursor-pointer flex-1">
                          {`${plan.membershipName} – ${plan.name}`}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {data.required_membership_plan_ids && data.required_membership_plan_ids.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.required_membership_plan_ids.map((planId) => {
                    const plan = membershipPlans.find((p) => p.id === planId);
                    return plan ? (
                      <Badge
                        key={planId}
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        {plan.membershipName} – {plan.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            const newIds = data.required_membership_plan_ids?.filter(
                              (id) => id !== planId
                            ) || [];
                            updateField("required_membership_plan_ids", newIds);
                          }}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="event-registration-required"
                checked={data.registration_required}
                onCheckedChange={(checked) => updateField("registration_required", !!checked)}
              />
              <Label htmlFor="event-registration-required" className="text-sm font-medium cursor-pointer">
                Registration Required
              </Label>
              <span className="text-sm text-muted-foreground">(uncheck for drop-in events)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddEvent}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Create Event
        </Button>
      </div>
    </div>
  );
}
