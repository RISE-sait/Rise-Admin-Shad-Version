import { Program } from "@/types/program";
import { Location } from "@/types/location";

// Mock data for development when API is unavailable
export const mockPrograms: Program[] = [
  {
    id: "1",
    name: "Beginner Soccer Training",
    description: "Basic soccer skills for beginners",
    level: "beginner",
    type: "practice",
    capacity: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Advanced Basketball",
    description: "Advanced basketball techniques",
    level: "advanced",
    type: "practice",
    capacity: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "Summer Soccer Camp",
    description: "Week-long soccer camp for kids",
    level: "all",
    type: "camp",
    capacity: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockLevels: string[] = ["all", "beginner", "intermediate", "advanced"];

export const mockLocations: Location[] = [
  {
    id: "1",
    name: "Main Stadium",
    Address: "123 Main St"
  },
  {
    id: "2",
    name: "Practice Field",
    Address: "456 Sports Ave"
  }
];

export const mockTeams = [
  {
    id: "1",
    name: "Eagles",
    capacity: 15
  },
  {
    id: "2",
    name: "Sharks",
    capacity: 12
  }
];