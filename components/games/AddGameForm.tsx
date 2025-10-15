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
import { Calendar, MapPin, Clock, Users } from "lucide-react";
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

export default function AddGameForm({
  onClose,
  refreshGames,
}: {
  onClose?: () => void;
  refreshGames?: () => Promise<void>;
}) {
  const { data, updateField, resetData } = useFormData({
    home_team_id: "",
    away_team_id: "",
    location_id: "",
    court_id: "",
    start_time: "",
    end_time: "",
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
      status: "scheduled" as const,
    };

    const error = await createGame(gameData, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Game created successfully" });
      resetData();
      await revalidateGames();
      if (refreshGames) await refreshGames();
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
      {/* Teams Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Teams</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Home Team <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.home_team_id}
                onValueChange={(value) => updateField("home_team_id", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select home team" />
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
                Away Team <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.away_team_id}
                onValueChange={(value) => updateField("away_team_id", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select away team" />
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
                  <SelectValue placeholder={!data.location_id ? "Select location first" : filteredCourts.length === 0 ? "No courts available" : "Select court"} />
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
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Start Time <span className="text-red-500">*</span>
              </label>
              <Input
                value={data.start_time}
                onChange={(e) => updateField("start_time", e.target.value)}
                type="datetime-local"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                End Time <span className="text-red-500">*</span>
              </label>
              <Input
                value={data.end_time}
                onChange={(e) => updateField("end_time", e.target.value)}
                type="datetime-local"
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddGame}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Create Game
        </Button>
      </div>
    </div>
  );
}