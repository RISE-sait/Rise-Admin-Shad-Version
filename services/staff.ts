import { StaffRequestDto, StaffResponseDto } from "@/app/api/Api";
import { StaffRole, StaffRoleEnum, User } from "@/types/user";
import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  StaffActivityLog,
  StaffActivityLogsParams,
  StaffActivityLogsResult,
} from "@/types/staff-activity-log";

export async function getStaffActivityLogs(
  params: StaffActivityLogsParams = {},
  jwt?: string
): Promise<StaffActivityLogsResult> {
  const searchParams = new URLSearchParams();

  if (params.staffId) {
    searchParams.set("staff_id", params.staffId);
  }

  if (params.searchDescription) {
    searchParams.set("search_description", params.searchDescription);
  }

  if (typeof params.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }

  if (typeof params.offset === "number") {
    searchParams.set("offset", String(params.offset));
  }

  const queryString = searchParams.toString();
  const url = `${getValue("API")}staffs/logs${queryString ? `?${queryString}` : ""}`;

  const resolvedJwt =
    jwt ??
    (typeof window !== "undefined"
      ? (window.localStorage?.getItem("jwt") ?? undefined)
      : undefined);

  if (!resolvedJwt) {
    throw new Error("Authorization token is required");
  }

  const response = await fetch(url, {
    cache: "no-store",
    ...addAuthHeader(resolvedJwt),
  });
  const responseJson = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMessage = `Failed to fetch staff activity logs: ${response.statusText}`;

    const extractedError =
      responseJson?.error?.message ??
      responseJson?.error ??
      responseJson?.message ??
      responseJson?.detail;

    if (
      typeof extractedError === "string" &&
      extractedError.trim().length > 0
    ) {
      errorMessage = extractedError;
    }

    throw new Error(errorMessage);
  }

  const rawLogs = Array.isArray(responseJson?.data)
    ? responseJson.data
    : Array.isArray(responseJson?.logs)
      ? responseJson.logs
      : Array.isArray(responseJson)
        ? responseJson
        : [];

  const logs: StaffActivityLog[] = rawLogs.map((log: any) => {
    const createdAtValue =
      log?.created_at ??
      log?.timestamp ??
      log?.performed_at ??
      log?.logged_at ??
      log?.createdAt ??
      null;

    const createdAtDate =
      createdAtValue !== null ? new Date(createdAtValue) : undefined;

    const normalizedCreatedAt =
      createdAtDate && !Number.isNaN(createdAtDate.valueOf())
        ? createdAtDate.toISOString()
        : "";

    const firstName =
      log?.staff_first_name ??
      log?.first_name ??
      log?.staff?.first_name ??
      log?.staffFirstName ??
      "";
    const lastName =
      log?.staff_last_name ??
      log?.last_name ??
      log?.staff?.last_name ??
      log?.staffLastName ??
      "";

    const staffName =
      `${[firstName, lastName].filter(Boolean).join(" ")}`.trim() ||
      log?.staff_name ||
      log?.name ||
      "";

    return {
      id: String(log?.id ?? ""),
      staffId: String(
        log?.staff_id ?? log?.staffId ?? log?.staff?.id ?? log?.user_id ?? ""
      ),
      staffName,
      staffEmail:
        log?.staff_email ??
        log?.email ??
        log?.staff?.email ??
        log?.staffEmail ??
        "",
      description:
        log?.description ??
        log?.activity_description ??
        log?.action ??
        log?.activity ??
        "",
      createdAt: normalizedCreatedAt,
    } satisfies StaffActivityLog;
  });

  const total =
    typeof responseJson?.total === "number"
      ? responseJson.total
      : typeof responseJson?.meta?.total === "number"
        ? responseJson.meta.total
        : typeof responseJson?.pagination?.total === "number"
          ? responseJson.pagination.total
          : logs.length;

  return { logs, total } satisfies StaffActivityLogsResult;
}

export async function getAllStaffs(roleFilter?: string): Promise<User[]> {
  try {
    const url = roleFilter
      ? `${getValue("API")}staffs?role=${roleFilter}`
      : `${getValue("API")}staffs`;

    const response = await fetch(url, { cache: "no-store" });

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
        PhotoUrl: (responseStaff as any).photo_url,
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
      cache: "no-store",
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

export async function updateStaff(
  id: string,
  staffData: StaffRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}staffs/${id}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(staffData),
    });

    const responseJSON = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = `Failed to update staff: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error updating staff:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

export async function updateStaffProfile(
  staffId: string,
  photoUrl: string,
  jwt: string
): Promise<boolean> {
  try {
    // REAL UPDATE CODE - Backend server required
    const response = await fetch(
      `${getValue("API")}staffs/${staffId}/profile`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photo_url: photoUrl,
        }),
      }
    );

    if (response.status === 204) {
      return true;
    }

    const errorText = await response.text();
    console.error("Profile update error:", errorText);
    throw new Error("Profile update failed");
  } catch (error) {
    console.error("Error updating staff profile:", error);
    throw error;
  }
}
