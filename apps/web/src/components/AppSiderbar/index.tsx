import { ThemeToggle } from '@falcojs/ui/components/core/theme-toggle';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@falcojs/ui/components/ui/sidebar';
import { Bird, Clock, LayoutDashboard, ListCheck, Server, Tally4, Workflow } from 'lucide-react';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Workflows',
    url: '/workflows',
    icon: Workflow,
  },
  {
    title: 'Queues',
    url: '/queues',
    icon: Tally4,
  },
  {
    title: 'Jobs',
    url: '/jobs',
    icon: ListCheck,
  },
  {
    title: 'Schedules',
    url: '/schedules',
    icon: Clock,
  },
  {
    title: 'Instances',
    url: '/instances',
    icon: Server,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bird className="size-4" />
            Falco.js
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
