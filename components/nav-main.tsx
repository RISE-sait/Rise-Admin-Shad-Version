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
  description?: string;
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
                  <Link href={item.url} className="flex items-start gap-2">
                    {item.icon}
                    <span className="flex flex-col leading-tight">
                      <span>{item.title}</span>
                      {item.description ? (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarGroupLabel className="flex items-start gap-2 px-2 text-base font-medium">
                {item.icon}
                <span className="flex flex-col leading-tight">
                  <span>{item.title}</span>
                  {item.description ? (
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  ) : null}
                </span>
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
                      <Link
                        href={subItem.url ?? "#"}
                        className="flex items-start gap-2"
                      >
                        {subItem.icon ?? (
                          <ArrowRight className="mt-0.5 h-4 w-4" />
                        )}
                        <span className="flex flex-col leading-tight">
                          <span>{subItem.title}</span>
                          {subItem.description ? (
                            <span className="text-xs text-muted-foreground">
                              {subItem.description}
                            </span>
                          ) : null}
                        </span>
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
