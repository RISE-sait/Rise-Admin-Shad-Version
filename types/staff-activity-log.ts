export interface StaffActivityLog {
  id: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  description: string;
  createdAt: string;
}

export interface StaffActivityLogsResult {
  logs: StaffActivityLog[];
  total: number;
}

export interface StaffActivityLogsParams {
  staffId?: string;
  searchDescription?: string;
  limit?: number;
  offset?: number;
}
