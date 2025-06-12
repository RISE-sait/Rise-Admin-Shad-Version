import TeamInfoPanel from "@/components/teams/TeamInfoPanel";
import RoleProtected from "@/components/RoleProtected";
import { getTeamById } from "@/services/teams";
import { StaffRoleEnum } from "@/types/user";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const team = await getTeamById(params.id);

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="p-6">
        <TeamInfoPanel team={team} />
      </div>
    </RoleProtected>
  );
}
