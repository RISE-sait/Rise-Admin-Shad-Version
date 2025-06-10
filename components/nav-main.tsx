"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  items?: NavItem[];
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu className="gap-0">
        {items.map((item) => (
          <React.Fragment key={item.title}>
            {item.url ? (
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                  asChild
                  className="text-base hover:bg-primary/20 data-[active=true]:bg-primary/30"
                  isActive={pathname === item.url}
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarGroupLabel className="flex items-center gap-2 px-2 text-base font-medium">
                {item.icon}
                <span>{item.title}</span>
              </SidebarGroupLabel>
            )}
            {item.items?.length ? (
              <SidebarMenuSub className="border-none gap-0">
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title} className="mb-2">
                    <SidebarMenuSubButton
                      asChild
                      className="text-base hover:bg-primary/20 data-[active=true]:bg-primary/30"
                      isActive={pathname === subItem.url}
                    >
                      <Link href={subItem.url ?? "#"}>
                        {subItem.icon ?? (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            ) : null}
          </React.Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
