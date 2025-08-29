"use client";

import TeamsPage from "@/components/teams/TeamsPage";
import RoleProtected from "@/components/RoleProtected";
import { getUserTeams } from "@/services/teams";
import { StaffRoleEnum } from "@/types/user";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Team } from "@/types/team";

export default function Page() {
  const [teams, setTeams] = useState<Team[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (user?.Jwt) {
          const data = await getUserTeams(user.Jwt);
          setTeams(data);
        }
      } catch (error) {
        console.error("Failed to fetch teams", error);
      }
    };

    fetchTeams();
  }, [user]);

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.COACH]}>
      <div className="flex">
        <TeamsPage teams={teams} />
      </div>
    </RoleProtected>
  );
}
