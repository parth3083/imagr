import { Elysia } from 'elysia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { lockWord } from '../index';
import { LockWordService } from '../service';

// Mock the LockWordService
vi.mock('../service', () => ({
  LockWordService: {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock auth middleware
vi.mock('@/features/auth/auth-middleware', () => ({
  authMiddleware: new Elysia(),
}));

const toJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('Lock Word Routes', () => {
  let app: Elysia;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Elysia().use(lockWord);
  });

  describe('POST /lock-word', () => {
    it('should create a new lock word successfully', async () => {
      const mockLockWord = {
        _id: '123',
        word: 'dragon',
        format: '(dragon:1.5)',
        styleId: 'style-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(LockWordService.create).mockResolvedValue({
        success: true,
        data: mockLockWord,
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word: 'dragon',
            format: '(dragon:1.5)',
            styleId: 'style-123',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockLockWord,
        }),
      );
      expect(LockWordService.create).toHaveBeenCalledWith({
        word: 'dragon',
        format: '(dragon:1.5)',
        styleId: 'style-123',
      });
    });

    it('should return 500 when lock word creation fails', async () => {
      vi.mocked(LockWordService.create).mockResolvedValue({
        success: false,
        error: 'Database error',
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word: 'dragon',
            format: '(dragon:1.5)',
            styleId: 'style-123',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database error' });
    });
  });

  describe('GET /lock-word', () => {
    it('should return all lock words', async () => {
      const mockLockWords = [
        {
          _id: '123',
          word: 'dragon',
          format: '(dragon:1.5)',
          styleId: 'style-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '456',
          word: 'sunset',
          format: '(sunset:1.3)',
          styleId: 'style-456',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(LockWordService.findAll).mockResolvedValue({
        success: true,
        data: mockLockWords,
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockLockWords,
        }),
      );
      expect(LockWordService.findAll).toHaveBeenCalled();
    });

    it('should return 500 when fetching lock words fails', async () => {
      vi.mocked(LockWordService.findAll).mockResolvedValue({
        success: false,
        error: 'Database connection failed',
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database connection failed' });
    });
  });

  describe('GET /lock-word/:id', () => {
    it('should return a lock word by id', async () => {
      const mockLockWord = {
        _id: '123',
        word: 'dragon',
        format: '(dragon:1.5)',
        styleId: 'style-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(LockWordService.findById).mockResolvedValue({
        success: true,
        data: mockLockWord,
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word/123', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockLockWord,
        }),
      );
      expect(LockWordService.findById).toHaveBeenCalledWith('123');
    });

    it('should return 404 when lock word not found', async () => {
      vi.mocked(LockWordService.findById).mockResolvedValue({
        success: true,
        data: null,
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word/999', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'Lock word not found' });
    });

    it('should return 500 when database error occurs', async () => {
      vi.mocked(LockWordService.findById).mockResolvedValue({
        success: false,
        error: 'Database error',
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word/123', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database error' });
    });
  });

  describe('PUT /lock-word/:id', () => {
    it('should update a lock word successfully', async () => {
      const mockUpdatedLockWord = {
        _id: '123',
        word: 'dragon',
        format: '(dragon:2.0)',
        styleId: 'style-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(LockWordService.update).mockResolvedValue({
        success: true,
        data: mockUpdatedLockWord,
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word/123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            format: '(dragon:2.0)',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockUpdatedLockWord,
        }),
      );
      expect(LockWordService.update).toHaveBeenCalledWith('123', {
        format: '(dragon:2.0)',
      });
    });

    it('should return 404 when updating non-existent lock word', async () => {
      vi.mocked(LockWordService.update).mockResolvedValue({
        success: true,
        data: null,
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word/999', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            format: '(updated:1.0)',
          }),
        }),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'Lock word not found' });
    });

    it('should return 500 when update fails', async () => {
      vi.mocked(LockWordService.update).mockResolvedValue({
        success: false,
        error: 'Update failed',
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word/123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            format: '(updated:1.0)',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Update failed' });
    });
  });

  describe('DELETE /lock-word/:id', () => {
    it('should delete a lock word successfully', async () => {
      vi.mocked(LockWordService.delete).mockResolvedValue({
        success: true,
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word/123', {
          method: 'DELETE',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ message: 'Lock word deleted successfully' });
      expect(LockWordService.delete).toHaveBeenCalledWith('123');
    });

    it('should return 500 when deletion fails', async () => {
      vi.mocked(LockWordService.delete).mockResolvedValue({
        success: false,
        error: 'Deletion failed',
      });

      const response = await app.handle(
        new Request('http://localhost/lock-word/123', {
          method: 'DELETE',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Deletion failed' });
    });
  });
});
