import { ApiInternalDomainsTeamDtoRosterMemberInfo } from "@/app/api/Api";

export type Team = {
  id: string;
  name: string;
  capacity: number;
  coach_id?: string;
  created_at: Date;
  updated_at: Date;
  roster?: ApiInternalDomainsTeamDtoRosterMemberInfo[];
};
