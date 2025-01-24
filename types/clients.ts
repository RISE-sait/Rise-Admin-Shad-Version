// app/types/client.ts

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    membership: string;
    accountType: string;
    profilePicture: string;
    classes?: ClassItem[];
    membershipTab?: MembershipDetails;
    detailsTab?: ClientDetails;
  }
  
  export interface ClassItem {
    date: string;
    time: string;
    classTitle: string;
    facility: string;
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
  