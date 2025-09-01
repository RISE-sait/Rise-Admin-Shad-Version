import { LoginLog } from "@/types/login-logs";

const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;
const LOG_STORAGE_KEY = "checkinLogs";

function pruneOldLogs(logs: LoginLog[]): LoginLog[] {
  const cutoff = Date.now() - FORTY_EIGHT_HOURS;
  return logs.filter((log) => new Date(log.loginTime).getTime() >= cutoff);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function loadLogs(): LoginLog[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(LOG_STORAGE_KEY);
  if (!stored) return [];
  try {
    const logs: LoginLog[] = JSON.parse(stored);
    const pruned = pruneOldLogs(logs);
    if (pruned.length !== logs.length) {
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(pruned));
    }
    return pruned;
  } catch {
    return [];
  }
}

export function saveLogs(logs: LoginLog[]): void {
  if (typeof window === "undefined") return;
  const pruned = pruneOldLogs(logs);
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(pruned));
  window.dispatchEvent(new Event("checkinLogsUpdated"));
}

export function countTodayLogs(): number {
  const logs = loadLogs();
  const today = new Date();
  return logs.filter((log) => isSameDay(new Date(log.loginTime), today)).length;
}
