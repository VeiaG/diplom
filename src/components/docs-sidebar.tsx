"use client"

import { usePathname } from "next/navigation"
import { Book, ChevronLeft, Home } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Documentation structure with groups and nested pages
const docsNavigation = [
  {
    title: "Початок",
    icon: Home,
    items: [
      { title: "Огляд інтерфейсу", href: "/docs/interface" },
      { title: "Створення контрактів", href: "/docs/contract-form" },
    ],
  },
  {
    title: "Адміністрування",
    icon: Book,
    items: [
      { title: "Огляд інтерфейсу", href: "/docs/admin-interface " },
      { title: "Реєстрація користувачів", href: "/docs/user-managment" },
      { title: "Редагування таблиць", href: "/docs/database" },
      { title: "Імпорт та Експорт", href: "/docs/import" },
      { title: "Редагування шаблонів", href: "/docs/templates" },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton  asChild>
              <Link href="/">
                <ChevronLeft/>
                <span className="ml-2">На головну</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {docsNavigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>
              <group.icon className="mr-2 h-4 w-4" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

