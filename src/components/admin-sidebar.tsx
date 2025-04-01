import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
import { ArrowLeft, BetweenHorizonalStart, Download, FileText, FileUp, House, Users } from "lucide-react"
import Link from "next/link"
  
  export function AdminSidebar() {
    return (
      <Sidebar collapsible="icon" variant="floating">

        <SidebarHeader>
            <SidebarTrigger/>
            <SidebarMenuButton asChild tooltip="Адмін панель">
                <Link href="/">
                    <ArrowLeft/>
                    <span>
                        Назад до застосунку
                    </span>
                </Link>
        </SidebarMenuButton>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup >
            <SidebarGroupLabel>Управління застосунком</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Адмін панель">
                                <Link href="/admin">
                                    <House/>
                                    <span>
                                        Адмін панель
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Користувачі">
                            <Link href="/admin/users">
                                <Users/>
                                <span>
                                    Користувачі
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Звіти">
                            <Link href="/admin" >
                                <Download/>
                                <span>
                                    Звіти
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup >
            <SidebarGroupLabel>БД та генерація</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Редагувати таблиці">
                            <Link href="/admin/tables">
                                <BetweenHorizonalStart/>
                                <span>
                                    Редагувати таблиці
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Контракти">
                            <Link href="/admin/users">
                                <FileText/>
                                <span>
                                    Контракти
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Імпорт даних">
                            <Link href="/admin/import">
                                <FileUp/>
                                <span>
                                    Імпорт даних
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }
  