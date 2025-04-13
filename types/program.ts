export interface Practice {
  id: string;
  name: string;
  description: string;
  level: string;
  type: string;
  capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramRequestDto {
  name: string;
  description: string;
  level: string;
  type: string;
  capacity?: number; // Make capacity optional to match API
}

export type PracticeRequestDto = ProgramRequestDto;