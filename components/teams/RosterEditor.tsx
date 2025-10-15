"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { getCustomers } from "@/services/customer";
import { addAthleteToTeam, removeAthleteFromTeam } from "@/services/athletes";
import { revalidateTeams } from "@/actions/serverActions";
import { Team } from "@/types/team";
import { Customer } from "@/types/customer";
import { SaveIcon } from "lucide-react";

// Main component to edit a team's roster
export default function RosterEditor({
  team,
  onClose,
  onRosterChange,
}: {
  team: Team;
  onClose: () => void;
  onRosterChange?: (members: Team["roster"]) => void;
}) {
  const { toast } = useToast(); // Initialize toast notifications
  const { user } = useUser(); // Get current user (for auth)
  const [athletes, setAthletes] = useState<Customer[]>([]); // List of fetched customers
  const [members, setMembers] = useState(team.roster || []); // Current team members
  const [searchQuery, setSearchQuery] = useState(""); // Search input value

  // Fetch athletes whenever search query changes
  useEffect(() => {
    async function fetchAthletes() {
      try {
        const { customers } = await getCustomers(
          searchQuery || undefined, // Pass undefined if query is empty
          1, // Page number
          20 // Page size limit
        );
        setAthletes(customers); // Store fetched customers
      } catch (err) {
        // Show error toast if fetch fails
        toast({
          status: "error",
          description: "Failed to load athletes",
          variant: "destructive",
        });
      }
    }
    fetchAthletes();
  }, [searchQuery, toast]);

  // Lowercase version for case-insensitive filtering
  const searchLower = searchQuery.toLowerCase();

  // Filter out athletes already on the team and those not matching the search
  const availableAthletes = athletes
    .filter((a) => !members.some((m) => m.id === a.id))
    .filter((a) =>
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchLower)
    );

  // Check if team has reached its capacity
  const isFull = members.length >= team.capacity;

  // Handler to add an athlete to the team
  const handleAdd = async (athleteId: string) => {
    if (isFull) {
      // Prevent adding if full
      toast({
        status: "error",
        description: "Team is at full capacity",
        variant: "destructive",
      });
      return;
    }
    // Call service to add athlete
    const error = await addAthleteToTeam(athleteId, team.id, user?.Jwt!);
    if (error === null) {
      // On success, update local state
      const athlete = athletes.find((a) => a.id === athleteId);
      if (athlete) {
        setMembers([
          ...members,
          {
            id: athlete.id,
            name: `${athlete.first_name} ${athlete.last_name}`,
          },
        ]);
      }
      toast({ status: "success", description: "Athlete added" });
    } else {
      // Show error if service returns one
      toast({ status: "error", description: error, variant: "destructive" });
    }
  };

  // Handler to remove an athlete from the team
  const handleRemove = async (athleteId: string) => {
    // Call service to remove athlete
    const error = await removeAthleteFromTeam(athleteId, user?.Jwt!);
    if (error === null) {
      // Update local state on success
      setMembers(members.filter((m) => m.id !== athleteId));
      toast({ status: "success", description: "Athlete removed" });
    } else {
      // Show error if removal fails
      toast({ status: "error", description: error, variant: "destructive" });
    }
  };

  // Handler for closing the editor: revalidate and call onClose prop
  const handleClose = async () => {
    onRosterChange?.(members); // Notify parent of roster change first
    await revalidateTeams(); // Refresh server data
    onClose(); // Close the editor
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <h3 className="text-lg font-semibold">Edit Roster</h3>

      {/* Section for adding athletes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Add Athlete</label>
        <Input
          placeholder="Search athletes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search state
          className="w-full"
        />
        <ul className="border rounded-md max-h-64 overflow-auto divide-y mt-2">
          {availableAthletes.map((ath) => (
            <li key={ath.id} className="flex items-center justify-between p-2">
              <span>
                {/* Display athlete name */}
                {ath.first_name} {ath.last_name}
              </span>
              <Button
                size="sm"
                onClick={() => handleAdd(ath.id!)} // Add on click
                disabled={isFull} // Disable if full
              >
                Add
              </Button>
            </li>
          ))}
          {availableAthletes.length === 0 && (
            <li className="p-2 text-muted-foreground">No athletes found.</li>
          )}
        </ul>
        {isFull && (
          // Warning when team is full
          <p className="text-sm text-destructive">Team is at full capacity.</p>
        )}
      </div>

      {/* Section listing current members */}
      {members.length > 0 && (
        <div className="space-y-2">
          <Separator className="my-2" />
          <h4 className="font-medium">Current Members</h4>
          <ul className="border rounded-md divide-y">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between p-2">
                <span>{m.name}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(m.id!)} // Remove on click
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer with Done button */}
      <Separator className="my-2" />
      <div className="flex justify-end">
        <Button
          onClick={handleClose}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" /> Save
        </Button>
      </div>
    </div>
  );
}