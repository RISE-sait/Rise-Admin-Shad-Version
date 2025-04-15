export enum StaffRoleEnum {
    INSTRUCTOR,
    ADMIN,
    SUPERADMIN,
    COACH,
    BARBER,
    RECEPTIONIST,
}

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
    }
}

export interface LoggedInUser {
    ID : string
    Email: string;
    Name: string;
    Phone: string;
    Role: StaffRoleEnum;
    IsActive: boolean;
    Jwt:string
}
