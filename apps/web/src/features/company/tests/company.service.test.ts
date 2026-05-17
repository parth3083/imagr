import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import connectDB from '@/db/db';
import { Company } from '@/db/models';

import { CompanyService } from '../service';

// Mock the database connection
vi.mock('@/db/db', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

// Mock the Company model
vi.mock('@/db/models', () => ({
  Company: {
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

describe('CompanyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a company successfully', async () => {
      const mockCompanyData = {
        name: 'Test Company',
        website: 'https://test.com',
      };

      const mockCreatedCompany = {
        _id: '123',
        ...mockCompanyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(Company.create).mockResolvedValue(mockCreatedCompany as any);

      const result = await CompanyService.create(mockCompanyData);

      expect(connectDB).toHaveBeenCalled();
      expect(Company.create).toHaveBeenCalledWith(mockCompanyData);
      expect(result).toEqual({
        success: true,
        data: mockCreatedCompany,
      });
    });

    it('should handle creation errors', async () => {
      const mockCompanyData = {
        name: 'Test Company',
        website: 'https://test.com',
      };

      const error = new Error('Database error');
      vi.mocked(Company.create).mockRejectedValue(error);

      const result = await CompanyService.create(mockCompanyData);

      expect(result).toEqual({
        success: false,
        error: 'Database error',
      });
    });

    it('should handle non-Error exceptions', async () => {
      const mockCompanyData = {
        name: 'Test Company',
        website: 'https://test.com',
      };

      vi.mocked(Company.create).mockRejectedValue('Unknown error');

      const result = await CompanyService.create(mockCompanyData);

      expect(result).toEqual({
        success: false,
        error: 'Failed to create company',
      });
    });
  });

  describe('findAll', () => {
    it('should return all companies sorted by createdAt', async () => {
      const mockCompanies = [
        {
          _id: '123',
          name: 'Company 1',
          website: 'https://company1.com',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date(),
        },
        {
          _id: '456',
          name: 'Company 2',
          website: 'https://company2.com',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        },
      ];

      const mockSort = vi.fn().mockResolvedValue(mockCompanies);
      vi.mocked(Company.find).mockReturnValue({ sort: mockSort } as any);

      const result = await CompanyService.findAll();

      expect(connectDB).toHaveBeenCalled();
      expect(Company.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual({
        success: true,
        data: mockCompanies,
      });
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Database connection failed');
      vi.mocked(Company.find).mockImplementation(() => {
        throw error;
      });

      const result = await CompanyService.findAll();

      expect(result).toEqual({
        success: false,
        error: 'Database connection failed',
      });
    });
  });

  describe('findById', () => {
    it('should return a company by id', async () => {
      const mockCompany = {
        _id: '123',
        name: 'Test Company',
        website: 'https://test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(Company.findById).mockResolvedValue(mockCompany as any);

      const result = await CompanyService.findById('123');

      expect(connectDB).toHaveBeenCalled();
      expect(Company.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual({
        success: true,
        data: mockCompany,
      });
    });

    it('should return null when company not found', async () => {
      vi.mocked(Company.findById).mockResolvedValue(null);

      const result = await CompanyService.findById('999');

      expect(result).toEqual({
        success: true,
        data: null,
      });
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Invalid ID format');
      vi.mocked(Company.findById).mockRejectedValue(error);

      const result = await CompanyService.findById('invalid-id');

      expect(result).toEqual({
        success: false,
        error: 'Invalid ID format',
      });
    });
  });

  describe('update', () => {
    it('should update a company successfully', async () => {
      const updateData = {
        name: 'Updated Company',
        website: 'https://updated.com',
      };

      const mockUpdatedCompany = {
        _id: '123',
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(Company.findByIdAndUpdate).mockResolvedValue(mockUpdatedCompany as any);

      const result = await CompanyService.update('123', updateData);

      expect(connectDB).toHaveBeenCalled();
      expect(Company.findByIdAndUpdate).toHaveBeenCalledWith('123', updateData, {
        new: true,
        runValidators: true,
      });
      expect(result).toEqual({
        success: true,
        data: mockUpdatedCompany,
      });
    });

    it('should handle partial updates', async () => {
      const updateData = { name: 'Updated Name Only' };

      const mockUpdatedCompany = {
        _id: '123',
        name: 'Updated Name Only',
        website: 'https://original.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(Company.findByIdAndUpdate).mockResolvedValue(mockUpdatedCompany as any);

      const result = await CompanyService.update('123', updateData);

      expect(result).toEqual({
        success: true,
        data: mockUpdatedCompany,
      });
    });

    it('should return null when company not found', async () => {
      vi.mocked(Company.findByIdAndUpdate).mockResolvedValue(null);

      const result = await CompanyService.update('999', { name: 'Test' });

      expect(result).toEqual({
        success: true,
        data: null,
      });
    });

    it('should handle update errors', async () => {
      const error = new Error('Validation failed');
      vi.mocked(Company.findByIdAndUpdate).mockRejectedValue(error);

      const result = await CompanyService.update('123', { name: '' });

      expect(result).toEqual({
        success: false,
        error: 'Validation failed',
      });
    });
  });

  describe('delete', () => {
    it('should delete a company successfully', async () => {
      const mockDeletedCompany = {
        _id: '123',
        name: 'Test Company',
        website: 'https://test.com',
      };

      vi.mocked(Company.findByIdAndDelete).mockResolvedValue(mockDeletedCompany as any);

      const result = await CompanyService.delete('123');

      expect(connectDB).toHaveBeenCalled();
      expect(Company.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toEqual({
        success: true,
      });
    });

    it('should handle deletion of non-existent company', async () => {
      vi.mocked(Company.findByIdAndDelete).mockResolvedValue(null);

      const result = await CompanyService.delete('999');

      expect(result).toEqual({
        success: true,
      });
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Database error');
      vi.mocked(Company.findByIdAndDelete).mockRejectedValue(error);

      const result = await CompanyService.delete('123');

      expect(result).toEqual({
        success: false,
        error: 'Database error',
      });
    });
  });
});

// Made with Bob
