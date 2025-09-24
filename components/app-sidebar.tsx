"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useUser } from "@/contexts/UserContext";
import {
  HomeIcon,
  Wrench,
  Calendar,
  Users,
  List,
  MapPin,
  Ticket,
  UserCog,
  Scissors,
  Gamepad2,
  Trophy,
  Dribbble,
  FolderSearch,
} from "lucide-react";
import { StaffRoleEnum } from "@/types/user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const role = user?.Role;

  // Build nav items based on role
  const manageItems =
    role === StaffRoleEnum.ADMIN || role === StaffRoleEnum.SUPERADMIN
      ? [
          {
            title: "Customers",
            url: "/manage/customers",
            icon: <Users width={15} height={15} />,
          },
          {
            title: "Programs",
            url: "/manage/programs",
            icon: <List width={15} height={15} />,
          },
          {
            title: "Facilities",
            url: "/manage/facilities",
            icon: <MapPin width={15} height={15} />,
          },
          {
            title: "Memberships",
            url: "/manage/memberships",
            icon: <Ticket width={15} height={15} />,
          },
          {
            title: "Staff",
            url: "/manage/staff",
            icon: <UserCog width={15} height={15} />,
          },
          {
            title: "Teams",
            url: "/manage/teams",
            icon: <Users width={15} height={15} />,
          },
          {
            title: "Games",
            url: "/manage/games",
            icon: <Trophy width={15} height={15} />,
          },
          {
            title: "Practices",
            url: "/manage/practices",
            icon: <Dribbble width={15} height={15} />,
          },
          {
            title: "Amenities",
            url: "/manage/amenities",
            icon: <Gamepad2 width={15} height={15} />,
          },
        ]
      : role === StaffRoleEnum.COACH
        ? [
            {
              title: "Teams",
              url: "/manage/teams",
              icon: <Users width={15} height={15} />,
            },
            {
              title: "Games",
              url: "/manage/games",
              icon: <Trophy width={15} height={15} />,
            },
            {
              title: "Practices",
              url: "/manage/practices",
              icon: <Dribbble width={15} height={15} />,
            },
          ]
        : [];

  const navMain =
    role === StaffRoleEnum.COACH
      ? [
          {
            title: "Calendar",
            url: "/calendar",
            icon: <Calendar width={15} height={15} />,
          },
          // Only include Manage section when there are items to show
          ...(manageItems.length
            ? [
                {
                  title: "Manage",
                  icon: <Wrench width={15} height={15} />,
                  isActive: true,
                  items: manageItems,
                },
              ]
            : []),
        ]
      : role === StaffRoleEnum.BARBER
        ? [
            {
              title: "Barbershop",
              url: "/manage/barbershop/manage-barbers",
              icon: <Scissors width={20} height={20} />,
            },
          ]
        : [
            {
              title: "Dashboard",
              url: "/",
              icon: <HomeIcon width={20} height={15} />,
              isActive: true,
              items: [
                // Everyone with access can see Calendar
                {
                  title: "Calendar",
                  url: "/calendar",
                  icon: <Calendar width={15} height={15} />,
                },
              ],
            },
            // Only include Manage section when there are items to show
            ...(manageItems.length
              ? [
                  {
                    title: "Manage",
                    icon: <Wrench width={15} height={15} />,
                    isActive: true,
                    items: manageItems,
                  },
                ]
              : []),
          ];

  const homeHref = role === StaffRoleEnum.BARBER ? "/manage/barbershop" : "/";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center h-12 pt-12 pb-8 w-full">
          <Link href={homeHref}>
            <Image
              src={"/RiseLogo1.png"}
              alt={"Rise Logo"}
              width={120}
              height={120}
              className="invert dark:invert-0"
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
