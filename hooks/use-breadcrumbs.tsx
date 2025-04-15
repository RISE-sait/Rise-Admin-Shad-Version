//// filepath: s:\Rise Capstone\Rise Project\Rise-Admin-Shad-Version\hooks\use-breadcrumbs.tsx
"use client";

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Example route mapping, adjusted for your sidebar links
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/home/dashboard': [
    { title: 'Home', link: '/' },
    { title: 'Dashboard', link: '/home/dashboard' }
  ],
  '/home/calendar': [
    { title: 'Home', link: '/home' },
    { title: 'Calendar', link: '/home/calendar' }
  ],

  // Manage
  '/manage/customers': [
    { title: 'Home', link: '/' },
    { title: 'Customers', link: '/manage/customers' }
  ],
  '/manage/courses': [
    { title: 'Home', link: '/' },
    { title: 'Courses', link: '/manage/courses' }
  ],
  '/manage/store': [
    { title: 'Home', link: '/' },
    { title: 'Store', link: '/manage/store' }
  ],
  '/manage/facilities': [
    { title: 'Home', link: '/' },
    { title: 'Facilities', link: '/manage/facilities' }
  ],
  '/manage/instructors': [
    { title: 'Home', link: '/' },
    { title: 'Instructors', link: '/manage/instructors' }
  ],
  '/manage/trainer': [
    { title: 'Home', link: '/' },
    { title: 'Trainer', link: '/manage/trainer' }
  ],
  '/manage/membership': [
    { title: 'Home', link: '/' },
    { title: 'Membership', link: '/manage/membership' }
  ],

  // Automation
  '/automation/messages': [
    { title: 'Home', link: '/' },
    { title: 'Messages', link: '/automation/messages' }
  ],

  // Reports
  '/reports/transactions': [
    { title: 'Home', link: '/' },
    { title: 'Transactions', link: '/reports/transactions' }
  ],
  '/reports/financials': [
    { title: 'Home', link: '/' },
    { title: 'Financials', link: '/reports/financials' }
  ]
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }
    // Fall back to auto-generating if not in routeMapping
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
}