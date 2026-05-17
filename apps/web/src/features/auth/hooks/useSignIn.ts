import { SignInType } from '@repo/core-types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

interface UseSignInOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

export function useSignIn(options?: UseSignInOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInType) => {
      const { data: result, error } = await apiClient.auth['sign-in'].post(data);
      if (error) {
        const message = (error.value as { message?: string })?.message;
        throw new Error(message || 'Invalid credentials');
      }
      return result;
    },
    onSuccess: () => {
      toast.success('Login successful! Redirecting...');
      options?.onSuccess?.();
      setTimeout(() => {
        router.push(options?.redirectTo || '/dashboard/studio');
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      options?.onError?.(error.message);
    },
  });
}
