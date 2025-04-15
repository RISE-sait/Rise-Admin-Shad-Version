import { StaffRequestDto, StaffResponseDto } from '@/app/api/Api';
import { User } from '@/types/user';
import getValue, { ROLE_MAPPING } from '@/configs/constants';
import { addAuthHeader } from '@/lib/auth-header';
import { UNDERSCORE_NOT_FOUND_ROUTE } from 'next/dist/shared/lib/constants';

export async function getAllStaffs(roleFilter?: string): Promise<User[]> {
    try {

        const url = roleFilter
            ? `${getValue('API')}staffs?role=${roleFilter}`
            : `${getValue('API')}staffs`;

        const response = await fetch(url)

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

        const staffs: User[] = staffsResponse.map(responseStaff => {

            const roleKey = responseStaff.role_name?.toUpperCase();
            const role = roleKey ? ROLE_MAPPING[roleKey] : undefined;

            // must use undefined instead of !role since !role will be false for falsy values like 0.
            if (role === undefined) {
                console.log('roleKey')
                console.log(roleKey)
                throw new Error("Invalid role type");
            }

            const staff: User = {
                ID: responseStaff.id!,
                Email: responseStaff.email!,
                Name: responseStaff.first_name! + ' ' + responseStaff.last_name!,
                Phone: responseStaff.phone!,
                StaffInfo: {
                    IsActive: responseStaff.is_active!,
                    Role: role,
                },
                CreatedAt: new Date(responseStaff.created_at!),
                UpdatedAt: new Date(responseStaff.updated_at!),
            }

            return staff;
        }
        )

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