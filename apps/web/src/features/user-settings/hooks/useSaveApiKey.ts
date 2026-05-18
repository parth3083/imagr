'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSaveApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (apiKey: string) => {
      const res = await fetch('/api/user-settings/api-key', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { message: string };
        throw new Error(data.message || 'Failed to save API key');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Gemini API key saved!');
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
