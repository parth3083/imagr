'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

export type StudioStyle = {
  _id: string;
  name: string;
};

export function useStylesList() {
  return useQuery({
    queryKey: ['styles-list'],
    queryFn: async () => {
      const { data, error } = await apiClient.style.get({
        query: { limit: 50 },
      });
      if (error) {
        const message = (error.value as { message?: string })?.message ?? 'Failed to fetch styles';
        throw new Error(message);
      }
      return (data?.data?.items ?? []) as StudioStyle[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
