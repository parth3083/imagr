import { Elysia, t } from 'elysia';

import { authMiddleware } from '@/features/auth/auth-middleware';
import { getUser } from '@/lib/get-user';

import { UserSettingsService } from './service';

export const userSettings = new Elysia({ prefix: '/user-settings' })
  .use(authMiddleware)
  .get(
    '/',
    async ({ request }) => {
      const user = await getUser(request.headers);
      return await UserSettingsService.getSettings(user.id);
    },
    {
      response: { 200: t.Object({ hasApiKey: t.Boolean() }) },
    },
  )
  .post(
    '/api-key',
    async ({ body, request, set }) => {
      const user = await getUser(request.headers);
      if (!body.apiKey || body.apiKey.trim().length < 10) {
        set.status = 400;
        return { message: 'Invalid API key' };
      }
      await UserSettingsService.saveApiKey(user.id, body.apiKey.trim());
      return { message: 'API key saved' };
    },
    {
      body: t.Object({ apiKey: t.String() }),
      response: {
        200: t.Object({ message: t.String() }),
        400: t.Object({ message: t.String() }),
      },
    },
  );
