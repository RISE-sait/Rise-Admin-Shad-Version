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
import { StaffRoleEnum } from "@/types/user";

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

  const isCoach = user?.Role === StaffRoleEnum.COACH;

  // Filter teams into coach's teams and other teams
  const coachTeams = teams.filter((t) => t.coach_id === user?.ID);
  const otherTeams = teams.filter((t) => t.coach_id !== user?.ID);

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

    // Coaches must have at least one of their own teams in the game
    if (user?.Role === StaffRoleEnum.COACH) {
      const homeTeam = teams.find((t) => t.id === data.home_team_id);
      const awayTeam = teams.find((t) => t.id === data.away_team_id);

      const isHomeTeamCoach = homeTeam?.coach_id === user?.ID;
      const isAwayTeamCoach = awayTeam?.coach_id === user?.ID;

      if (!isHomeTeamCoach && !isAwayTeamCoach) {
        toast({
          status: "error",
          description: "You must select at least one of your own teams to create a game",
          variant: "destructive",
        });
        return;
      }
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
            {isCoach && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-2">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Select one of your teams first, then choose the opponent
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isCoach ? "Your Team" : "Home Team"} <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.home_team_id}
                onValueChange={(value) => updateField("home_team_id", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={isCoach ? "Select your team" : "Select home team"} />
                </SelectTrigger>
                <SelectContent>
                  {isCoach ? (
                    <>
                      {coachTeams.length > 0 ? (
                        coachTeams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No teams assigned to you
                        </div>
                      )}
                    </>
                  ) : (
                    teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isCoach ? "Opponent Team" : "Away Team"} <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.away_team_id}
                onValueChange={(value) => updateField("away_team_id", value)}
                disabled={isCoach && !data.home_team_id}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={isCoach && !data.home_team_id ? "Select your team first" : isCoach ? "Select opponent" : "Select away team"} />
                </SelectTrigger>
                <SelectContent>
                  {isCoach ? (
                    <>
                      {coachTeams.filter(t => t.id !== data.home_team_id).length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Your Teams
                          </div>
                          {coachTeams
                            .filter((t) => t.id !== data.home_team_id)
                            .map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                        </>
                      )}
                      {otherTeams.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Other Teams
                          </div>
                          {otherTeams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))
                  )}
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