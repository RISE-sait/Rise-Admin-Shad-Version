export interface Event {
  id: string;
  program?: {
    id: string;
    name: string;
    type: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
  };
  team?: {
    id: string;
    name: string;
  };
  capacity: number;
  created_by: Person;
  updated_by: Person;
  start_at: string;
  end_at: string;
}

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
}