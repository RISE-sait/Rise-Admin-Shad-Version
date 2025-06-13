//// filepath: s:\Rise Capstone\Rise Project\Rise-Admin-Shad-Version\hooks\use-breadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Example route mapping, adjusted for your sidebar links
const routeMapping: Record<string, BreadcrumbItem[]> = {
  "/": [{ title: "Dashboard", link: "/" }],
  "/calendar": [
    { title: "Dashboard", link: "/" },
    { title: "Calendar", link: "/calendar" },
  ],

  // Manage
  "/manage/customers": [
    { title: "Dashboard", link: "/" },
    { title: "Customers", link: "/manage/customers" },
  ],
  "/manage/courses": [
    { title: "Dashboard", link: "/" },
    { title: "Courses", link: "/manage/courses" },
  ],
  "/manage/store": [
    { title: "Dashboard", link: "/" },
    { title: "Store", link: "/manage/store" },
  ],
  "/manage/facilities": [
    { title: "Dashboard", link: "/" },
    { title: "Facilities", link: "/manage/facilities" },
  ],
  "/manage/instructors": [
    { title: "Dashboard", link: "/" },
    { title: "Instructors", link: "/manage/instructors" },
  ],
  "/manage/trainer": [
    { title: "Dashboard", link: "/" },
    { title: "Trainer", link: "/manage/trainer" },
  ],
  "/manage/membership": [
    { title: "Dashboard", link: "/" },
    { title: "Membership", link: "/manage/membership" },
  ],
  "/manage/teams": [
    { title: "Dashboard", link: "/" },
    { title: "Teams", link: "/manage/teams" },
  ],
  "/manage/playgorund": [
    { title: "Dashboard", link: "/" },
    { title: "Playground", link: "/manage/playground" },
  ],

  // Automation
  "/automation/messages": [
    { title: "Dashboard", link: "/" },
    { title: "Messages", link: "/automation/messages" },
  ],

  // Reports
  "/reports/transactions": [
    { title: "Dashboard", link: "/" },
    { title: "Transactions", link: "/reports/transactions" },
  ],
  "/reports/financials": [
    { title: "Dashboard", link: "/" },
    { title: "Financials", link: "/reports/financials" },
  ],
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }
    // Fall back to auto-generating if not in routeMapping
    const segments = pathname.split("/").filter(Boolean);
    const page = segments.pop();
    const title = page
      ? page.charAt(0).toUpperCase() + page.slice(1)
      : "Dashboard";
    if (!page) {
      return [{ title: "Dashboard", link: "/" }];
    }
    return [
      { title: "Dashboard", link: "/" },
      { title, link: pathname },
    ];
  }, [pathname]);

  return breadcrumbs;
}
