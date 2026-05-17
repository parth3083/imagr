import { SignInType } from '@repo/core-types/auth';

import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';

export abstract class AuthService {
  // Function to sign up the user
  static async signUp({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      });
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      logger.error(`Failed to sign up user : ${error}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      };
    }
  }

  // Function for signing in the user
  static async signIn({ email, password }: SignInType) {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      return { success: true, data: result };
    } catch (error) {
      logger.error(`Failed to login user : ${error}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      };
    }
  }

  // Function to get session
  static async getSession(headers: Headers) {
    try {
      const session = await auth.api.getSession({ headers });
      return session;
    } catch (error) {
      logger.error(`Failed to get session : ${error}`);
      return null;
    }
  }

  // Function to sign out the user
  static async signOut(headers: Headers) {
    try {
      await auth.api.signOut({ headers });
      return { success: true };
    } catch (error) {
      logger.error(`Failed to sign out user : ${error}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      };
    }
  }
}
