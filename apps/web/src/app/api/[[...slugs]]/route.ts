import { Elysia } from 'elysia';
import prometheusPlugin from 'elysia-prometheus';

import { auth } from '@/features/auth';
import { betterAuth } from '@/features/auth/utils/elysia-better-auth';
import { company } from '@/features/company';
import { history } from '@/features/history';
import { lockWord } from '@/features/lock-word';
import { aiModel } from '@/features/model';
import { promptEnhancer } from '@/features/prompt';
import { promptWeighter } from '@/features/prompt/weight';
import { style } from '@/features/style';
import { userSettings } from '@/features/user-settings';

export const app = new Elysia({ prefix: '/api' })
  .use(
    prometheusPlugin({
      metricsPath: '/metrics',
      staticLabels: { service: 'imagr' },
      dynamicLabels: {
        userAgent: (ctx) => ctx.request.headers.get('user-agent') ?? 'unknown',
      },
      durationBuckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10],
      useRoutePath: true,
    }),
  )
  .use(betterAuth)
  .use(auth)
  .use(company)
  .use(aiModel)
  .use(style)
  .use(lockWord)
  .use(promptEnhancer)
  .use(promptWeighter)
  .use(history)
  .use(userSettings);
// .use(monitoring);

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;
