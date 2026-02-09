import { addAuthHeader } from "@/lib/auth-header";
import getValue from "@/configs/constants";
import {
  Job,
  Application,
  CreateJobRequest,
  UpdateJobRequest,
  JobStatus,
  ApplicationStatus,
} from "@/types/careers";

// Helper to safely extract error message from API response
function extractErrorMessage(errorData: unknown, fallback: string): string {
  if (!errorData || typeof errorData !== "object") {
    return fallback;
  }

  const data = errorData as Record<string, unknown>;

  // Handle nested message object
  if (data.message && typeof data.message === "object") {
    const msg = data.message as Record<string, unknown>;
    if (typeof msg.message === "string") return msg.message;
    if (typeof msg.error === "string") return msg.error;
  }

  // Handle direct string properties
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (typeof data.detail === "string") return data.detail;

  // Handle array of errors
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const firstError = data.errors[0];
    if (typeof firstError === "string") return firstError;
    if (typeof firstError?.message === "string") return firstError.message;
  }

  return fallback;
}

// ==================== Jobs API ====================

export async function getAllJobs(jwt: string): Promise<Job[]> {
  try {
    const response = await fetch(`${getValue("API")}jobs/all`, {
      method: "GET",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const jobs: Job[] = await response.json();
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

export async function getJob(id: string, jwt: string): Promise<Job> {
  try {
    const response = await fetch(`${getValue("API")}jobs/${id}`, {
      method: "GET",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job: ${response.statusText}`);
    }

    const job: Job = await response.json();
    return job;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}

export async function createJob(
  data: CreateJobRequest,
  jwt: string
): Promise<{ job?: Job; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}jobs`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractErrorMessage(
        errorData,
        `Failed to create job: ${response.statusText}`
      );
      return { error: errorMessage };
    }

    const job: Job = await response.json();
    return { job };
  } catch (error) {
    console.error("Error creating job:", error);
    return { error: "An unexpected error occurred while creating the job" };
  }
}

export async function updateJob(
  id: string,
  data: UpdateJobRequest,
  jwt: string
): Promise<{ job?: Job; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}jobs/${id}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractErrorMessage(
        errorData,
        `Failed to update job: ${response.statusText}`
      );
      return { error: errorMessage };
    }

    const job: Job = await response.json();
    return { job };
  } catch (error) {
    console.error("Error updating job:", error);
    return { error: "An unexpected error occurred while updating the job" };
  }
}

export async function deleteJob(
  id: string,
  jwt: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}jobs/${id}`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractErrorMessage(
        errorData,
        `Failed to delete job: ${response.statusText}`
      );
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting job:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the job",
    };
  }
}

export async function updateJobStatus(
  id: string,
  status: JobStatus,
  jwt: string
): Promise<{ job?: Job; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}jobs/${id}/status`, {
      method: "PATCH",
      ...addAuthHeader(jwt),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractErrorMessage(
        errorData,
        `Failed to update job status: ${response.statusText}`
      );
      return { error: errorMessage };
    }

    const job: Job = await response.json();
    return { job };
  } catch (error) {
    console.error("Error updating job status:", error);
    return {
      error: "An unexpected error occurred while updating the job status",
    };
  }
}

// ==================== Applications API ====================

export async function getAllApplications(jwt: string): Promise<Application[]> {
  try {
    const response = await fetch(`${getValue("API")}applications`, {
      method: "GET",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch applications: ${response.statusText}`);
    }

    const applications: Application[] = await response.json();
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
}

export async function getJobApplications(
  jobId: string,
  jwt: string
): Promise<Application[]> {
  try {
    const response = await fetch(`${getValue("API")}jobs/${jobId}/applications`, {
      method: "GET",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job applications: ${response.statusText}`);
    }

    const applications: Application[] = await response.json();
    return applications;
  } catch (error) {
    console.error("Error fetching job applications:", error);
    throw error;
  }
}

export async function getApplication(
  id: string,
  jwt: string
): Promise<Application> {
  try {
    const response = await fetch(`${getValue("API")}applications/${id}`, {
      method: "GET",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch application: ${response.statusText}`);
    }

    const application: Application = await response.json();
    return application;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  jwt: string
): Promise<{ application?: Application; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}applications/${id}/status`, {
      method: "PATCH",
      ...addAuthHeader(jwt),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractErrorMessage(
        errorData,
        `Failed to update application status: ${response.statusText}`
      );
      return { error: errorMessage };
    }

    const application: Application = await response.json();
    return { application };
  } catch (error) {
    console.error("Error updating application status:", error);
    return {
      error: "An unexpected error occurred while updating the application status",
    };
  }
}

export async function updateApplicationNotes(
  id: string,
  notes: string,
  jwt: string
): Promise<{ application?: Application; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}applications/${id}/notes`, {
      method: "PATCH",
      ...addAuthHeader(jwt),
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractErrorMessage(
        errorData,
        `Failed to update application notes: ${response.statusText}`
      );
      return { error: errorMessage };
    }

    const application: Application = await response.json();
    return { application };
  } catch (error) {
    console.error("Error updating application notes:", error);
    return {
      error: "An unexpected error occurred while updating the application notes",
    };
  }
}

export async function updateApplicationRating(
  id: string,
  rating: number,
  jwt: string
): Promise<{ application?: Application; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}applications/${id}/rating`, {
      method: "PATCH",
      ...addAuthHeader(jwt),
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractErrorMessage(
        errorData,
        `Failed to update application rating: ${response.statusText}`
      );
      return { error: errorMessage };
    }

    const application: Application = await response.json();
    return { application };
  } catch (error) {
    console.error("Error updating application rating:", error);
    return {
      error: "An unexpected error occurred while updating the application rating",
    };
  }
}
