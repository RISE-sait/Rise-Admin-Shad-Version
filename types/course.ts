export interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  schedules?: Schedule[];
}

export interface Schedule {
  name: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  days: ScheduleDay[];
}

export interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
  location?: string;
  trainer?: string;
}