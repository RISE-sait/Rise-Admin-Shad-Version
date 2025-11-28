"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SaveIcon, X, ChevronDown, Calendar, MapPin, Clock, CreditCard, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { updateEvent } from "@/services/events";
import { EventCreateRequest } from "@/types/events";
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
import { toZonedISOString, toLocalISOString } from "@/lib/utils";

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

export default function EditEventForm({ onClose }: { onClose?: () => void }) {
  const { user } = useUser();
  const { toast } = useToast();
  const { selectedEvent, setEvents, events } = useCalendarContext();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<
    MembershipPlanWithMembershipName[]
  >([]);

  const [data, setData] = useState({
    program_id: "",
    team_id: "",
    location_id: "",
    court_id: "",
    start_at: "",
    end_at: "",
    credit_cost: "",
    price_amount: "", // Dollar amount (e.g., "25.00")
    currency: "cad",
    required_membership_plan_ids: [] as string[],
    registration_required: true,
  });
  const [usingCredits, setUsingCredits] = useState(false);

  const filteredCourts = courts.filter(
    (c) => c.location_id === data.location_id
  );

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

  useEffect(() => {
    if (selectedEvent) {
      // Convert unit_amount (cents) to price_amount (dollars) if available
      const priceAmount = selectedEvent.unit_amount
        ? (selectedEvent.unit_amount / 100).toFixed(2)
        : "";
      setData({
        program_id: selectedEvent.program.id,
        team_id: selectedEvent.team?.id || "",
        location_id: selectedEvent.location.id,
        court_id:
          (selectedEvent as any).court?.id ||
          (selectedEvent as any).court_id ||
          "",
        start_at: toLocalISOString(selectedEvent.start_at).slice(0, 16),
        end_at: toLocalISOString(selectedEvent.end_at).slice(0, 16),
        credit_cost:
          selectedEvent.credit_cost != null
            ? String(selectedEvent.credit_cost)
            : "",
        price_amount: priceAmount,
        currency: selectedEvent.currency ?? "cad",
        required_membership_plan_ids:
          selectedEvent.required_membership_plan_ids ?? [],
        registration_required: selectedEvent.registration_required ?? true,
      });
      setUsingCredits(selectedEvent.credit_cost != null);
    }
  }, [selectedEvent]);

  const handleUpdate = async () => {
    if (!selectedEvent) return;
    if (!data.program_id || !data.location_id) {
      toast({
        status: "error",
        description: "Program and location are required",
        variant: "destructive",
      });
      return;
    }
    if (!data.start_at || !data.end_at) {
      toast({
        status: "error",
        description: "Start and end time are required",
        variant: "destructive",
      });
      return;
    }

    let creditCost: number | undefined;

    if (usingCredits) {
      if (!data.credit_cost) {
        toast({
          status: "error",
          description: "Credit cost is required when using credits",
          variant: "destructive",
        });
        return;
      }

      const parsedCreditCost = Number(data.credit_cost);

      if (!Number.isFinite(parsedCreditCost) || parsedCreditCost <= 0) {
        toast({
          status: "error",
          description: "Please provide a valid credit cost greater than zero",
          variant: "destructive",
        });
        return;
      }

      creditCost = parsedCreditCost;
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
      credit_cost: creditCost,
      ...(unitAmount ? { unit_amount: unitAmount, currency: data.currency } : {}),
      ...(data.required_membership_plan_ids && data.required_membership_plan_ids.length > 0
        ? { required_membership_plan_ids: data.required_membership_plan_ids }
        : {}),
      registration_required: data.registration_required,
    };

    const error = await updateEvent(selectedEvent.id, eventData, user?.Jwt!);

    if (error === null) {
      toast({ status: "success", description: "Event updated successfully" });
      await revalidateEvents();
      const program = programs.find((p) => p.id === data.program_id);
      const location = locations.find((l) => l.id === data.location_id);
      const team = teams.find((t) => t.id === data.team_id);
      const court = courts.find((c) => c.id === data.court_id);
      const nameParts = (user?.Name || " ").split(" ");
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ");
      const updatedEvent: CalendarEvent = {
        ...selectedEvent,
        color: getColorFromProgramType(program?.type),
        start_at: new Date(data.start_at),
        end_at: new Date(data.end_at),
        credit_cost: creditCost,
        unit_amount: unitAmount,
        currency: data.currency || undefined,
        required_membership_plan_ids:
          data.required_membership_plan_ids && data.required_membership_plan_ids.length > 0
            ? data.required_membership_plan_ids
            : undefined,
        program: {
          id: program?.id || "",
          name: program?.name || "",
          type: program?.type || "",
        },
        location: {
          id: location?.id || "",
          name: location?.name || "",
          address: location?.address || "",
        },
        court: court ? { id: court.id, name: court.name } : undefined,
        team: { id: team?.id || "", name: team?.name || "" },
        updatedBy: { id: user?.ID || "", firstName, lastName },
      };
      setEvents(
        events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      );
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Failed to update event: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      {/* Event Details Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Event Details</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Program <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded-md p-2 bg-background"
                value={data.program_id}
                onChange={(e) => setData({ ...data, program_id: e.target.value })}
              >
                <option value="" disabled>
                  Select program
                </option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Team (optional)</label>
              <select
                className="w-full border rounded-md p-2 bg-background"
                value={data.team_id}
                onChange={(e) => setData({ ...data, team_id: e.target.value })}
              >
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Location</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded-md p-2 bg-background"
                value={data.location_id}
                onChange={(e) => {
                  setData({ ...data, location_id: e.target.value, court_id: "" });
                }}
              >
                <option value="" disabled>
                  Select location
                </option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Court (optional)</label>
              <select
                className="w-full border rounded-md p-2 bg-background"
                value={data.court_id}
                onChange={(e) => setData({ ...data, court_id: e.target.value })}
              >
                <option value="">Select Court</option>
                {filteredCourts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Schedule</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Start Time <span className="text-red-500">*</span>
              </label>
              <Input
                value={data.start_at}
                onChange={(e) => setData({ ...data, start_at: e.target.value })}
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
                onChange={(e) => setData({ ...data, end_at: e.target.value })}
                type="datetime-local"
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment & Credits Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Payment & Credits</h3>
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
                    setData((prev) => ({ ...prev, credit_cost: "" }));
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
                  Credit cost
                </Label>
                <Input
                  id="event-credit-cost"
                  type="number"
                  min="1"
                  value={data.credit_cost}
                  onChange={(e) =>
                    setData({ ...data, credit_cost: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="event-price-amount" className="text-sm font-medium">
                Price (optional)
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
                    onChange={(e) => setData({ ...data, price_amount: e.target.value })}
                    className="bg-background pl-7"
                  />
                </div>
                <select
                  className="w-24 border rounded-md p-2 bg-background"
                  value={data.currency}
                  onChange={(e) => setData({ ...data, currency: e.target.value })}
                >
                  <option value="cad">CAD</option>
                  <option value="usd">USD</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Requirements Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Membership Requirements</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="event-required-membership-plan-ids"
                className="text-sm font-medium"
              >
                Required Membership Plans (optional)
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
                          setData({ ...data, required_membership_plan_ids: newIds });
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
                            setData({ ...data, required_membership_plan_ids: newIds });
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
                onCheckedChange={(checked) => setData({ ...data, registration_required: !!checked })}
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

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          onClick={handleUpdate}
          className="bg-green-600 hover:bg-green-700 h-11 px-6"
        >
          <SaveIcon className="h-4 w-4 mr-2" /> Save Event
        </Button>
      </div>
    </div>
  );
}
