import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';

// Create a custom render function that includes providers
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Mock database connection
export const mockDB = {
  connect: vi.fn().mockResolvedValue(true),
  disconnect: vi.fn().mockResolvedValue(true),
};

// Mock Mongoose models
export const createMockModel = <T,>(data: T) => ({
  create: vi.fn().mockResolvedValue(data),
  find: vi.fn().mockReturnValue({
    sort: vi.fn().mockResolvedValue([data]),
  }),
  findById: vi.fn().mockResolvedValue(data),
  findByIdAndUpdate: vi.fn().mockResolvedValue(data),
  findByIdAndDelete: vi.fn().mockResolvedValue(data),
});

// Helper to create mock Elysia context
export const createMockElysiaContext = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  set: {
    status: 200,
    headers: {},
  },
  ...overrides,
});

export * from '@testing-library/react';

// Made with Bob
