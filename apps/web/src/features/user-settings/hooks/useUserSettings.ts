'use client';

import { useQuery } from '@tanstack/react-query';

export function useUserSettings() {
  return useQuery<{ hasApiKey: boolean } | null>({
    queryKey: ['user-settings'],
    queryFn: async () => {
      const res = await fetch('/api/user-settings', { credentials: 'include' });
      if (!res.ok) return null;
      return res.json() as Promise<{ hasApiKey: boolean }>;
    },
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
