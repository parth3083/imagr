'use client';

import { useQuery } from '@tanstack/react-query';

type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export function useCurrentUser() {
  return useQuery<CurrentUser | null>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      if (!res.ok) return null;
      const data = (await res.json()) as { user?: CurrentUser };
      return data?.user ?? null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
