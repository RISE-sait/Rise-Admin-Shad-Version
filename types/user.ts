type StaffRole = 'INSTRUCTOR' | 'ADMIN' | 'SUPERADMIN' | 'INSTRUCTOR' | 'COACH'

export interface User {
    Email: string;
    Name: string;
    StaffInfo: {
        Role: StaffRole;
        IsActive: boolean;
    };
    Jwt:string
}
