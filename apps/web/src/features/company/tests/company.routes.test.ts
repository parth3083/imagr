import { Elysia } from 'elysia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { company } from '../index';
import { CompanyService } from '../service';

// Mock the CompanyService
vi.mock('../service', () => ({
  CompanyService: {
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

describe('Company Routes', () => {
  let app: Elysia;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Elysia().use(company);
  });

  describe('POST /company', () => {
    it('should create a new company successfully', async () => {
      const mockCompany = {
        _id: '123',
        name: 'Test Company',
        website: 'https://test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(CompanyService.create).mockResolvedValue({
        success: true,
        data: mockCompany,
      });

      const response = await app.handle(
        new Request('http://localhost/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Company',
            website: 'https://test.com',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockCompany,
        }),
      );
      expect(CompanyService.create).toHaveBeenCalledWith({
        name: 'Test Company',
        website: 'https://test.com',
      });
    });

    it('should return 500 when company creation fails', async () => {
      vi.mocked(CompanyService.create).mockResolvedValue({
        success: false,
        error: 'Database error',
      });

      const response = await app.handle(
        new Request('http://localhost/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Company',
            website: 'https://test.com',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database error' });
    });
  });

  describe('GET /company', () => {
    it('should return all companies', async () => {
      const mockCompanies = [
        {
          _id: '123',
          name: 'Company 1',
          website: 'https://company1.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '456',
          name: 'Company 2',
          website: 'https://company2.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(CompanyService.findAll).mockResolvedValue({
        success: true,
        data: mockCompanies,
      });

      const response = await app.handle(
        new Request('http://localhost/company', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockCompanies,
        }),
      );
      expect(CompanyService.findAll).toHaveBeenCalled();
    });

    it('should return 500 when fetching companies fails', async () => {
      vi.mocked(CompanyService.findAll).mockResolvedValue({
        success: false,
        error: 'Database connection failed',
      });

      const response = await app.handle(
        new Request('http://localhost/company', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database connection failed' });
    });
  });

  describe('GET /company/:id', () => {
    it('should return a company by id', async () => {
      const mockCompany = {
        _id: '123',
        name: 'Test Company',
        website: 'https://test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(CompanyService.findById).mockResolvedValue({
        success: true,
        data: mockCompany,
      });

      const response = await app.handle(
        new Request('http://localhost/company/123', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockCompany,
        }),
      );
      expect(CompanyService.findById).toHaveBeenCalledWith('123');
    });

    it('should return 404 when company not found', async () => {
      vi.mocked(CompanyService.findById).mockResolvedValue({
        success: true,
        data: null,
      });

      const response = await app.handle(
        new Request('http://localhost/company/999', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'Company not found' });
    });

    it('should return 500 when database error occurs', async () => {
      vi.mocked(CompanyService.findById).mockResolvedValue({
        success: false,
        error: 'Database error',
      });

      const response = await app.handle(
        new Request('http://localhost/company/123', {
          method: 'GET',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Database error' });
    });
  });

  describe('PUT /company/:id', () => {
    it('should update a company successfully', async () => {
      const mockUpdatedCompany = {
        _id: '123',
        name: 'Updated Company',
        website: 'https://updated.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(CompanyService.update).mockResolvedValue({
        success: true,
        data: mockUpdatedCompany,
      });

      const response = await app.handle(
        new Request('http://localhost/company/123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Updated Company',
            website: 'https://updated.com',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        toJson({
          success: true,
          data: mockUpdatedCompany,
        }),
      );
      expect(CompanyService.update).toHaveBeenCalledWith('123', {
        name: 'Updated Company',
        website: 'https://updated.com',
      });
    });

    it('should return 404 when updating non-existent company', async () => {
      vi.mocked(CompanyService.update).mockResolvedValue({
        success: true,
        data: null,
      });

      const response = await app.handle(
        new Request('http://localhost/company/999', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Updated Company',
          }),
        }),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'Company not found' });
    });

    it('should return 500 when update fails', async () => {
      vi.mocked(CompanyService.update).mockResolvedValue({
        success: false,
        error: 'Update failed',
      });

      const response = await app.handle(
        new Request('http://localhost/company/123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Updated Company',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Update failed' });
    });
  });

  describe('DELETE /company/:id', () => {
    it('should delete a company successfully', async () => {
      vi.mocked(CompanyService.delete).mockResolvedValue({
        success: true,
      });

      const response = await app.handle(
        new Request('http://localhost/company/123', {
          method: 'DELETE',
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ message: 'Company deleted successfully' });
      expect(CompanyService.delete).toHaveBeenCalledWith('123');
    });

    it('should return 500 when deletion fails', async () => {
      vi.mocked(CompanyService.delete).mockResolvedValue({
        success: false,
        error: 'Deletion failed',
      });

      const response = await app.handle(
        new Request('http://localhost/company/123', {
          method: 'DELETE',
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Deletion failed' });
    });
  });
});
