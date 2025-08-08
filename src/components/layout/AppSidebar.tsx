import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Building2,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Shield,
} from 'lucide-react';

interface NavItem {
  title: string;
  url: string;
  icon: any;
  module?: string;
  roles?: string[];
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'Finance', url: '/finance', icon: DollarSign, module: 'finance' },
  { title: 'Procurement', url: '/procurement', icon: ShoppingCart, module: 'procurement' },
  { title: 'Stores & Logistics', url: '/stores', icon: Package, module: 'stores' },
  { title: 'Human Resources', url: '/hrm', icon: Users, module: 'hrm' },
  { title: 'Payroll', url: '/payroll', icon: CreditCard, module: 'payroll' },
];

const adminNavItems: NavItem[] = [
  { title: 'User Management', url: '/admin/users', icon: Users, roles: ['admin', 'super_admin'] },
  { title: 'Organization Settings', url: '/admin/organization', icon: Building2, roles: ['admin', 'super_admin'] },
  { title: 'System Settings', url: '/admin/system', icon: Settings, roles: ['super_admin'] },
  { title: 'Audit Logs', url: '/admin/audit', icon: FileText, roles: ['admin', 'super_admin'] },
  { title: 'Security', url: '/admin/security', icon: Shield, roles: ['admin', 'super_admin'] },
];

const utilityNavItems: NavItem[] = [
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { hasModuleAccess, hasRole, userRole } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  
  const getNavClassName = (path: string) =>
    isActive(path) ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50';

  const canAccessItem = (item: NavItem) => {
    if (item.module && !hasModuleAccess(item.module)) return false;
    if (item.roles && !item.roles.some(role => hasRole(role))) return false;
    return true;
  };

  const isMainGroupExpanded = mainNavItems.some((item) => isActive(item.url));
  const isAdminGroupExpanded = adminNavItems.some((item) => isActive(item.url));
  const isUtilityGroupExpanded = utilityNavItems.some((item) => isActive(item.url));

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.filter(canAccessItem).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        {(hasRole('admin') || hasRole('super_admin')) && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.filter(canAccessItem).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url)}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Utility Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Role Badge */}
        {!isCollapsed && userRole && (
          <div className="mt-auto p-4">
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="font-medium">Role: {userRole.role.replace('_', ' ').toUpperCase()}</div>
              {userRole.organization_id && (
                <div className="text-muted-foreground text-xs mt-1">Organization Member</div>
              )}
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
