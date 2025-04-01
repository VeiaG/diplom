"use client"

import { usePathname } from "next/navigation"
import { Book, FileText, Home } from "lucide-react"

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
      { title: "Огляд інтерфейсу", href: "/docs/introduction" },
      { title: "Створення контрактів", href: "/docs/installation" },
      { title: "Завантаження контрактів", href: "/docs/project-structure" },
    ],
  },
  {
    title: "Адміністрування",
    icon: Book,
    items: [
      { title: "Огляд інтерфейсу", href: "/docs/routing" },
      { title: "Реєстрація користувачів", href: "/docs/data-fetching" },
      { title: "Редагування таблиць", href: "/docs/rendering" },
      { title: "Імпорт та Експорт", href: "/docs/caching" },
    ],
  },
  {
    title: "Components",
    icon: FileText,
    items: [
      { title: "Button", href: "/docs/components/button" },
      { title: "Card", href: "/docs/components/card" },
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Form", href: "/docs/components/form" },
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
            <SidebarMenuButton size="lg" asChild>
              <Link href="/docs">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Book className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Документація</span>
                  <span className="text-xs text-muted-foreground">v1.0.0</span>
                </div>
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

