import { z } from "zod"

// 1. Shared base shape
const baseEventShape = {
  title: z.string().min(1, "Title is required"),
  start: z.string().datetime(),
  end: z.string().datetime(),
  color: z.string(),
}

// 2. Base Zod object (no refine yet)
const baseEventCore = z.object(baseEventShape)

// 3. Optionally refine the base with a shared rule (e.g., start < end)
export const baseRefinedEventSchema = baseEventCore.refine(
  (data) => {
    const start = new Date(data.start)
    const end = new Date(data.end)
    return end >= start
  },
  {
    message: "End time must be after start time",
    path: ["end"],
  }
)

// 4. Class event schema – extends the *unrefined* base if you want separate refine logic
export const classSchema = baseEventCore
  .extend({
    instructor: z.string().optional(),
    // ...other class-specific fields
  })
  // .refine(...) if you want a separate rule specifically for classes

// 5. Facility event schema
export const facilitySchema = baseEventCore
  .extend({
    facilityId: z.string().optional(),
    // ...other facility-specific fields
  })
  // .refine(...) if you want a separate rule specifically for facility