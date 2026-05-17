import { Elysia } from 'elysia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { style } from '../index';
import { StyleService } from '../service';

vi.mock('../service', () => ({
  StyleService: {
    createWithEnhancedPrompt: vi.fn(),
    listByUser: vi.fn(),
    findByIdForUser: vi.fn(),
    toggleSaved: vi.fn(),
    markAsUsed: vi.fn(),
    deleteById: vi.fn(),
  },
}));

vi.mock('@/features/auth/auth-middleware', () => ({
  authMiddleware: new Elysia().derive(() => ({
    user: { id: 'user-1' },
    session: { id: 'session-1' },
  })),
}));

const toJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('Style Routes', () => {
  let app: Elysia;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Elysia().use(style);
  });

  it('POST /style creates a style using current user', async () => {
    const mockStyle = {
      _id: 'style-1',
      userId: 'user-1',
      name: 'Noir',
      type: 'cinematic',
      basicPrompt: 'moody street photo',
      extendedPrompt: 'extended prompt',
      isSaved: false,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(StyleService.createWithEnhancedPrompt).mockResolvedValue({
      success: true,
      data: mockStyle as never,
    });

    const response = await app.handle(
      new Request('http://localhost/style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Noir', basicPrompt: 'moody street photo' }),
      }),
    );

    expect(response.status).toBe(200);
    expect(StyleService.createWithEnhancedPrompt).toHaveBeenCalledWith({
      userId: 'user-1',
      name: 'Noir',
      basicPrompt: 'moody street photo',
    });

    const data = await response.json();
    expect(data).toEqual(
      toJson({
        success: true,
        data: mockStyle,
      }),
    );
  });

  it('GET /style returns paginated user styles', async () => {
    const payload = {
      items: [
        {
          _id: 'style-1',
          userId: 'user-1',
          name: 'Noir',
          type: 'cinematic',
          basicPrompt: 'moody street photo',
          extendedPrompt: 'extended prompt',
          isSaved: true,
          usageCount: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      hasNext: true,
      nextCursor: 'style-1',
    };

    vi.mocked(StyleService.listByUser).mockResolvedValue({
      success: true,
      data: payload as never,
    });

    const response = await app.handle(new Request('http://localhost/style?limit=10&q=noir'));

    expect(response.status).toBe(200);
    expect(StyleService.listByUser).toHaveBeenCalledWith({
      userId: 'user-1',
      cursor: undefined,
      limit: 10,
      query: 'noir',
    });

    const data = await response.json();
    expect(data).toEqual(
      toJson({
        success: true,
        data: payload,
      }),
    );
  });

  it('PATCH /style/:id/save toggles saved status', async () => {
    const mockStyle = {
      _id: 'style-1',
      userId: 'user-1',
      name: 'Noir',
      type: 'cinematic',
      basicPrompt: 'moody street photo',
      extendedPrompt: 'extended prompt',
      isSaved: true,
      usageCount: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(StyleService.toggleSaved).mockResolvedValue({
      success: true,
      data: mockStyle as never,
    });

    const response = await app.handle(
      new Request('http://localhost/style/style-1/save', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saved: true }),
      }),
    );

    expect(response.status).toBe(200);
    expect(StyleService.toggleSaved).toHaveBeenCalledWith({
      userId: 'user-1',
      id: 'style-1',
      saved: true,
    });
  });

  it('POST /style/:id/use increments usage count', async () => {
    vi.mocked(StyleService.markAsUsed).mockResolvedValue({
      success: true,
      data: { _id: 'style-1', usageCount: 6 },
    });

    const response = await app.handle(
      new Request('http://localhost/style/style-1/use', {
        method: 'POST',
      }),
    );

    expect(response.status).toBe(200);
    expect(StyleService.markAsUsed).toHaveBeenCalledWith({
      userId: 'user-1',
      id: 'style-1',
    });

    const data = await response.json();
    expect(data).toEqual({
      success: true,
      data: {
        _id: 'style-1',
        usageCount: 6,
      },
    });
  });

  it('DELETE /style/:id deletes a style', async () => {
    vi.mocked(StyleService.deleteById).mockResolvedValue({ success: true, data: true });

    const response = await app.handle(
      new Request('http://localhost/style/style-1', { method: 'DELETE' }),
    );

    expect(response.status).toBe(200);
    expect(StyleService.deleteById).toHaveBeenCalledWith({ userId: 'user-1', id: 'style-1' });

    const data = await response.json();
    expect(data).toEqual({ message: 'Style deleted successfully' });
  });

  it('DELETE /style/:id returns 404 when style not found', async () => {
    vi.mocked(StyleService.deleteById).mockResolvedValue({
      success: false,
      error: 'Style not found',
    });

    const response = await app.handle(
      new Request('http://localhost/style/missing-id', { method: 'DELETE' }),
    );

    expect(response.status).toBe(404);
  });
});
