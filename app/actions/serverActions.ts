"use server";

import { revalidatePath } from "next/cache";

export async function revalidateLocations() {
    revalidatePath("/manage/locations");
}

export async function revalidatePractices() {
    revalidatePath("/manage/practices");
}

export async function revalidateMemberships() {
    revalidatePath("/manage/memberships");
}
