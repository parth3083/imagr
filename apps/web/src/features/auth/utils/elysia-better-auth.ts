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
