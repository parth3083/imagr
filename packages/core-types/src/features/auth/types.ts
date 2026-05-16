import { z } from 'zod';

import type { SIGN_IN_SCHEMA, SIGN_UP_SCHEMA } from './schema';

export type SignInSchemaType = z.infer<typeof SIGN_IN_SCHEMA>;
export type SignUpSchemaType = z.infer<typeof SIGN_UP_SCHEMA>;
