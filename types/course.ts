export type Course = {
  id: string;
  name: string;
  description?: string;
  schedules?: Schedule[];
};

export type Schedule = {
  startDate: Date;
  endDate: Date;
  days: ScheduleDay[];
  capacity: number;
  name: string;
};

export type ScheduleDay = {
  day: string;
  startTime: string;
  endTime: string;
  location?: string;
  trainer?: string;
};