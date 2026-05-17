import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCreateStyle, useInfiniteStyles } from '../useStyles';

const mockStyleGet = vi.fn();
const mockStylePost = vi.fn();
const mockStyleById = vi.fn();

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    style: Object.assign((params: { id: string }) => mockStyleById(params), {
      get: mockStyleGet,
      post: mockStylePost,
    }),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('style hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStyleGet.mockReset();
    mockStylePost.mockReset();
    mockStyleById.mockReset();

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

  it('loads styles with useInfiniteStyles', async () => {
    mockStyleGet.mockResolvedValue({
      data: {
        success: true,
        data: {
          items: [
            {
              _id: 'style-1',
              userId: 'user-1',
              name: 'Noir',
              type: 'cinematic',
              basicPrompt: 'prompt',
              extendedPrompt: 'extended',
              isSaved: false,
              usageCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          hasNext: false,
          nextCursor: null,
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useInfiniteStyles(''), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockStyleGet).toHaveBeenCalledTimes(1);
    expect(result.current.data?.pages[0].data.items).toHaveLength(1);
  });

  it('creates styles with useCreateStyle', async () => {
    mockStylePost.mockResolvedValue({
      data: {
        success: true,
        data: {
          _id: 'style-1',
          userId: 'user-1',
          name: 'Noir',
          type: 'cinematic',
          basicPrompt: 'prompt',
          extendedPrompt: 'extended',
          isSaved: false,
          usageCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useCreateStyle(), { wrapper });

    result.current.mutate({
      name: 'Noir',
      basicPrompt: 'prompt',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockStylePost).toHaveBeenCalledWith({
      name: 'Noir',
      basicPrompt: 'prompt',
    });
    expect(toast.success).toHaveBeenCalledWith('Style created');
  });
});
