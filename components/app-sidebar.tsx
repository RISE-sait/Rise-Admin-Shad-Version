"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/contexts/UserContext";
import { HomeIcon, Wrench } from "lucide-react";
import { StaffRoleEnum } from "@/types/user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const role = user?.Role

  // Build nav items based on role
  const navMain = [
    {
      title: "Home",
      url: "#",
      icon: <HomeIcon width={20} height={15} />,
      isActive: true,
      items: [
        // Everyone with access can see Calendar
        { title: "Calendar", url: "/" },
      ],
    },
    {
      title: "Manage",
      url: "/manage/clients",
      icon: <Wrench width={15} height={15} />,
      isActive: true,
      items: [

        // Only Admin/SuperAdmin can see Customers, Programs, Locations, Memberships, Staff
        ...(role == StaffRoleEnum.ADMIN || role == StaffRoleEnum.SUPERADMIN
          ? [
              { title: "Customers", url: "/manage/customers" },
              { title: "Programs", url: "/manage/programs" },
              { title: "Locations", url: "/manage/locations" },
              { title: "Memberships", url: "/manage/memberships" },
              { title: "Staff", url: "/manage/staff" },
            ]
          : []),

        // Barbers and SuperAdmin can see Barbershop
        ...(role == StaffRoleEnum.BARBER || role == StaffRoleEnum.SUPERADMIN || role == StaffRoleEnum.ADMIN
          ? [{ title: "Barbershop", url: "/manage/barbershop" }]
          : []),
          
      ],
    },
  ];

  const navUserProps = {
    email: user?.Email || "",
    name: user?.Name || "",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center h-12 pt-12 pb-8 w-full">
          <Link href={"/"}>
            <Image
              src={"/RiseLogo.svg"}
              alt={"Rise Logo"}
              width={120}
              height={120}
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}