import { Course } from "./course";

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    membership: string;
    accountType: string;
    profilePicture: string;
    classes?: Course[]
    emergencyContact?: EmergencyContact;
  }
  
  export interface MembershipDetails {
    joinDate: string;
    renewalDate: string;
    status: string;
    benefits: string[];
  }
  
  export interface EmergencyContact {
    name: string;
    relation: string;
    phone: string;
  }
  