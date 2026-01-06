"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TodoList } from "@/components/todo-list";
import SuspendedCustomersCard from "@/components/dashboard/SuspendedCustomersCard";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { getSchedule } from "@/services/schedule";
import { getCustomers } from "@/services/customer";
import { getAllCourts } from "@/services/court";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { StaffRoleEnum } from "@/types/user";
import { countTodayLogs } from "@/utils/checkinLogs";
import {
  Users,
  Calendar,
  Activity,
  Clock,
  MapPin,
  UserPlus,
  Search,
  LogIn,
} from "lucide-react";

// Mock data for demonstration
const stats = {
  upcomingEvents: 8,
  weeklyGrowth: 12,
};

interface ScheduleItem {
  id: string;
  title: string;
  start_at: Date;
  end_at: Date;
  location: string;
  court?: string;
  type: string;
}

export default function DashboardPage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activeMemberships, setActiveMemberships] = useState(0);
  const [todayCheckIns, setTodayCheckIns] = useState(0);
  const [courtUtilization, setCourtUtilization] = useState(0);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.Role === StaffRoleEnum.COACH) {
      router.replace("/calendar");
    }
  }, [user, router]);

  useEffect(() => {
    const loadActiveMemberships = async () => {
      try {
        // First get total count
        const { total } = await getCustomers(undefined, 1, 1);
        if (total === 0) {
          setActiveMemberships(0);
          return;
        }

        // Fetch all customers in parallel batches
        const limit = 20;
        const pages = Math.ceil(total / limit);
        const requests = Array.from({ length: pages }, (_, i) =>
          getCustomers(undefined, i + 1, limit)
        );
        const results = await Promise.all(requests);
        const allCustomersRaw = results.flatMap((r) => r.customers);

        // Deduplicate customers by ID
        const seenIds = new Set<string>();
        const allCustomers = allCustomersRaw.filter((c) => {
          if (seenIds.has(c.id)) return false;
          seenIds.add(c.id);
          return true;
        });

        // Count customers with active memberships (renewal date >= today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const customersWithActiveMemberships = allCustomers.filter((customer) => {
          // Check if customer has any active membership
          if (customer.memberships && customer.memberships.length > 0) {
            return customer.memberships.some((m) => {
              // Must have both a plan ID and a valid renewal date
              if (!m.membership_plan_id || !m.membership_renewal_date) return false;
              const renewalDate = new Date(m.membership_renewal_date);
              return renewalDate >= today;
            });
          }
          // Fallback to single membership field - must have plan ID
          if (customer.membership_plan_id && customer.membership_renewal_date) {
            const renewalDate = new Date(customer.membership_renewal_date);
            return renewalDate >= today;
          }
          return false;
        });

        const activeCount = customersWithActiveMemberships.length;

        setActiveMemberships(activeCount);
      } catch (err) {
        console.error("Error loading active memberships", err);
        setActiveMemberships(0);
      }
    };

    loadActiveMemberships();
  }, []);

  useEffect(() => {
    const loadSchedule = async () => {
      const today = new Date();
      try {
        const [scheduleData, courts] = await Promise.all([
          getSchedule(),
          getAllCourts(),
        ]);

        const locationIds = new Set(courts.map((c) => c.location_id));
        const {
          events: eventsData,
          games: gamesData,
          practices: practicesData,
        } = scheduleData;

        const events = eventsData
          .filter(
            (e) =>
              e.location?.id &&
              locationIds.has(e.location.id) &&
              isSameDay(new Date(e.start_at as string), today)
          )
          .map((e) => ({
            id: e.id as string,
            title: e.program?.name ?? "Event",
            start_at: new Date(e.start_at as string),
            end_at: new Date(e.end_at as string),
            location: e.location?.name ?? "",
            court: e.location?.name ?? "",
            type: e.program?.type ?? "event",
          }));

        const games = gamesData
          .filter(
            (g) =>
              locationIds.has(g.location_id) &&
              isSameDay(new Date(g.start_time), today)
          )
          .map((g) => ({
            id: g.id!,
            title: `${g.home_team_name} vs ${g.away_team_name}`,
            start_at: new Date(g.start_time),
            end_at: new Date(g.end_time),
            location: g.location_name!,
            court: g.location_name!,
            type: "game",
          }));

        const practices = practicesData
          .filter(
            (p) =>
              locationIds.has(p.location_id) &&
              isSameDay(new Date(p.start_time), today)
          )
          .map((p) => ({
            id: p.id,
            title: p.team_name || "Practice",
            start_at: new Date(p.start_time),
            end_at: new Date(p.end_time ?? p.start_time),
            location: p.location_name ?? "",
            court: p.court_name,
            type: "practice",
          }));

        const all = [...events, ...games, ...practices];
        all.sort((a, b) => a.start_at.getTime() - b.start_at.getTime());
        setSchedule(all);

        const openHour = 9;
        const closeHour = 23;
        const availableMinutes = courts.length * (closeHour - openHour) * 60;

        if (availableMinutes > 0) {
          const openTime = new Date(today);
          openTime.setHours(openHour, 0, 0, 0);
          const closeTime = new Date(today);
          closeTime.setHours(closeHour, 0, 0, 0);

          const usedMinutes = all.reduce((total, item) => {
            const start = item.start_at < openTime ? openTime : item.start_at;
            const rawEnd =
              item.end_at && !isNaN(item.end_at.getTime())
                ? item.end_at
                : item.start_at;
            const end = rawEnd > closeTime ? closeTime : rawEnd;
            const diff = (end.getTime() - start.getTime()) / 60000;
            return total + Math.max(0, diff);
          }, 0);

          setCourtUtilization(
            Math.min(100, Math.round((usedMinutes / availableMinutes) * 100))
          );
        } else {
          setCourtUtilization(0);
        }
      } catch (err) {
        console.error("Error loading schedule", err);
        setSchedule([]);
        setCourtUtilization(0);
      }
    };

    loadSchedule();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your facility today.
        </p>
      </div>

      <Separator />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Check-ins
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCheckIns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Memberships
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMemberships}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Court Utilization
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courtUtilization}%</div>
            <Progress value={courtUtilization} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Upcoming Events */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Upcoming events and bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedule.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No events scheduled for today.
              </p>
            )}
            {schedule.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge
                      variant={
                        event.type === "game"
                          ? "default"
                          : event.type === "practice"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {`${format(event.start_at, "p")} - ${format(event.end_at, "p")}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                    {event.court && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.court}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <TodoList />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => router.push("/manage/checkin")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Check someone in
              </Button>
              {user?.Role !== StaffRoleEnum.RECEPTIONIST && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => router.push("/manage/games")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule a game
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => router.push("/manage/customers")}
              >
                <Search className="h-4 w-4 mr-2" />
                Search a customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Suspended Customers Section */}
      <div className="mt-4">
        <SuspendedCustomersCard />
      </div>
    </div>
  );
}
