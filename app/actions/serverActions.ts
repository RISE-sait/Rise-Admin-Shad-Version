"use server";

import { revalidatePath } from "next/cache";

export async function revalidateLocations() {
  revalidatePath("/manage/locations");
}
