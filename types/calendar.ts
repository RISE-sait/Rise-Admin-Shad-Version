// Example matching the mina-scheduler event properties

export interface SchedulerEvent {
    id: string;
    title: string;
    description: string;
    start: Date; // Ensure start is a Date object
    end: Date; // Ensure end is a Date object
    variant: string; // Add variant property
    [key: string]: any; // Allow additional properties
  }
    
    // If you have existing Trainer/Class/Facility types, keep them:
    export interface Trainer {
      id: number
      name: string
      checked: boolean
    }
    
    export interface Class {
      id: number
      name: string
      checked: boolean
    }
    
    export interface Facility {
      id: number
      name: string
      checked: boolean
      warning?: boolean
    }
    
    export type AppointmentsType = "booked" | "non-booked" | "both"
    
    export interface FiltersType {
      trainers: Trainer[]
      classes: Class[]
      appointments: AppointmentsType
      facilities: Facility[]
    }