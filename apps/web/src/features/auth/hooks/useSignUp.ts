import { SignUpType } from '@repo/core-types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
      toast.success('Account created! Taking you to Studio...');
      options?.onSuccess?.();
      setTimeout(() => {
        router.push('/dashboard/studio');
      }, 1500);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      options?.onError?.(error.message);
    },
  });
}
