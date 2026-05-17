'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
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
} from '@repo/ui/components/ui/sidebar';
import { useQueryClient } from '@tanstack/react-query';
import { History, Image as ImageIcon, LogOut, MoreVertical, Palette, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

const workspaceItems = [
  { title: 'Studio', icon: Sparkles, href: '/dashboard/studio' },
  { title: 'Styles', icon: Palette, href: '/dashboard/library' },
  { title: 'History', icon: History, href: '/dashboard/history' },
];

export function StudioSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const displayName = user?.name || '';
  const displayEmail = user?.email || '';
  const initials = displayName.charAt(0).toUpperCase() || '?';

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        queryClient.clear();
      }
    } finally {
      router.push('/');
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-2 px-3 py-4">
          <Link href="/dashboard/studio" className="flex items-center gap-2">
            <div className="from-primary to-primary/80 text-primary-foreground flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm">
              <ImageIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">Imagr</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold tracking-wider uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-sm font-medium">{displayName}</div>
            <div className="text-muted-foreground truncate text-xs">{displayEmail}</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-accent flex-shrink-0 rounded-md p-1 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-40">
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
