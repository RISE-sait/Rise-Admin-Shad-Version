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
  DollarSign,
  Activity,
  Clock,
  MapPin,
  TrendingUp,
  UserPlus,
  Search,
  LogIn,
} from "lucide-react";

// Mock data for demonstration
const stats = {
  upcomingEvents: 8,
  monthlyRevenue: 12450,
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

const recentActivity = [
  {
    id: 1,
    action: "New member registration",
    user: "Sarah Johnson",
    time: "2 minutes ago",
  },
  {
    id: 2,
    action: "Court A booking confirmed",
    user: "Lakers Team",
    time: "15 minutes ago",
  },
  {
    id: 3,
    action: "Equipment maintenance completed",
    user: "System",
    time: "1 hour ago",
  },
  {
    id: 4,
    action: "Monthly membership renewed",
    user: "Mike Chen",
    time: "2 hours ago",
  },
];

export default function DashboardPage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activeMembers, setActiveMembers] = useState(0);
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
    const loadActiveMembers = async () => {
      try {
        const { total } = await getCustomers(undefined, 1, 1);
        setActiveMembers(total);
      } catch (err) {
        console.error("Error loading active members", err);
        setActiveMembers(0);
      }
    };

    loadActiveMembers();
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
            end_at: new Date(p.end_time ?? ""),
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Check-ins
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCheckIns}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.weeklyGrowth}%</span>{" "}
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5</span> new this week
            </p>
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

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {activity.user}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action Items Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Today's To-Do - Now using the separate component */}
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
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => router.push("/manage/games")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule a game
            </Button>
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

        {/* Staff on Duty */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff on Duty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Mike Johnson</span>
              <Badge variant="default">Manager</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sarah Davis</span>
              <Badge variant="secondary">Front Desk</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Alex Chen</span>
              <Badge variant="outline">Maintenance</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
