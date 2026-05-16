'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { Toaster } from 'sonner';

function Provider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" expand={false} richColors closeButton />
      {children}
    </QueryClientProvider>
  );
}

export default Provider;
