interface BaseUser {
  ID: string;
  Email?: string;
  Name: string;
  Phone?: string;
  PhotoUrl?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface User extends BaseUser {
  StaffInfo?: {
    Role: StaffRoleEnum;
    IsActive: boolean;
  };
}

export interface LoggedInUser {
  ID: string;
  Email: string;
  Name: string;
  Phone: string;
  PhotoUrl?: string;
  Role: StaffRoleEnum;
  IsActive: boolean;
  Jwt: string;
  Dob: string;
  CountryAlpha2Code: string;
  StaffInfo?: {
    Role: StaffRoleEnum;
    IsActive: boolean;
  };
}

export enum StaffRoleEnum {
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
  IT = "IT",
  COACH = "COACH",
  BARBER = "BARBER",
  RECEPTIONIST = "RECEPTIONIST",
}

export type StaffRole = keyof typeof StaffRoleEnum;

export interface PendingStaff {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}
