import { treaty } from '@elysia/eden';

import { app } from '@/app/api/[[...slugs]]/route';

// .api to enter /api prefix
export const api =
  // process is defined on server side and build time
  typeof process !== 'undefined' ? treaty(app).api : treaty<typeof app>('localhost:3001').api;
