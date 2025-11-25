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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
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

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <Logo
            variant="sidebar"
            emblemSize={isCollapsed ? "sm" : "md"}
            showText={!isCollapsed}
            className={cn("transition-all", isCollapsed && "justify-center")}
          />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
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
    </Sidebar>
  );
}

