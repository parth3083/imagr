'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import type { ConversationItem } from '../service';

type HistoryResponse = {
  success: true;
  data: {
    items: ConversationItem[];
    hasNext: boolean;
    nextCursor: string | null;
  };
};

export function useHistory() {
  return useInfiniteQuery({
    queryKey: ['history'],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const cursor = typeof pageParam === 'string' ? pageParam : undefined;
      const { data, error } = await apiClient.history.get({ query: { cursor, limit: 15 } });
      if (error) {
        const msg = (error.value as { message?: string })?.message ?? 'Failed to fetch history';
        throw new Error(msg);
      }
      return data as HistoryResponse;
    },
    getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.nextCursor : null),
  });
}
