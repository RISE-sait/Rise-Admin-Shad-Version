"use client";
import React from 'react';
import { SidebarTrigger } from '../components/ui/sidebar';
import { Separator } from '../components/ui/separator';
import { Breadcrumbs } from './breadcrumbs';
import SearchInput from '../components/reusable/SearchBar';
import { NavUser } from './nav-user';
import ThemeToggle from './theme-toggle';
import { useUser } from "@/contexts/UserContext"


export default function Header() {
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
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-background text-foreground transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 px-4">
        <div className="hidden md:flex">
        </div>
        <NavUser user={navUserProps} />
        <ThemeToggle />
      </div>
    </header>
  );
}