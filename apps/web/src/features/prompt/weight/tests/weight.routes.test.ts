import { Elysia } from 'elysia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { promptWeighter } from '../index';
import { PromptWeightService } from '../service';

vi.mock('../service', () => ({
  PromptWeightService: {
    generateWeightedPrompt: vi.fn(),
    getErrorStatus: vi.fn((error: { status?: number }) => error.status ?? 500),
    getErrorMessage: vi.fn(
      (error: { message?: string }) => error.message ?? 'Weight generation failed',
    ),
    logError: vi.fn(),
  },
}));

vi.mock('@/features/auth/auth-middleware', () => ({
  authMiddleware: new Elysia(),
}));

const createEntry = (value: string, source: 'user_provided' | 'ai_infered' = 'user_provided') => ({
  value,
  source,
  confidence: 0.9,
});

describe('Prompt Weight Routes', () => {
  let app: ReturnType<typeof createApp>;

  function createApp() {
    return new Elysia().use(promptWeighter);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  it('should generate a weighted prompt from prompt, model, style, and creative tone', async () => {
    const mockResponse = {
      enhancement: {
        blueprint: {
          subject: createEntry('futuristic motorcycle'),
          scene: createEntry('rainy city street', 'ai_infered'),
          mood: createEntry('cyberpunk'),
          lighting: createEntry('neon'),
          composition: createEntry('dynamic side view', 'ai_infered'),
          style: createEntry('cinematic concept art'),
          color_palette: createEntry('electric blue and magenta', 'ai_infered'),
          details: createEntry('wet reflections, volumetric fog', 'ai_infered'),
        },
        original_prompt: 'a futuristic bike in rain',
        expanded_prompt_text: 'expanded prompt',
      },
      weighting: {
        weighted_tokens: [
          { token: 'futuristic motorcycle', weight: 1.4, tier: 'anchor', locked: false },
        ],
        compiled_prompt: '(futuristic motorcycle:1.4)',
        negative_prompt: 'blurry, low quality',
        quality_score: {
          specificity: 90,
          coherence: 92,
          weight_distribution: 88,
          overall: 90,
        },
        lint_warnings: [],
      },
      model_output: {
        positive: 'futuristic motorcycle',
        negative: 'blurry, low quality',
      },
      model_target: 'flux' as const,
      model_name: 'Flux Dev',
      style_name: 'Cinematic',
      creative_tone: 65,
    };

    vi.mocked(PromptWeightService.generateWeightedPrompt).mockResolvedValue(mockResponse);

    const response = await app.handle(
      new Request('http://localhost/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'a futuristic bike in rain',
          model_name: 'Flux Dev',
          style_name: 'Cinematic',
          creative_tone: 65,
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockResponse);
    expect(PromptWeightService.generateWeightedPrompt).toHaveBeenCalledWith({
      prompt: 'a futuristic bike in rain',
      model_name: 'Flux Dev',
      style_name: 'Cinematic',
      creative_tone: 65,
    });
  });

  it('should return the service status and message when model lookup fails', async () => {
    vi.mocked(PromptWeightService.generateWeightedPrompt).mockRejectedValue({
      status: 404,
      message: 'Model "Unknown" not found',
    });

    const response = await app.handle(
      new Request('http://localhost/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'test prompt',
          model_name: 'Unknown',
          style_name: 'Cinematic',
          creative_tone: 50,
        }),
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: 'Model "Unknown" not found' });
  });

  it('should validate the new weighted prompt input shape', async () => {
    const response = await app.handle(
      new Request('http://localhost/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'test prompt',
          model_name: 'Flux Dev',
          style_name: 'Cinematic',
          creative_tone: 120,
        }),
      }),
    );

    expect(response.status).toBe(422);
    expect(PromptWeightService.generateWeightedPrompt).not.toHaveBeenCalled();
  });
});
