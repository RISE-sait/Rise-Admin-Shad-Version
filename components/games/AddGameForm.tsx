"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { createGame } from "@/services/games";
import { getAllLocations } from "@/services/location";
import { getAllTeams } from "@/services/teams";
import { getAllCourts } from "@/services/court";
import { Location } from "@/types/location";
import { Team } from "@/types/team";
import { Court } from "@/types/court";
import { revalidateGames } from "@/actions/serverActions";
import { toZonedISOString } from "@/lib/utils";

export default function AddGameForm({ onClose }: { onClose?: () => void }) {
  const { data, updateField, resetData } = useFormData({
    home_team_id: "",
    away_team_id: "",
    location_id: "",
    court_id: "",
    start_time: "",
    end_time: "",
    status: "scheduled" as "scheduled" | "completed" | "canceled",
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

  const handleAddGame = async () => {
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

    const error = await createGame(gameData, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Game created successfully" });
      resetData();
      await revalidateGames();
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Failed to create game: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
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
      <Button onClick={handleAddGame} className="w-full">
        Add Game
      </Button>
    </div>
  );
}
