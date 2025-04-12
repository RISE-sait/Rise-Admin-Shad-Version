import { z } from "zod"

// Schema for the basic event form (single event)
export const eventSchema = z.object({
  program_id: z.string().optional(),
  location_id: z.string().nonempty("Location is required"),
  team_id: z.string().optional(),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  start_at: z.string().nonempty("Start time is required"),
  end_at: z.string().nonempty("End time is required"),
})

// Schema for the recurring event pattern
export const recurringPatternSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]),
  interval: z.coerce.number().min(1, "Interval must be at least 1"),
  days_of_week: z.array(z.string()).optional(),
  end_date: z.string().nonempty("End date is required"),
  end_occurrences: z.coerce.number().optional(),
})

// Combined schema for recurring events
export const recurringEventSchema = eventSchema.extend({
  recurring_pattern: recurringPatternSchema,
})

// Keep these for backward compatibility
export const classSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
  color: z.string().min(1, "Color is required"),
  instructor: z.string().min(1, "Instructor is required"),
})

export const facilitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
  color: z.string().min(1, "Color is required"),
  facilityId: z.string().min(1, "Facility ID is required"),
})