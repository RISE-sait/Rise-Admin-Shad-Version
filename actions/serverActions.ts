"use server";

import { revalidatePath } from "next/cache";

export async function revalidateLocations() {
  revalidatePath("/manage/locations");
}

export async function revalidatePrograms() {
  revalidatePath("/manage/programs");
}

export async function revalidateMemberships() {
  revalidatePath("/manage/memberships");
}

export async function revalidateStaffs() {
  revalidatePath("/manage/staffs");
}

export async function revalidateTeams() {
  revalidatePath("/manage/teams");
}

export async function revalidatePlayground() {
  revalidatePath("/manage/playground");
}

export async function revalidatePendingStaffs() {
  revalidatePath("/manage/pending-staff");
}

export async function revalidateGames() {
  revalidatePath("/manage/games");
}

export async function revalidatePractices() {
  revalidatePath("/manage/practices");
}

export async function revalidateCourts() {
  revalidatePath("/manage/courts");
}
