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
import { revalidateGames } from "@/actions/serverActions";
import { Game } from "@/types/games";
import { Location } from "@/types/location";
import { Team } from "@/types/team";
import { toZonedISOString, fromZonedISOString } from "@/lib/utils";

export default function GameInfoPanel({
  game,
  onClose,
}: {
  game: Game;
  onClose?: () => void;
}) {
  const { data, updateField } = useFormData({
    home_team_id: game.home_team_id,
    away_team_id: game.away_team_id,
    location_id: game.location_id,
    start_time: fromZonedISOString(game.start_time).toISOString().slice(0, 16),
    end_time: fromZonedISOString(game.end_time).toISOString().slice(0, 16),
    status: game.status as "scheduled" | "completed" | "canceled",
  });
  const { user } = useUser();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [locs, tms] = await Promise.all([
          getAllLocations(),
          getAllTeams(),
        ]);
        setLocations(locs);
        setTeams(tms);
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
      start_time: toZonedISOString(new Date(data.start_time)),
      end_time: toZonedISOString(new Date(data.end_time)),
      status: data.status,
    };

    const error = await updateGame(game.id, gameData, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Game updated successfully" });
      await revalidateGames();
    } else {
      toast({
        status: "error",
        description: `Error saving changes: ${error}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    const error = await deleteGame(game.id, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Game deleted successfully" });
      await revalidateGames();
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
            onChange={(e) => updateField("location_id", e.target.value)}
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
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
          onClick={handleDelete}
        >
          <TrashIcon className="h-4 w-4 mr-2" /> Delete
        </Button>
      </div>
    </div>
  );
}
