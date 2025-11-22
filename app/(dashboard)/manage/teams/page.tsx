"use client";

import TeamsPage from "@/components/teams/TeamsPage";
import RoleProtected from "@/components/RoleProtected";
import { getUserTeams, getAllTeams, getAllExternalTeams } from "@/services/teams";
import { StaffRoleEnum } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Team } from "@/types/team";

export default function Page() {
  const [teams, setTeams] = useState<Team[]>([]);
  const { user } = useUser();

  const fetchTeams = useCallback(async () => {
    try {
      // Receptionists use the non-secure endpoint to see all teams
      if (user?.Role === StaffRoleEnum.RECEPTIONIST) {
        const allTeams = await getAllTeams();
        setTeams(allTeams);
      } else if (user?.Jwt) {
        // Coaches need to fetch both their regular teams and external teams
        if (user?.Role === StaffRoleEnum.COACH) {
          const [regularTeams, externalTeams] = await Promise.all([
            getUserTeams(user.Jwt),
            getAllExternalTeams(user.Jwt)
          ]);
          setTeams([...regularTeams, ...externalTeams]);
        } else {
          // Admins use the secure endpoint
          const allTeams = await getUserTeams(user.Jwt);
          setTeams(allTeams);
        }
      }
    } catch (error) {
      console.error("Failed to fetch teams", error);
    }
  }, [user]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.COACH, StaffRoleEnum.RECEPTIONIST]}>
      <div className="flex">
        <TeamsPage teams={teams} refreshTeams={fetchTeams} />
      </div>
    </RoleProtected>
  );
}