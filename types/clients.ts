// app/types/client.ts

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
    membershipTab?: MembershipDetails;
    detailsTab?: ClientDetails;
  }
  
  export interface MembershipDetails {
    joinDate: string;
    renewalDate: string;
    status: string;
    benefits: string[];
  }
  
  export interface ClientDetails {
    preferences: string[];
    emergencyContact: EmergencyContact;
  }
  
  export interface EmergencyContact {
    name: string;
    relation: string;
    phone: string;
  }
  