"use client";

import { Team } from "@/types/team";

export default function TeamInfoPanel({ team }: { team: Team }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{team.name}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted-foreground">Capacity</p>
          <p>{team.capacity}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Coach</p>
          <p>{team.coach_id || "-"}</p>
        </div>
      </div>
      {team.roster && (
        <div>
          <h3 className="text-xl font-semibold mt-4 mb-2">Roster</h3>
          <ul className="list-disc list-inside space-y-1">
            {team.roster.map((member) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
