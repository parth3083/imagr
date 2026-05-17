'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

export type LibraryStyle = {
  _id: string;
  userId: string;
  name: string;
  type: string;
  basicPrompt: string;
  extendedPrompt: string;
  isSaved: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
};

type ListStylesResponse = {
  success: true;
  data: {
    items: LibraryStyle[];
    hasNext: boolean;
    nextCursor: string | null;
  };
};

const stylesQueryKey = (search: string) => ['styles', search] as const;

export function useInfiniteStyles(search: string) {
  return useInfiniteQuery({
    queryKey: stylesQueryKey(search),
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const cursor = typeof pageParam === 'string' ? pageParam : undefined;

      const { data, error } = await apiClient.style.get({
        query: {
          q: search || undefined,
          cursor,
          limit: 12,
        },
      });

      if (error) {
        const message = (error.value as { message?: string })?.message ?? 'Failed to fetch styles';
        throw new Error(message);
      }

      return data as ListStylesResponse;
    },
    getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.nextCursor : null),
  });
}

export function useCreateStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; basicPrompt: string }) => {
      const { data, error } = await apiClient.style.post(payload);
      if (error) {
        const message = (error.value as { message?: string })?.message ?? 'Failed to create style';
        throw new Error(message);
      }
      return data;
    },
    onSuccess: async () => {
      toast.success('Style created');
      await queryClient.invalidateQueries({ queryKey: ['styles'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useToggleSaveStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; saved: boolean }) => {
      const { data, error } = await apiClient
        .style({ id: payload.id })
        .save.patch({ saved: payload.saved });

      if (error) {
        const message =
          (error.value as { message?: string })?.message ?? 'Failed to update save status';
        throw new Error(message);
      }

      return data;
    },
    onSuccess: async (_data, payload) => {
      toast.success(payload.saved ? 'Style saved' : 'Style removed');
      await queryClient.invalidateQueries({ queryKey: ['styles'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUseStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string }) => {
      const { data, error } = await apiClient.style({ id: payload.id }).use.post();

      if (error) {
        const message =
          (error.value as { message?: string })?.message ?? 'Failed to mark style as used';
        throw new Error(message);
      }

      return data;
    },
    onSuccess: async () => {
      toast.success('Style usage updated');
      await queryClient.invalidateQueries({ queryKey: ['styles'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string }) => {
      const { data, error } = await apiClient.style({ id: payload.id }).delete();

      if (error) {
        const message = (error.value as { message?: string })?.message ?? 'Failed to delete style';
        throw new Error(message);
      }

      return data;
    },
    onSuccess: async () => {
      toast.success('Style deleted');
      await queryClient.invalidateQueries({ queryKey: ['styles'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
