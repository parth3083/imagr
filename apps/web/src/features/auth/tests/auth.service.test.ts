import { describe, it, expect, beforeEach, vi } from 'vitest';

import { auth } from '@/lib/auth';

import { AuthService } from '../service';

// Mock the auth library
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signUpEmail: vi.fn(),
      signInEmail: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up a user successfully', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockResult = {
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
        },
        session: {
          token: 'mock-token',
        },
      };

      vi.mocked(auth.api.signUpEmail).mockResolvedValue(mockResult as any);

      const result = await AuthService.signUp(mockUserData);

      expect(auth.api.signUpEmail).toHaveBeenCalledWith({
        body: mockUserData,
      });
      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
    });

    it('should handle sign up errors', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const error = new Error('Email already exists');
      vi.mocked(auth.api.signUpEmail).mockRejectedValue(error);

      const result = await AuthService.signUp(mockUserData);

      expect(result).toEqual({
        success: false,
        error: 'Email already exists',
      });
    });

    it('should handle non-Error exceptions during sign up', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      vi.mocked(auth.api.signUpEmail).mockRejectedValue('Unknown error');

      const result = await AuthService.signUp(mockUserData);

      expect(result).toEqual({
        success: false,
        error: 'Sign up failed',
      });
    });
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResult = {
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
        },
        session: {
          token: 'mock-token',
        },
      };

      vi.mocked(auth.api.signInEmail).mockResolvedValue(mockResult as any);

      const result = await AuthService.signIn(mockCredentials);

      expect(auth.api.signInEmail).toHaveBeenCalledWith({
        body: mockCredentials,
      });
      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
    });

    it('should handle invalid credentials', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      vi.mocked(auth.api.signInEmail).mockRejectedValue(error);

      const result = await AuthService.signIn(mockCredentials);

      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials',
      });
    });

    it('should handle non-Error exceptions during sign in', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      vi.mocked(auth.api.signInEmail).mockRejectedValue('Unknown error');

      const result = await AuthService.signIn(mockCredentials);

      expect(result).toEqual({
        success: false,
        error: 'Sign in failed',
      });
    });
  });

  describe('getSession', () => {
    it('should get session successfully', async () => {
      const mockHeaders = new Headers({
        Authorization: 'Bearer mock-token',
      });

      const mockSession = {
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
        },
        session: {
          token: 'mock-token',
          expiresAt: new Date(),
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any);

      const result = await AuthService.getSession(mockHeaders);

      expect(auth.api.getSession).toHaveBeenCalledWith({ headers: mockHeaders });
      expect(result).toEqual(mockSession);
    });

    it('should return null when session retrieval fails', async () => {
      const mockHeaders = new Headers();

      const error = new Error('No session found');
      vi.mocked(auth.api.getSession).mockRejectedValue(error);

      const result = await AuthService.getSession(mockHeaders);

      expect(result).toBeNull();
    });

    it('should handle expired sessions', async () => {
      const mockHeaders = new Headers({
        Authorization: 'Bearer expired-token',
      });

      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('Session expired'));

      const result = await AuthService.getSession(mockHeaders);

      expect(result).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      const mockHeaders = new Headers({
        Authorization: 'Bearer mock-token',
      });

      vi.mocked(auth.api.signOut).mockResolvedValue(undefined as any);

      const result = await AuthService.signOut(mockHeaders);

      expect(auth.api.signOut).toHaveBeenCalledWith({ headers: mockHeaders });
      expect(result).toEqual({
        success: true,
      });
    });

    it('should handle sign out errors', async () => {
      const mockHeaders = new Headers();

      const error = new Error('Sign out failed');
      vi.mocked(auth.api.signOut).mockRejectedValue(error);

      const result = await AuthService.signOut(mockHeaders);

      expect(result).toEqual({
        success: false,
        error: 'Sign out failed',
      });
    });

    it('should handle non-Error exceptions during sign out', async () => {
      const mockHeaders = new Headers();

      vi.mocked(auth.api.signOut).mockRejectedValue('Unknown error');

      const result = await AuthService.signOut(mockHeaders);

      expect(result).toEqual({
        success: false,
        error: 'Sign out failed',
      });
    });
  });
});

// Made with Bob
