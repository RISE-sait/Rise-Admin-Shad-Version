"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { updateGame, deleteGame } from "@/services/games";
import { getAllLocations } from "@/services/location";
import { getAllTeams } from "@/services/teams";
import { getAllCourts } from "@/services/court";
import { revalidateGames } from "@/actions/serverActions";
import { Game } from "@/types/games";
import { Location } from "@/types/location";
import { Team } from "@/types/team";
import { Court } from "@/types/court";
import {
  toZonedISOString,
  fromZonedISOString,
  toLocalISOString,
} from "@/lib/utils";
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

export default function GameInfoPanel({
  game,
  onClose,
  refreshGames,
}: {
  game: Game;
  onClose?: () => void;
  refreshGames?: () => Promise<void>;
}) {
  const { data, updateField } = useFormData({
    home_team_id: game.home_team_id,
    away_team_id: game.away_team_id,
    location_id: game.location_id,
    court_id: game.court_id || "",
    start_time: toLocalISOString(fromZonedISOString(game.start_time)).slice(
      0,
      16
    ),
    end_time: toLocalISOString(fromZonedISOString(game.end_time)).slice(0, 16),
    status: game.status as "scheduled" | "completed" | "canceled",
  });
  const { user } = useUser();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  const filteredCourts = courts.filter(
    (c) => c.location_id === data.location_id
  );

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [locs, tms, crts] = await Promise.all([
          getAllLocations(),
          getAllTeams(),
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
  }, []);

  const handleSave = async () => {
    if (!data.home_team_id || !data.away_team_id || !data.location_id) {
      toast({
        status: "error",
        description: "Home team, away team and location are required",
        variant: "destructive",
      });
      return;
    }

    if (!data.start_time || !data.end_time) {
      toast({
        status: "error",
        description: "Start and end time are required",
        variant: "destructive",
      });
      return;
    }

    const gameData = {
      home_team_id: data.home_team_id,
      away_team_id: data.away_team_id,
      location_id: data.location_id,
      court_id: data.court_id ? data.court_id : null,
      start_time: toZonedISOString(new Date(data.start_time)),
      end_time: toZonedISOString(new Date(data.end_time)),
      status: data.status,
    };

    const error = await updateGame(game.id, gameData, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Game updated successfully" });
      await revalidateGames();
      if (refreshGames) await refreshGames();
      onClose?.();
    } else {
      toast({
        status: "error",
        description: `Error saving changes: ${error}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    const error = await deleteGame(game.id, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Game deleted successfully" });
      await revalidateGames();
      if (refreshGames) await refreshGames();
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Error deleting game: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Home Team</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.home_team_id}
            onChange={(e) => updateField("home_team_id", e.target.value)}
          >
            <option value="" disabled>
              Select team
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Away Team</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.away_team_id}
            onChange={(e) => updateField("away_team_id", e.target.value)}
          >
            <option value="" disabled>
              Select team
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.location_id}
            onChange={(e) => {
              updateField("location_id", e.target.value);
              updateField("court_id", "");
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
            className="w-full border rounded-md p-2"
            value={data.court_id}
            onChange={(e) => updateField("court_id", e.target.value)}
          >
            <option value="">Select court</option>
            {filteredCourts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Time</label>
          <Input
            value={data.start_time}
            onChange={(e) => updateField("start_time", e.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End Time</label>
          <Input
            value={data.end_time}
            onChange={(e) => updateField("end_time", e.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value as "scheduled" | "completed" | "canceled"
              )
            }
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this game? This action cannot be
                undone.
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
  );
}
