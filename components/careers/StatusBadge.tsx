"use client";

import { Badge } from "@/components/ui/badge";
import type { JobStatus, ApplicationStatus } from "@/types/careers";

interface JobStatusBadgeProps {
  status: JobStatus;
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const statusConfig: Record<
    JobStatus,
    { label: string; className: string }
  > = {
    draft: {
      label: "Draft",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
    published: {
      label: "Published",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    closed: {
      label: "Closed",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    },
    archived: {
      label: "Archived",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return <Badge className={config.className}>{config.label}</Badge>;
}

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const statusConfig: Record<
    ApplicationStatus,
    { label: string; className: string }
  > = {
    received: {
      label: "Received",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    reviewing: {
      label: "Reviewing",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    },
    interview: {
      label: "Interview",
      className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
    offer: {
      label: "Offer",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    hired: {
      label: "Hired",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
    withdrawn: {
      label: "Withdrawn",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
  };

  const config = statusConfig[status] || statusConfig.received;

  return <Badge className={config.className}>{config.label}</Badge>;
}
