interface BaseUser {
  ID: string;
  Email?: string;
  Name: string;
  Phone?: string;
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
  Role: StaffRoleEnum;
  IsActive: boolean;
  Jwt: string;
}

export enum StaffRoleEnum {
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
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
