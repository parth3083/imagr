'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type WeightPromptInput = {
  prompt: string;
  model_id: string;
  style_id: string;
  creative_tone: number;
};

export function useWeightPrompt() {
  return useMutation({
    mutationFn: async (input: WeightPromptInput) => {
      const { data, error } = await apiClient.weight.post(input);
      if (error) {
        const message =
          (error.value as { message?: string })?.message ?? 'Failed to generate prompt';
        throw new Error(message);
      }
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
