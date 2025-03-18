import "../globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import Header from "../../components/header";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="sticky top-0 z-50 bg-background shadow-sm">
            <Header />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
