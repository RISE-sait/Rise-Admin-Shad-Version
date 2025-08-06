// services/playground.ts
import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import { fromZonedISOString } from "@/lib/utils";
import {
  PlaygroundSession,
  PlaygroundSystem,
  PlaygroundSessionRequestDto,
  PlaygroundSystemRequestDto,
} from "@/types/playground";

// Helper to map raw API data to PlaygroundSession
function mapSession(data: any): PlaygroundSession {
  return {
    id: data.id,
    system_id: data.system_id,
    system_name: data.system_name,
    customer_id: data.customer_id,
    customer_first_name: data.customer_first_name,
    customer_last_name: data.customer_last_name,
    start_time: fromZonedISOString(data.start_time),
    end_time: fromZonedISOString(data.end_time),
    created_at: fromZonedISOString(data.created_at),
    updated_at: fromZonedISOString(data.updated_at),
  };
}

// Helper to map raw API data to PlaygroundSystem
function mapSystem(data: any): PlaygroundSystem {
  return {
    id: data.id,
    name: data.name,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
}

// Fetch all playground sessions
export async function getPlaygroundSessions(): Promise<PlaygroundSession[]> {
  const response = await fetch(`${getValue("API")}playground`);
  const json = await response.json();
  if (!response.ok) {
    const msg = json.error?.message || response.statusText;
    throw new Error(`Failed to get sessions: ${msg}`);
  }
  return (json as any[]).map(mapSession);
}

// Create a new session; returns error message or null
export async function createPlaygroundSession(
  data: PlaygroundSessionRequestDto,
  jwt: string
): Promise<string | null> {
  const response = await fetch(`${getValue("API")}playground`, {
    method: "POST",
    ...addAuthHeader(jwt),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const json = await response.json();
    return json.error?.message || response.statusText;
  }
  return null;
}

// Update existing session
export async function updatePlaygroundSession(
  id: string,
  data: PlaygroundSessionRequestDto,
  jwt: string
): Promise<string | null> {
  const response = await fetch(`${getValue("API")}playground/${id}`, {
    method: "PUT",
    ...addAuthHeader(jwt),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const json = await response.json();
    return json.error?.message || response.statusText;
  }
  return null;
}

// Delete a session
export async function deletePlaygroundSession(
  id: string,
  jwt: string
): Promise<string | null> {
  const response = await fetch(`${getValue("API")}playground/${id}`, {
    method: "DELETE",
    ...addAuthHeader(jwt),
  });
  if (!response.ok) {
    const json = await response.json();
    return json.error?.message || response.statusText;
  }
  return null;
}

// Fetch all systems
export async function getPlaygroundSystems(): Promise<PlaygroundSystem[]> {
  const response = await fetch(`${getValue("API")}playground/systems`);
  const json = await response.json();
  if (!response.ok) {
    const msg = json.error?.message || response.statusText;
    throw new Error(`Failed to get systems: ${msg}`);
  }
  return (json as any[]).map(mapSystem);
}

// Create a new system
export async function createPlaygroundSystem(
  data: PlaygroundSystemRequestDto,
  jwt: string
): Promise<string | null> {
  const response = await fetch(`${getValue("API")}playground/systems`, {
    method: "POST",
    ...addAuthHeader(jwt),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const json = await response.json();
    return json.error?.message || response.statusText;
  }
  return null;
}

// Update existing system
export async function updatePlaygroundSystem(
  id: string,
  data: PlaygroundSystemRequestDto,
  jwt: string
): Promise<string | null> {
  const response = await fetch(`${getValue("API")}playground/systems/${id}`, {
    method: "PUT",
    ...addAuthHeader(jwt),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const json = await response.json();
    return json.error?.message || response.statusText;
  }
  return null;
}

// Delete a system
export async function deletePlaygroundSystem(
  id: string,
  jwt: string
): Promise<string | null> {
  const response = await fetch(`${getValue("API")}playground/systems/${id}`, {
    method: "DELETE",
    ...addAuthHeader(jwt),
  });
  if (!response.ok) {
    const json = await response.json();
    return json.error?.message || response.statusText;
  }
  return null;
}
