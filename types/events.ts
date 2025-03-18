export interface EventRequestDto {
    /** @example "00000000-0000-0000-0000-000000000000" */
    course_id?: string;
    /** @example "THURSDAY" */
    day: string;
    /** @example "2023-10-05T07:00:00Z" */
    event_end_at: string;
    /** @example "2023-10-05T07:00:00Z" */
    event_start_at: string;
    /** @example "00000000-0000-0000-0000-000000000000" */
    game_id?: string;
    /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
    location_id?: string;
    /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
    practice_id?: string;
    /** @example "23:00:00+00:00" */
    session_end_time: string;
    /** @example "23:00:00+00:00" */
    session_start_time: string;
  }
  
  export interface EventResponseDto {
    course_id?: string;
    day?: string;
    event_end_at?: string;
    event_start_at?: string;
    game_id?: string;
    id?: string;
    location_id?: string;
    practice_id?: string;
    session_end_at?: string;
    session_start_at?: string;
  }
  
  export interface EventStaffEventStaffBase {
    event_id?: string;
    staff_id?: string;
  }
  
  export interface EventStaffRequestDto {
    base?: EventStaffEventStaffBase;
  }