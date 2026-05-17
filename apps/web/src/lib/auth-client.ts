import { createAuthClient } from 'better-auth/react';

// In the browser, always use the current origin so the auth client targets
// the same host/port as the running app — avoiding mismatches when the dev
// server runs on a port other than 3000.
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
};

export const authClient = createAuthClient({ baseURL: getBaseUrl() });
