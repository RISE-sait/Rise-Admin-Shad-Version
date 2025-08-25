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
import { getEvents } from "@/services/events";
import { getAllGames } from "@/services/games";
import { getAllPractices } from "@/services/practices";
import { getCustomers } from "@/services/customer";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { StaffRoleEnum } from "@/types/user";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  MapPin,
  TrendingUp,
  UserPlus,
  BarChart3,
  LogIn,
} from "lucide-react";

// Mock data for demonstration
const stats = {
  todayCheckIns: 47,
  upcomingEvents: 8,
  monthlyRevenue: 12450,
  courtUtilization: 78,
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
      const dateString = format(today, "yyyy-MM-dd");
      try {
        const [eventsData, gamesData, practicesData] = await Promise.all([
          getEvents({
            after: dateString,
            before: dateString,
            location_id: "e2d1cd76-592f-4c06-89ee-9027cfbbe9de",
            response_type: "date",
          }),
          getAllGames(),
          getAllPractices(),
        ]);

        const events = (eventsData as any[])
          .filter(
            (e) => e.location?.id === "e2d1cd76-592f-4c06-89ee-9027cfbbe9de"
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
              g.location_id === "e2d1cd76-592f-4c06-89ee-9027cfbbe9de" &&
              isSameDay(new Date(g.start_time), today)
          )
          .map((g) => ({
            id: g.id,
            title: `${g.home_team_name} vs ${g.away_team_name}`,
            start_at: new Date(g.start_time),
            end_at: new Date(g.end_time),
            location: g.location_name,
            court: g.location_name,
            type: "game",
          }));

        const practices = practicesData
          .filter(
            (p) =>
              p.location_id === "e2d1cd76-592f-4c06-89ee-9027cfbbe9de" &&
              isSameDay(new Date(p.start_at), today)
          )
          .map((p) => ({
            id: p.id,
            title: p.program_name || "Practice",
            start_at: new Date(p.start_at),
            end_at: new Date(p.end_at),
            location: p.location_name,
            court: p.court_name,
            type: "practice",
          }));

        const all = [...events, ...games, ...practices];
        all.sort((a, b) => a.start_at.getTime() - b.start_at.getTime());
        setSchedule(all);
      } catch (err) {
        console.error("Error loading schedule", err);
        setSchedule([]);
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
            <div className="text-2xl font-bold">{stats.todayCheckIns}</div>
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
            <div className="text-2xl font-bold">{stats.courtUtilization}%</div>
            <Progress value={stats.courtUtilization} className="mt-2" />
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
            >
              <LogIn className="h-4 w-4 mr-2" />
              Check someone in
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book a court
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add new member
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View reports
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
