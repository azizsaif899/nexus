"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Megaphone,
  Bot,
  Sparkles,
  Users,
  Building2,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/campaigns", icon: <Megaphone />, label: "Campaigns" },
  { href: "/bots", icon: <Bot />, label: "WhatsApp Bots" },
  { href: "/assistant", icon: <Sparkles />, label: "AI Assistant" },
  { href: "/users", icon: <Users />, label: "Users" },
  { href: "/tenants", icon: <Building2 />, label: "Tenants" },
];

const settingsNav = [
    { href: "/settings", icon: <Settings />, label: "Settings" }
]

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive(item.href)}
              tooltip={item.label}
            >
              <Link href={item.href}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu className="mt-auto">
        {settingsNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive(item.href)}
              tooltip={item.label}
            >
              <Link href={item.href}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
