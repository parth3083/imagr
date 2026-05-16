import { treaty } from '@elysia/eden';

import type { app } from '@/app/api/[[...slugs]]/route';

// Client-side API client - only uses types, not the actual server implementation
// Use window.location.origin for client-side to ensure correct URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return window.location.origin;
  }
  // SSR should use localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

export const apiClient = treaty<typeof app>(getBaseUrl()).api;

// Made with Bob
