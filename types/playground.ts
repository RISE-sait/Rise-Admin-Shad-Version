// types/playground.ts
// Data models for playground systems and sessions

export interface PlaygroundSystem {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface PlaygroundSession {
  id: string;
  system_id: string;
  system_name: string;
  customer_id: string;
  customer_first_name: string;
  customer_last_name: string;
  start_time: Date;
  end_time: Date;
  created_at: Date;
  updated_at: Date;
}

// DTO sent when creating or updating a system
export interface PlaygroundSystemRequestDto {
  name: string;
}

// DTO sent when creating or updating a session
export interface PlaygroundSessionRequestDto {
  system_id: string;
  start_time: string;
  end_time: string;
}
