'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

export type StudioModel = {
  _id: string;
  name: string;
};

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const { data, error } = await apiClient.model.get();
      if (error) {
        const message = (error.value as { message?: string })?.message ?? 'Failed to fetch models';
        throw new Error(message);
      }
      return (data?.data ?? []) as StudioModel[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
