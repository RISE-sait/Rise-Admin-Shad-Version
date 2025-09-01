import { LoginLog } from "@/types/login-logs";

const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

function pruneOldLogs(logs: LoginLog[]): LoginLog[] {
  const cutoff = Date.now() - FORTY_EIGHT_HOURS;
  return logs.filter((log) => new Date(log.loginTime).getTime() >= cutoff);
}

export function loadLogs(): LoginLog[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("checkinLogs");
  if (!stored) return [];
  try {
    const logs: LoginLog[] = JSON.parse(stored);
    return pruneOldLogs(logs);
  } catch {
    return [];
  }
}

export function saveLogs(logs: LoginLog[]): void {
  if (typeof window === "undefined") return;
  const pruned = pruneOldLogs(logs);
  localStorage.setItem("checkinLogs", JSON.stringify(pruned));
}
