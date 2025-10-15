"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveIcon, TrashIcon, Users, MapPin, Clock, Trophy, Flag } from "lucide-react";
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
    home_score:
      game.home_score !== null && game.home_score !== undefined
        ? String(game.home_score)
        : "",
    away_score:
      game.away_score !== null && game.away_score !== undefined
        ? String(game.away_score)
        : "",
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
      home_score: data.home_score === "" ? null : Number(data.home_score),
      away_score: data.away_score === "" ? null : Number(data.away_score),
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

  const getStatusBadge = () => {
    switch (data.status) {
      case "scheduled":
        return <Badge className="bg-yellow-500 text-black">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "canceled":
        return <Badge className="bg-red-600">Canceled</Badge>;
      default:
        return <Badge variant="secondary">{data.status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Current Status:</span>
        </div>
        {getStatusBadge()}
      </div>

      <Separator />

      {/* Teams Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Teams & Scores</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Home Team
              </label>
              <Select
                value={data.home_team_id}
                onValueChange={(value) => updateField("home_team_id", value)}
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
              <label className="text-sm font-medium text-muted-foreground">
                Home Score
              </label>
              <Input
                value={data.home_score}
                onChange={(e) => updateField("home_score", e.target.value)}
                type="number"
                placeholder="0"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Away Team
              </label>
              <Select
                value={data.away_team_id}
                onValueChange={(value) => updateField("away_team_id", value)}
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
              <label className="text-sm font-medium text-muted-foreground">
                Away Score
              </label>
              <Input
                value={data.away_score}
                onChange={(e) => updateField("away_score", e.target.value)}
                type="number"
                placeholder="0"
                className="bg-background"
              />
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
              <label className="text-sm font-medium">Location</label>
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
              <label className="text-sm font-medium">Start Time</label>
              <Input
                value={data.start_time}
                onChange={(e) => updateField("start_time", e.target.value)}
                type="datetime-local"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
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

      {/* Game Status Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Game Status</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Update Status</label>
            <Select
              value={data.status}
              onValueChange={(value) =>
                updateField(
                  "status",
                  value as "scheduled" | "completed" | "canceled"
                )
              }
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
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" /> Delete Game
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
          className="bg-yellow-500 text-black hover:bg-yellow-600 h-11 px-6"
        >
          <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
}