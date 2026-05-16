import Elysia from 'elysia';

import { auth } from '@/lib/auth';

export const authMiddleware = new Elysia({ name: 'auth-middleware' }).derive(
  async ({ request, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      set.status = 401;
      throw new Error('Unauthorized - Please sign in');
    }

    return {
      user: session.user,
      session: session.session,
    };
  },
);
