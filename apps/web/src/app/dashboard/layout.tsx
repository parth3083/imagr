import { SidebarProvider, SidebarInset } from '@repo/ui/components/ui/sidebar';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';

import { StudioSidebar } from '@/features/studio/components/studio-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider open={true}>
        <StudioSidebar />
        <SidebarInset className="flex flex-col">{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
