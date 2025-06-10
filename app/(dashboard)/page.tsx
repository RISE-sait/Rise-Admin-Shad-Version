import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/Heading";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <Heading title="Dashboard" description="Overview of recent activity" />
      <Separator />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Check Ins</CardTitle>
            <CardDescription>People checked in today</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Registrations</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Programs</CardTitle>
            <CardDescription>Currently running</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Events happening soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No events scheduled.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
