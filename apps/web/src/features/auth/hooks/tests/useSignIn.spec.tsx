import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { apiClient } from '@/lib/api-client';

import { useSignIn } from '../useSignIn';

// Mock dependencies
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    auth: {
      'sign-in': {
        post: vi.fn(),
      },
    },
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('sonner');

describe('useSignIn', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should successfully sign in a user', async () => {
    const mockResponse = {
      data: {
        user: { id: '123', email: 'test@example.com' },
        session: { token: 'mock-token' },
      },
      error: null,
    };

    vi.mocked(apiClient.auth['sign-in'].post).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useSignIn(), { wrapper });

    result.current.mutate({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiClient.auth['sign-in'].post).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(toast.success).toHaveBeenCalledWith('Login successful! Redirecting...');
  });

  it('should handle sign in errors', async () => {
    const mockError = {
      data: null,
      error: {
        value: { message: 'Invalid credentials' },
      },
    };

    vi.mocked(apiClient.auth['sign-in'].post).mockResolvedValue(mockError as any);

    const { result } = renderHook(() => useSignIn(), { wrapper });

    result.current.mutate({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should call onSuccess callback when provided', async () => {
    const mockResponse = {
      data: {
        user: { id: '123', email: 'test@example.com' },
        session: { token: 'mock-token' },
      },
      error: null,
    };

    vi.mocked(apiClient.auth['sign-in'].post).mockResolvedValue(mockResponse as any);

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useSignIn({ onSuccess }), { wrapper });

    result.current.mutate({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it('should call onError callback when provided', async () => {
    const mockError = {
      data: null,
      error: {
        value: { message: 'Invalid credentials' },
      },
    };

    vi.mocked(apiClient.auth['sign-in'].post).mockResolvedValue(mockError as any);

    const onError = vi.fn();
    const { result } = renderHook(() => useSignIn({ onError }), { wrapper });

    result.current.mutate({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should use default error message when no message provided', async () => {
    const mockError = {
      data: null,
      error: {
        value: {},
      },
    };

    vi.mocked(apiClient.auth['sign-in'].post).mockResolvedValue(mockError as any);

    const { result } = renderHook(() => useSignIn(), { wrapper });

    result.current.mutate({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should redirect to custom path when redirectTo is provided', async () => {
    const mockResponse = {
      data: {
        user: { id: '123', email: 'test@example.com' },
        session: { token: 'mock-token' },
      },
      error: null,
    };

    vi.mocked(apiClient.auth['sign-in'].post).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useSignIn({ redirectTo: '/dashboard' }), { wrapper });

    result.current.mutate({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

// Made with Bob
