"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ExternalLink, Layers, Package, ShoppingCart, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/src/components/ui/sidebar";
import { NavUser } from "@/src/components/nav-user";
import { useAuth } from "@/src/contexts/auth-context";

const navItems = [
  {
    title: "Visão Geral",
    url: "/manager",
    icon: BarChart3,
  },
  {
    title: "Gerenciar Modelos",
    url: "/manager/modelos",
    icon: Layers,
  },
  {
    title: "Gerenciar Produtos",
    url: "/manager/produtos",
    icon: Package,
  },
  {
    title: "Pedidos",
    url: "/manager/pedidos",
    icon: ShoppingCart,
  },
  {
    title: "Clientes",
    url: "/manager/clientes",
    icon: Users,
  },
];

export function ManagerSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/manager">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ária Bags</span>
                  <span className="text-muted-foreground truncate text-xs">Painel Administrativo</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = item.url === "/manager" ? pathname === "/manager" : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Ver loja">
                <Link href="/" target="_blank">
                  <ExternalLink />
                  <span>Ver loja</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Admin",
            email: user?.email ?? "",
            avatar: user?.image ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
