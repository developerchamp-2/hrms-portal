"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightLeft,
  Briefcase,
  Building2,
  Gauge,
  IdCard,
  LayoutGrid,
  User2Icon,
  UserCog,
  Users2Icon,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { Switcher } from "@/components/switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

type SidebarUser = {
  name?: string
  email?: string
  avatar?: string
}

type SidebarRole = string | undefined

type MenuItem = {
  name: string
  url: string
  icon: React.ReactNode
}

type MenuGroup = {
  name: string
  icon: React.ReactNode
  children: MenuItem[]
}

const menu: MenuGroup[] = [
  {
    name: "Dashboard",
    icon: <Gauge />,
    children: [
      {
        name: "Overview",
        url: "/dashboard",
        icon: <Gauge />,
      },
      {
        name: "Employee Dashboard",
        url: "/employee-dashboard",
        icon: <Users2Icon />,
      },
    ],
  },
  {
    name: "Employee Management",
    icon: <Users2Icon />,
    children: [
      {
        name: "Employee profiles",
        url: "/employee-profiles",
        icon: <Users2Icon />,
      },
      {
        name: "Dept & org chart",
        url: "/department",
        icon: <Building2 />,
      },
      {
        name: "Work location",
        url: "/work-location",
        icon: <Briefcase />,
      },
      {
        name: "Employee ID & docs",
        url: "/employee-documents",
        icon: <IdCard />,
      },
      {
        name: "Transfer & promotion",
        url: "/transfer-promotion",
        icon: <ArrowRightLeft />,
      },
    ],
  },
  {
    name: "User Management",
    icon: <User2Icon />,
    children: [
      {
        name: "User",
        url: "/users",
        icon: <User2Icon />,
      },
      {
        name: "Role",
        url: "/roles",
        icon: <UserCog />,
      },
      {
        name: "Module",
        url: "/module",
        icon: <LayoutGrid />,
      },
    ],
  },
  {
    name: "Employer Management",
    icon: <Building2 />,
    children: [
      {
        name: "Company",
        url: "/companies",
        icon: <Building2 />,
      },
      {
        name: "Employer",
        url: "/employers",
        icon: <UserCog />,
      },
    ],
  },
]

function getMenuByRole(role?: SidebarRole) {
  if (role?.toLowerCase() === "employee") {
    return [
      {
        name: "Dashboard",
        icon: <Gauge />,
        children: [
          {
            name: "Employee Dashboard",
            url: "/employee-dashboard",
            icon: <Users2Icon />,
          },
        ],
      },
    ] satisfies MenuGroup[]
  }

  return menu
}

export function AppSidebar({
  user,
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: SidebarUser
  role?: SidebarRole
}) {
  const navUser = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || "",
  }
  const filteredMenu = getMenuByRole(role)
  const homeHref = role?.toLowerCase() === "employee" ? "/employee-dashboard" : "/dashboard"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-2">
              <Link href={homeHref}>
                <div className="flex items-center gap-2">
                  <Image
                    src="/sy.png"
                    alt="logo"
                    width={28}
                    height={28}
                    className="rounded-md"
                  />
                  <span className="text-sm font-semibold whitespace-nowrap group-data-[collapsible=icon]:hidden">
                    SY ASSOCIATES
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-2">
        {filteredMenu.map((group) => (
          <Switcher key={group.name} menu={group} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
