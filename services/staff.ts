
import { StaffRequestDto, StaffResponseDto } from '@/app/api/Api';
import { StaffRole, User } from '@/types/user';
import getValue from '@/configs/constants';
import { addAuthHeader } from '@/lib/auth-header';

export async function getAllStaffs(): Promise<User[]> {
    try {
        const response = await fetch(`${getValue('API')}staffs`)

        const responseJson = await response.json();

        if (!response.ok) {

            let errorMessage = `Failed to get staffs: ${response.statusText}`;

            if (responseJson.error) {
                errorMessage = responseJson.error.message;
            }

            console.error(`Failed to fetch staffs: ${errorMessage}`);
            throw new Error(`Failed to fetch staffs: ${errorMessage}`);
        }

        const staffsResponse = responseJson as StaffResponseDto[]

        const staffs: User[] = staffsResponse.map((staff) => ({
            ID: staff.id!,
            Email: staff.email!,
            Name: staff.first_name! + ' ' + staff.last_name!,
            Phone: staff.phone!,
            StaffInfo: {
                IsActive: staff.is_active!,
                Role: staff.role_name as StaffRole,
            },
            Jwt: ""
        }));

        return staffs;
    } catch (error) {
        throw new Error(`Failed to fetch staffs: ${error}`);
    }
}

export async function createStaff(locationData: StaffRequestDto, jwt: string): Promise<string | null> {
    try {
        const response = await fetch(`${getValue('API')}staffs`, {
            method: 'POST',
            ...addAuthHeader(jwt),
            body: JSON.stringify(locationData)
        });

        if (!response.ok) {
            const responseJSON = await response.json();
            let errorMessage = `Failed to create staff: ${response.statusText}`;

            if (responseJSON.error) {
                errorMessage = responseJSON.error.message;
            }

            return errorMessage;
        }

        return null;
    } catch (error) {
        console.error('Error creating staff:', error);
        return error instanceof Error ? error.message : 'Unknown error occurred';
    }
}