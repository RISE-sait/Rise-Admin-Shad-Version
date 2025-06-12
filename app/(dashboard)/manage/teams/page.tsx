import TeamsPage from "@/components/teams/TeamsPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllTeams } from "@/services/teams";
import { StaffRoleEnum } from "@/types/user";

export default async function Page() {
  const teams = await getAllTeams();

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="flex">
        <TeamsPage teams={teams} />
      </div>
    </RoleProtected>
  );
}
