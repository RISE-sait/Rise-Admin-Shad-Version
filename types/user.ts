export enum StaffRoleEnum {
    INSTRUCTOR,
    ADMIN,
    SUPERADMIN,
    COACH,
    BARBER,
}

export interface User {
    ID : string
    Email: string;
    Name: string;
    Phone: string;
    StaffInfo?: {
        Role: StaffRoleEnum;
        IsActive: boolean;
    };
    Jwt:string,
    CreatedAt: Date,
    UpdatedAt: Date,
}
