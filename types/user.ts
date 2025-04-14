export type StaffRole = 'INSTRUCTOR' | 'ADMIN' | 'SUPERADMIN' | 'INSTRUCTOR' | 'COACH' | 'BARBER';

export interface User {
    ID : string
    Email: string;
    Name: string;
    Phone: string;
    StaffInfo?: {
        Role: StaffRole;
        IsActive: boolean;
    };
    Jwt:string,
    CreatedAt: Date,
    UpdatedAt: Date,
}
