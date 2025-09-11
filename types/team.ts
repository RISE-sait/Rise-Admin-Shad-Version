import { ApiInternalDomainsTeamDtoRosterMemberInfo } from "@/app/api/Api";

export type Team = {
  id: string;
  name: string;
  capacity: number;
  coach_id?: string;
  coach_name?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
  roster?: ApiInternalDomainsTeamDtoRosterMemberInfo[];
};
