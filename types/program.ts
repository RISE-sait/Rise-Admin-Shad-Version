export interface Practice {
  id: string;
  name: string;
  description: string;
  level: string;
  type: string; // Added this field: "practice", "course", "game", or others
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}