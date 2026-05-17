import cors from '@elysiajs/cors';
import Elysia from 'elysia';

import { auth } from '@/lib/auth';

export const betterAuth = new Elysia({ name: 'better-auth' })
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  // Mount the full Better Auth handler so OAuth flows (/api/auth/sign-in/social,
  // /api/auth/callback/*, etc.) are accessible. The hand-crafted email routes in
  // features/auth/index.ts take priority for those specific paths; this catch-all
  // covers everything else Better Auth needs (OAuth, session, CSRF, etc.).
  .all('/auth/*', ({ request }) => auth.handler(request))
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) return status(401);
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
