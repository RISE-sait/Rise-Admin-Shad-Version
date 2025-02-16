"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import Link from 'next/link'
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/contexts/UserContext"

const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: "/Icons/Home.svg",
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Calender",
          url: "/calender",
        },
      ],
    },
    {
      title: "Manage",
      url: "/manage/clients",
      icon: '/Icons/Manage.svg',
      items: [
        {
          title: "Customers",
          url: "/manage/customers",
        },
        {
          title: "Courses",
          url: "/manage/courses",
        },
        {
          title: "Store",
          url: "/manage/store",
        },
        {
          title: "Facilites",
          url: "/manage/facilites",
        },
        {
          title: "Instructors",
          url: "/manage/instructors",
        },
        {
          title: "Trainers",
          url: "/manage/trainers",
        },
        {
          title: "Memberships",
          url: "/manage/memberships",
        },
      ],
    },
    {
      title: "Automation",
      url: "#",
      icon: '/Icons/Automation.svg',
      items: [
        {
          title: "Messages",
          url: "/automation/messages",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: '/Icons/Reports.svg',
      items: [
        {
          title: "Transactions",
          url: "/reports/transactions",
        },
        {
          title: "Financials",
          url: "/reports/financials",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user } = useUser()

  const navUserProps: {
    name: string
    email: string
    avatar: string
  } = {
    email: user?.Email || "",
    name: user?.Name || "",
    avatar: "/avatars/shadcn.jpg"
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <div className="flex items-center justify-center h-12 pt-12 pb-8 w-full" > 
        <Link href={"/"} > <Image src={'/RiseLogo.svg'} alt={"Rise Logo"} width={120} height={120} /> </Link>
      </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={navUserProps} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
