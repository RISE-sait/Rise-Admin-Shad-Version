import { StaffRequestDto, StaffResponseDto } from "@/app/api/Api";
import { StaffRole, StaffRoleEnum, User } from "@/types/user";
import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";

export async function getAllStaffs(roleFilter?: string): Promise<User[]> {
  try {
    const url = roleFilter
      ? `${getValue("API")}staffs?role=${roleFilter}`
      : `${getValue("API")}staffs`;

    const response = await fetch(url);

    const responseJson = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get staffs: ${response.statusText}`;

      if (responseJson.error) {
        errorMessage = responseJson.error.message;
      }

      console.error(`Failed to fetch staffs: ${errorMessage}`);
      throw new Error(`Failed to fetch staffs: ${errorMessage}`);
    }

    const staffsResponse = responseJson as StaffResponseDto[];

    const staffs: User[] = staffsResponse.map((responseStaff) => {
      const roleKey = responseStaff.role_name?.toUpperCase() as StaffRole;
      const role = StaffRoleEnum[roleKey];

      if (role === undefined) {
        console.error(`Invalid role: ${roleKey}`);
        throw new Error("Invalid role type");
      }

      const staff: User = {
        ID: responseStaff.id!,
        Email: responseStaff.email!,
        Name: responseStaff.first_name! + " " + responseStaff.last_name!,
        Phone: responseStaff.phone!,
        StaffInfo: {
          IsActive: responseStaff.is_active!,
          Role: role,
        },
        CreatedAt: new Date(responseStaff.created_at!),
        UpdatedAt: new Date(responseStaff.updated_at!),
      };

      return staff;
    });

    return staffs;
  } catch (error) {
    throw new Error(`Failed to fetch staffs: ${error}`);
  }
}

export async function createStaff(
  locationData: StaffRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}staffs`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(locationData),
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
    console.error("Error creating staff:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

export async function deleteStaff(staffId: string, jwt: string): Promise<any> {
  try {
    await fetch(`${getValue("API")}staffs/${staffId}`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
}

export async function getPendingStaffs(jwt: string): Promise<User[]> {
  try {
    const response = await fetch(`${getValue("API")}register/staff/pending`, {
      ...addAuthHeader(jwt),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get pending staff: ${response.statusText}`;

      if (responseJson.error) {
        errorMessage = responseJson.error.message;
      }

      throw new Error(errorMessage);
    }

    return (responseJson as any[]).map(
      (staff) =>
        ({
          ID: staff.id as string,
          Email: staff.email as string,
          Name: `${staff.first_name} ${staff.last_name}`,
          Phone: staff.phone as string,
          StaffInfo: { IsActive: false, Role: StaffRoleEnum.INSTRUCTOR },
          CreatedAt: new Date(staff.created_at as string),
          UpdatedAt: new Date(staff.updated_at as string),
        }) as User
    );
  } catch (error) {
    console.error("Error fetching pending staffs:", error);
    throw error;
  }
}

export async function approveStaff(id: string, jwt: string): Promise<void> {
  try {
    const response = await fetch(
      `${getValue("API")}register/staff/approve/${id}`,
      {
        method: "POST",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      let errorMessage = `Failed to approve staff: ${response.statusText}`;
      if (data.error?.message) {
        errorMessage = data.error.message;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error approving staff:", error);
    throw error;
  }
}
