import { SignUpType } from '@repo/core-types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { apiClient } from '@/lib/api-client';

interface UseSignUpOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useSignUp(options?: UseSignUpOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpType) => {
      const { data: result, error } = await apiClient.auth['sign-up'].post(data);
      if (error) {
        const message = (error.value as { message?: string })?.message;
        throw new Error(message || 'Failed to create account');
      }
      return result;
    },
    onSuccess: () => {
      options?.onSuccess?.();
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });
}
