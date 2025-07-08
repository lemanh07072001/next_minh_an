"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation';
export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {

    const pathname = usePathname();
    const cleanPath = pathname.replace(/^\/(en|vi)/, '');
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isParentActive = item.items?.some(
                        (subItem) => cleanPath === subItem.url
                    );

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isParentActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className={isParentActive ? 'text-primary font-semibold' : ''}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => {
                                            const isActive = cleanPath === subItem.url;
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a
                                                            href={subItem.url}
                                                            className={`block w-full text-left px-3 py-1.5 rounded ${
                                                                isActive
                                                                    ? 'text-primary bg-muted font-semibold'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <span>{subItem.title}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
