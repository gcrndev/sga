import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  FolderOpen,
  DollarSign,
  Settings,
  Scale,
  UserPlus,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: UserPlus },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Processos", url: "/processos", icon: Scale },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Documentos", url: "/documentos", icon: FolderOpen },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Usuarios", url: "/usuarios", icon: Settings },
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  ADVOGADO: "Advogado",
  ADMINISTRATIVO: "Administrativo",
  FINANCEIRO: "Financeiro",
  PARCEIRO: "Parceiro",
};

function getInitials(name?: string | null) {
  if (!name) return "US";
  const parts = name.trim().split(/\s+/);
  const initials = (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "");
  return initials.toUpperCase() || "US";
}

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={cn(isCollapsed ? "w-16" : "w-64", "flex flex-col overflow-hidden")}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className={cn("flex items-center gap-3 min-w-0", isCollapsed && "justify-center")}>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-semibold leading-tight truncate">{user?.name || "Usuario"}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {ROLE_LABELS[user?.role ?? ""] || user?.role || "Sem perfil"}
                </span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : "whitespace-nowrap"}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!isCollapsed && (
        <SidebarFooter className="mt-auto border-t border-sidebar-border">
          <div className="flex items-center justify-start px-4 py-3">
            <Logo variant="sidebar" emblemSize="md" showText className="transition-none" />
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
