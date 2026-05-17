import { Elysia } from 'elysia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { style } from '../index';
import { StyleService } from '../service';

// Mock the StyleService
vi.mock('../service', () => ({
  StyleService: {
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

describe('Style Routes', () => {
  let app: any;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Elysia().use(style);
  });

  describe('POST /style', () => {
    it('should create a new style successfully', async () => {
      const mockStyle = {
        _id: '123',
        name: 'Cinematic',
        styleSystemPrompt: 'Create cinematic images with dramatic lighting',
        modelId: 'model-123',
        tags: ['cinematic', 'dramatic'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(StyleService.create).mockResolvedValue({
        success: true,
        data: mockStyle,
      });

      const response = await app.handle(
        new Request('http://localhost/style', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Cinematic',
            styleSystemPrompt: 'Create cinematic images with dramatic lighting',
            modelId: 'model-123',
            tags: ['cinematic', 'dramatic'],
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockStyle,
        }),
      );
    });

    it('should return 500 when style creation fails', async () => {
      vi.mocked(StyleService.create).mockResolvedValue({
        success: false,
        error: 'Database error',
      });

      const response = await app.handle(
        new Request('http://localhost/style', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Cinematic',
            styleSystemPrompt: 'Test prompt',
            modelId: 'model-123',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database error' });
    });
  });

  describe('GET /style', () => {
    it('should return all styles', async () => {
      const mockStyles = [
        {
          _id: '123',
          name: 'Cinematic',
          styleSystemPrompt: 'Cinematic style',
          modelId: 'model-123',
          tags: ['cinematic'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '456',
          name: 'Photorealistic',
          styleSystemPrompt: 'Photorealistic style',
          modelId: 'model-456',
          tags: ['realistic'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(StyleService.findAll).mockResolvedValue({
        success: true,
        data: mockStyles,
      });

      const response = await app.handle(
        new Request('http://localhost/style', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockStyles,
        }),
      );
    });

    it('should return 500 when fetching styles fails', async () => {
      vi.mocked(StyleService.findAll).mockResolvedValue({
        success: false,
        error: 'Database connection failed',
      });

      const response = await app.handle(
        new Request('http://localhost/style', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database connection failed' });
    });
  });

  describe('GET /style/:id', () => {
    it('should return a style by id', async () => {
      const mockStyle = {
        _id: '123',
        name: 'Cinematic',
        styleSystemPrompt: 'Cinematic style',
        modelId: 'model-123',
        tags: ['cinematic'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(StyleService.findById).mockResolvedValue({
        success: true,
        data: mockStyle,
      });

      const response = await app.handle(
        new Request('http://localhost/style/123', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockStyle,
        }),
      );
    });

    it('should return 404 when style not found', async () => {
      vi.mocked(StyleService.findById).mockResolvedValue({
        success: true,
        data: null,
      });

      const response = await app.handle(
        new Request('http://localhost/style/999', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'Style not found' });
    });
  });

  describe('PUT /style/:id', () => {
    it('should update a style successfully', async () => {
      const mockUpdatedStyle = {
        _id: '123',
        name: 'Updated Cinematic',
        styleSystemPrompt: 'Updated prompt',
        modelId: 'model-123',
        tags: ['cinematic', 'updated'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(StyleService.update).mockResolvedValue({
        success: true,
        data: mockUpdatedStyle,
      });

      const response = await app.handle(
        new Request('http://localhost/style/123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Updated Cinematic',
            styleSystemPrompt: 'Updated prompt',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockUpdatedStyle,
        }),
      );
    });

    it('should return 404 when updating non-existent style', async () => {
      vi.mocked(StyleService.update).mockResolvedValue({
        success: true,
        data: null,
      });

      const response = await app.handle(
        new Request('http://localhost/style/999', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Updated Style',
          }),
        }),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'Style not found' });
    });
  });

  describe('DELETE /style/:id', () => {
    it('should delete a style successfully', async () => {
      vi.mocked(StyleService.delete).mockResolvedValue({
        success: true,
      });

      const response = await app.handle(
        new Request('http://localhost/style/123', {
          method: 'DELETE',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ message: 'Style deleted successfully' });
    });

    it('should return 500 when deletion fails', async () => {
      vi.mocked(StyleService.delete).mockResolvedValue({
        success: false,
        error: 'Deletion failed',
      });

      const response = await app.handle(
        new Request('http://localhost/style/123', {
          method: 'DELETE',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Deletion failed' });
    });
  });
});

// Made with Bob
