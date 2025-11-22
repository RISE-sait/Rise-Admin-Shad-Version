"use client";

// Drawer panel used to view and edit an existing practice.

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveIcon, TrashIcon, Dumbbell, Calendar } from "lucide-react";
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
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { updatePractice, deletePractice } from "@/services/practices";
import { PracticeRequestDto } from "@/types/practice";
import { getAllLocations } from "@/services/location";
import { getUserTeams } from "@/services/teams";
import { getAllCourts } from "@/services/court";
import { revalidatePractices } from "@/actions/serverActions";
import { Practice } from "@/types/practice";
import { Location } from "@/types/location";
import { Team } from "@/types/team";
import { Court } from "@/types/court";
import {
  toZonedISOString,
  fromZonedISOString,
  toLocalISOString,
} from "@/lib/utils";
import { StaffRoleEnum } from "@/types/user";

export default function PracticeInfoPanel({
  practice,
  onClose,
  onUpdated,
  onDeleted,
}: {
  practice: Practice;
  onClose?: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}) {
  const { user } = useUser();
  const { toast } = useToast();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;
  const { data, updateField } = useFormData({
    team_id: practice.team_id || "",
    location_id: practice.location_id || "",
    court_id: practice.court_id || "",
    start_at: toLocalISOString(fromZonedISOString(practice.start_at)).slice(
      0,
      16
    ),
    end_at: toLocalISOString(fromZonedISOString(practice.end_at)).slice(0, 16),
    capacity: practice.capacity,
    status: practice.status as "scheduled" | "completed" | "canceled",
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  const filteredCourts = courts.filter(
    (c) => c.location_id === data.location_id
  );

  useEffect(() => {
    if (!user?.Jwt) return;
    // Load dropdown options for editing the practice
    const fetchLists = async () => {
      try {
        const [locs, tms, crts] = await Promise.all([
          getAllLocations(),
          getUserTeams(user.Jwt),
          getAllCourts(),
        ]);
        setLocations(locs);
        setTeams(tms);
        setCourts(crts);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };

    fetchLists();
  }, [user?.Jwt]);

  // Persist any changes made to the practice
  const handleSave = async () => {
    if (!data.team_id || !data.location_id) {
      toast({
        status: "error",
        description: "Team and location are required",
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

    const practiceData: PracticeRequestDto = {
      court_id: data.court_id || undefined,
      location_id: data.location_id,
      team_id: data.team_id,
      start_time: toZonedISOString(new Date(data.start_at)),
      end_time: toZonedISOString(new Date(data.end_at)),
      status: data.status,
      booked_by: practice.booked_by,
    };

    const error = await updatePractice(practice.id, practiceData, user?.Jwt!);
    if (error === null) {
      toast({
        status: "success",
        description: "Practice updated successfully",
      });
      await revalidatePractices();
      if (onUpdated) onUpdated();
      onClose?.();
    } else {
      toast({
        status: "error",
        description: `Error saving changes: ${error}`,
        variant: "destructive",
      });
    }
  };

  // Remove the practice entirely from the system
  const handleDelete = async () => {
    const error = await deletePractice(practice.id, user?.Jwt!);
    if (error === null) {
      toast({
        status: "success",
        description: "Practice deleted successfully",
      });
      await revalidatePractices();
      if (onDeleted) onDeleted();
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Error deleting practice: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      {practice.booked_by_name && (
        <p className="text-sm text-muted-foreground">
          Booked By: {practice.booked_by_name}
        </p>
      )}

      {/* Practice Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Practice Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Team <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.team_id}
                onValueChange={(value) => updateField("team_id", value)}
                disabled={isReceptionist}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                disabled={isReceptionist}
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
              <label className="text-sm font-medium">Court</label>
              <Select
                value={data.court_id}
                onValueChange={(value) => updateField("court_id", value)}
                disabled={isReceptionist}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select court (optional)" />
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
            <Calendar className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Schedule</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Start Time <span className="text-red-500">*</span>
              </label>
              <Input
                value={data.start_at}
                onChange={(e) => updateField("start_at", e.target.value)}
                type="datetime-local"
                className="bg-background"
                disabled={isReceptionist}
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
                disabled={isReceptionist}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={data.status}
                onValueChange={(value) =>
                  updateField(
                    "status",
                    value as "scheduled" | "completed" | "canceled"
                  )
                }
                disabled={isReceptionist}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {!isReceptionist && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Practice
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this practice? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={handleSave}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
