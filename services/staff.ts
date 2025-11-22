import { StaffRequestDto, StaffResponseDto } from "@/app/api/Api";
import { StaffRole, StaffRoleEnum, User } from "@/types/user";
import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  StaffActivityLog,
  StaffActivityLogsParams,
  StaffActivityLogsResult,
} from "@/types/staff-activity-log";
import { initializeApp, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

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
    const url = `${getValue("API")}staffs/${staffId}`;

    const response = await fetch(url, {
      method: "DELETE",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error("DELETE failed. Response:", responseText);

      let responseJSON: any = {};
      try {
        responseJSON = JSON.parse(responseText);
      } catch {
        // Response is not JSON
      }

      let errorMessage = `Failed to delete staff: ${response.statusText}`;

      if (responseJSON.error?.message) {
        errorMessage = responseJSON.error.message;
      } else if (responseJSON.error) {
        errorMessage = String(responseJSON.error);
      } else if (responseJSON.message) {
        errorMessage = responseJSON.message;
      } else if (responseText) {
        errorMessage = responseText;
      }

      // Check for specific constraint violations and provide helpful messages
      if (errorMessage.includes("chk_internal_team_has_coach")) {
        errorMessage = "Cannot delete: This staff member is a coach for internal teams that require a coach. Go to Teams page → Edit each internal team → Assign a new coach, OR mark this staff member as Inactive instead.";
      } else if (errorMessage.includes("violates check constraint")) {
        errorMessage = "Cannot delete: Database constraint violation. This staff member has required associations. Please remove all associations first, or mark them as Inactive instead.";
      } else if (errorMessage.includes("foreign key constraint") || errorMessage.includes("fk_")) {
        if (errorMessage.includes("event")) {
          errorMessage = "Cannot delete: This staff member is assigned to events. Please unassign them from all events first, or mark them as Inactive instead.";
        } else if (errorMessage.includes("booking")) {
          errorMessage = "Cannot delete: This staff member is associated with bookings. Please remove these associations first, or mark them as Inactive instead.";
        } else {
          errorMessage = "Cannot delete: This staff member has associated records (events, bookings, teams, etc.). Please remove all associations first, or mark them as Inactive instead.";
        }
      }

      throw new Error(errorMessage);
    }

    return true;
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
    const url = `${getValue("API")}register/staff/approve/${id}`;

    const response = await fetch(url, {
      method: "POST",
      ...addAuthHeader(jwt),
    });

    const text = await response.text();

    let data: any = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // Response is not JSON
      }
    }

    if (!response.ok) {
      let errorMessage = `Failed to approve staff: ${response.statusText}`;
      if (data.error?.message) {
        errorMessage = data.error.message;
      } else if (data.error) {
        errorMessage = String(data.error);
      } else if (data.message) {
        errorMessage = data.message;
      } else if (text) {
        errorMessage = text;
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

export async function registerStaff(
  staffData: {
    country_code?: string;
    dob: string;
    email: string;
    first_name: string;
    gender?: "M" | "F";
    is_active_staff?: boolean;
    last_name: string;
    password: string;
    phone_number?: string;
    role: string;
  },
  jwt: string
): Promise<{ error: string | null }> {
  let secondaryAuth: any = null;

  try {
    // Step 1: Create Firebase account using a secondary app instance
    // This prevents logging out the current admin

    // Create a secondary Firebase app instance
    const firebaseConfig = {
      apiKey: "AIzaSyC3asIejQ5bP-29GhIZIO4CnlAZO0wETqQ",
      authDomain: "sacred-armor-452904-c0.firebaseapp.com",
      projectId: "sacred-armor-452904-c0",
      storageBucket: "sacred-armor-452904-c0.firebasestorage.app",
      messagingSenderId: "461776259687",
      appId: "1:461776259687:web:558026e90baef5a63522c2",
      measurementId: "G-9YPMC5DDB2"
    };

    let firebaseToken: string;

    try {
      // Create a secondary app with a unique name to avoid conflicts
      const secondaryApp = initializeApp(firebaseConfig, `secondary-${Date.now()}`);
      secondaryAuth = getAuth(secondaryApp);

      // Create user with the secondary auth instance
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        staffData.email,
        staffData.password
      );

      // Get the Firebase ID token from the newly created user
      // This is what the backend needs to verify the Firebase account
      firebaseToken = await userCredential.user.getIdToken();

      // Immediately sign out from the secondary auth to clean up
      // This ensures the new user isn't logged in and the admin stays logged in
      await signOut(secondaryAuth);
    } catch (firebaseError: any) {
      console.error("Firebase account creation failed:", firebaseError);

      // Provide user-friendly error messages
      let errorMessage = "Failed to create Firebase account: ";
      if (firebaseError.code === "auth/email-already-in-use") {
        errorMessage += "This email is already registered.";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorMessage += "Invalid email address.";
      } else if (firebaseError.code === "auth/weak-password") {
        errorMessage += "Password is too weak. Please use a stronger password.";
      } else {
        errorMessage += firebaseError.message || "Unknown error occurred";
      }

      return { error: errorMessage };
    }

    // Step 2: Register staff in backend using the NEW USER'S Firebase token
    // Remove email and password from the request body since backend doesn't accept them
    const { email, password, ...apiData } = staffData;

    const response = await fetch(`${getValue("API")}register/staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`, // Use the NEW user's Firebase token
      },
      body: JSON.stringify(apiData),
    });

    const responseJSON = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = `Failed to register staff in backend: ${response.statusText}`;
      if (responseJSON.error?.message) {
        errorMessage = responseJSON.error.message;
      } else if (responseJSON.error) {
        errorMessage = String(responseJSON.error);
      } else if (responseJSON.message) {
        errorMessage = responseJSON.message;
      }

      errorMessage += " (Note: Firebase account was already created. The new staff member can log in, but their backend profile may be incomplete.)";
      return { error: errorMessage };
    }

    return { error: null };
  } catch (error) {
    console.error("Error registering staff:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getStaffsPaginated(
  jwt: string,
  params?: {
    limit?: number;
    offset?: number;
    role?: string;
  }
): Promise<{ staffs: User[]; total: number; error: string | null }> {
  try {
    const searchParams = new URLSearchParams();

    if (typeof params?.limit === "number") searchParams.set("limit", String(params.limit));
    if (typeof params?.offset === "number") searchParams.set("offset", String(params.offset));
    if (params?.role) searchParams.set("role", params.role);

    const queryString = searchParams.toString();
    const url = `${getValue("API")}staffs${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      cache: "no-store",
      ...addAuthHeader(jwt),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get staffs: ${response.statusText}`;
      if (responseJson.error?.message) {
        errorMessage = responseJson.error.message;
      }
      return { staffs: [], total: 0, error: errorMessage };
    }

    const staffsResponse = Array.isArray(responseJson)
      ? responseJson
      : responseJson.data || [];

    const total =
      typeof responseJson?.total === "number"
        ? responseJson.total
        : staffsResponse.length;

    const staffs: User[] = staffsResponse.map((responseStaff: StaffResponseDto) => {
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

    return { staffs, total, error: null };
  } catch (error) {
    console.error("Error fetching staffs:", error);
    return {
      staffs: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
