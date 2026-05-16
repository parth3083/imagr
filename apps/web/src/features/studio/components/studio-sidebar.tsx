'use client';

import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { Separator } from '@repo/ui/components/ui/separator';
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
  SidebarTrigger,
} from '@repo/ui/components/ui/sidebar';
import {
  Sparkles,
  Sword,
  Palette,
  FolderOpen,
  MoreVertical,
  Settings,
  LogOut,
  Image as ImageIcon,
  PanelLeft,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const workspaceItems = [
  { title: 'Studio', icon: Sparkles, href: '/dashboard/studio' },
  { title: 'Arena', icon: Sword, href: '/dashboard/arena' },
  { title: 'Library', icon: Palette, href: '/dashboard/library' },
  { title: 'Projects', icon: FolderOpen, href: '/dashboard/projects' },
];

export function StudioSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/sign-in');
      } else {
        console.error('Sign out failed');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="border-sidebar-border border-b">
          <div className="flex items-center gap-2 px-3 py-4">
            <Link
              href="/dashboard/studio"
              className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center"
            >
              <div className="from-primary to-primary/80 text-primary-foreground flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm">
                <ImageIcon className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">Imagr</span>
            </Link>
            <div className="ml-auto group-data-[collapsible=icon]:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs font-semibold tracking-wider uppercase">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {workspaceItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
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
              P
            </div>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
              <div className="truncate text-sm font-medium">Parth</div>
              <div className="text-muted-foreground truncate text-xs">parth@example.com</div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMenuOpen(true)}
              className="flex-shrink-0 group-data-[collapsible=icon]:hidden"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account Menu</DialogTitle>
            <DialogDescription>Manage your account settings and preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Link href="/dashboard/settings" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2" size="lg">
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            </Link>
            <Separator />
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2"
              size="lg"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="h-5 w-5" />
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Made with Bob
