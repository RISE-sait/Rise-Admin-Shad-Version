// Job status enum
export type JobStatus = "draft" | "published" | "closed" | "archived";

// Employment type enum (uses underscores to match backend)
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship" | "volunteer";

// Location type enum (uses underscores to match backend)
export type LocationType = "on_site" | "remote" | "hybrid";

// Application status enum (matches backend exactly)
export type ApplicationStatus =
  | "received"
  | "reviewing"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

// Job interface (matches backend JobPostingResponse)
export interface Job {
  id: string;
  title: string;
  position: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  nice_to_have?: string[];
  employment_type: EmploymentType;
  location_type: LocationType;
  show_salary: boolean;
  salary_min?: string;
  salary_max?: string;
  status: JobStatus;
  closing_date?: string;
  created_by?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Application interface (matches backend JobApplicationResponse)
export interface Application {
  id: string;
  job_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  resume_url: string;
  cover_letter?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  status: ApplicationStatus;
  internal_notes?: string;
  rating?: number;
  reviewed_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Create job request DTO (matches backend CreateJobPostingRequest)
export interface CreateJobRequest {
  title: string;
  position: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  nice_to_have?: string[];
  employment_type: EmploymentType;
  location_type: LocationType;
  show_salary: boolean;
  salary_min?: number;
  salary_max?: number;
  closing_date?: string;
}

// Update job request DTO
export interface UpdateJobRequest extends CreateJobRequest {}

// Update job status request DTO
export interface UpdateJobStatusRequest {
  status: JobStatus;
}

// Update application status request DTO
export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

// Update application notes request DTO (backend uses 'notes' not 'internal_notes')
export interface UpdateApplicationNotesRequest {
  notes: string;
}

// Update application rating request DTO
export interface UpdateApplicationRatingRequest {
  rating: number;
}
