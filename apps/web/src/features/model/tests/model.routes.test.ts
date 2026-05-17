import { Elysia } from 'elysia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { aiModel } from '../index';
import { AiModelService } from '../service';

// Mock the AiModelService
vi.mock('../service', () => ({
  AiModelService: {
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
const createApp = () => new Elysia().use(aiModel);

describe('AI Model Routes', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  describe('POST /model', () => {
    it('should create a new AI model successfully', async () => {
      const mockModel = {
        _id: '123',
        name: 'GPT-4',
        companyId: 'company-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(AiModelService.create).mockResolvedValue({
        success: true,
        data: mockModel,
      });

      const response = await app.handle(
        new Request('http://localhost/model', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'GPT-4',
            companyId: 'company-123',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockModel,
        }),
      );
      expect(AiModelService.create).toHaveBeenCalledWith({
        name: 'GPT-4',
        companyId: 'company-123',
      });
    });

    it('should return 500 when model creation fails', async () => {
      vi.mocked(AiModelService.create).mockResolvedValue({
        success: false,
        error: 'Database error',
      });

      const response = await app.handle(
        new Request('http://localhost/model', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'GPT-4',
            companyId: 'company-123',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database error' });
    });
  });

  describe('GET /model', () => {
    it('should return all AI models', async () => {
      const mockModels = [
        {
          _id: '123',
          name: 'GPT-4',
          companyId: 'company-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '456',
          name: 'Claude',
          companyId: 'company-456',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(AiModelService.findAll).mockResolvedValue({
        success: true,
        data: mockModels,
      });

      const response = await app.handle(
        new Request('http://localhost/model', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockModels,
        }),
      );
      expect(AiModelService.findAll).toHaveBeenCalled();
    });

    it('should return 500 when fetching models fails', async () => {
      vi.mocked(AiModelService.findAll).mockResolvedValue({
        success: false,
        error: 'Database connection failed',
      });

      const response = await app.handle(
        new Request('http://localhost/model', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database connection failed' });
    });
  });

  describe('GET /model/:id', () => {
    it('should return a model by id', async () => {
      const mockModel = {
        _id: '123',
        name: 'GPT-4',
        companyId: 'company-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(AiModelService.findById).mockResolvedValue({
        success: true,
        data: mockModel,
      });

      const response = await app.handle(
        new Request('http://localhost/model/123', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockModel,
        }),
      );
      expect(AiModelService.findById).toHaveBeenCalledWith('123');
    });

    it('should return 404 when model not found', async () => {
      vi.mocked(AiModelService.findById).mockResolvedValue({
        success: true,
        data: null,
      });

      const response = await app.handle(
        new Request('http://localhost/model/999', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'Model not found' });
    });

    it('should return 500 when database error occurs', async () => {
      vi.mocked(AiModelService.findById).mockResolvedValue({
        success: false,
        error: 'Database error',
      });

      const response = await app.handle(
        new Request('http://localhost/model/123', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database error' });
    });
  });

  describe('PUT /model/:id', () => {
    it('should update a model successfully', async () => {
      const mockUpdatedModel = {
        _id: '123',
        name: 'GPT-4 Turbo',
        companyId: 'company-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(AiModelService.update).mockResolvedValue({
        success: true,
        data: mockUpdatedModel,
      });

      const response = await app.handle(
        new Request('http://localhost/model/123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'GPT-4 Turbo',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockUpdatedModel,
        }),
      );
      expect(AiModelService.update).toHaveBeenCalledWith('123', {
        name: 'GPT-4 Turbo',
      });
    });

    it('should return 404 when updating non-existent model', async () => {
      vi.mocked(AiModelService.update).mockResolvedValue({
        success: true,
        data: null,
      });

      const response = await app.handle(
        new Request('http://localhost/model/999', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Updated Model',
          }),
        }),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'Model not found' });
    });

    it('should return 500 when update fails', async () => {
      vi.mocked(AiModelService.update).mockResolvedValue({
        success: false,
        error: 'Update failed',
      });

      const response = await app.handle(
        new Request('http://localhost/model/123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Updated Model',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Update failed' });
    });
  });

  describe('DELETE /model/:id', () => {
    it('should delete a model successfully', async () => {
      vi.mocked(AiModelService.delete).mockResolvedValue({
        success: true,
      });

      const response = await app.handle(
        new Request('http://localhost/model/123', {
          method: 'DELETE',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ message: 'Model deleted successfully' });
      expect(AiModelService.delete).toHaveBeenCalledWith('123');
    });

    it('should return 500 when deletion fails', async () => {
      vi.mocked(AiModelService.delete).mockResolvedValue({
        success: false,
        error: 'Deletion failed',
      });

      const response = await app.handle(
        new Request('http://localhost/model/123', {
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
