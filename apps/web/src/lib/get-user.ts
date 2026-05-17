import { auth } from '@/lib/auth';

export async function getUser(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error('Unauthorized');
  return session.user;
}
