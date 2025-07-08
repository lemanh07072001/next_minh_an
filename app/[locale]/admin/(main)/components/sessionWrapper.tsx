"use client";
import {ReactNode} from "react";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/app/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { SessionProvider } from "next-auth/react";
import SelectChangeFlag from "@/app/[locale]/admin/(main)/components/SelectChangeFlag";
import SelectToggleThemeMode from "@/app/[locale]/admin/(main)/components/SelectToggleThemeMode";
import AppBreadcrumbs from "@/app/[locale]/admin/(main)/components/Breadcrumbs";

export default function SessionWrapper({ children }: { children: ReactNode }) {



  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex justify-between w-full items-center">
              <AppBreadcrumbs/>

              <div className="flex items-center gap-2">
                <SelectChangeFlag/>

                <SelectToggleThemeMode/>
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
            <Toaster richColors />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
