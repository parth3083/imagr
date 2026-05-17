import { generateObject } from 'ai';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import connectDB from '@/db/db';
import { LockWord, Model, Style } from '@/db/models';
import { formatForModel } from '@/lib/model-router';

import { PromptService } from '../../service';
import { PromptWeightService } from '../service';

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(() => vi.fn((model: string) => ({ model }))),
}));

vi.mock('@/db/db', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/db/models', () => ({
  Model: {
    findOne: vi.fn(),
  },
  Style: {
    findOne: vi.fn(),
  },
  LockWord: {
    find: vi.fn(),
  },
}));

vi.mock('@/lib/model-router', () => ({
  formatForModel: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

vi.mock('@/prompts/weightSystemPrompt', () => ({
  WEIGHT_SYSTEM_PROMPT: 'Mock weight system prompt',
}));

vi.mock('../../service', () => ({
  PromptService: {
    getExpandedPrompt: vi.fn(),
  },
}));

const createEntry = (value: string, source: 'user_provided' | 'ai_infered' = 'user_provided') => ({
  value,
  source,
  confidence: 0.9,
});

describe('PromptWeightService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should run enhancement first and then generate model-formatted weighted output', async () => {
    const enhancement = {
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
    };

    const weightedOutput = {
      weighted_tokens: [
        { token: 'futuristic motorcycle', weight: 1.4, tier: 'anchor' as const, locked: false },
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
    };

    vi.mocked(PromptService.getExpandedPrompt).mockResolvedValue(enhancement);
    vi.mocked(Model.findOne).mockResolvedValue({ _id: 'model-1', name: 'Flux Dev' } as never);
    vi.mocked(Style.findOne).mockResolvedValue({
      _id: 'style-1',
      name: 'Cinematic',
      styleSystemPrompt: 'Cinematic style weighting',
    } as never);

    const select = vi
      .fn()
      .mockResolvedValue([{ word: 'volumetric fog', format: '(volumetric fog:1.2)' }]);
    vi.mocked(LockWord.find).mockReturnValue({ select } as never);
    vi.mocked(generateObject).mockResolvedValue({ object: weightedOutput } as never);
    vi.mocked(formatForModel).mockReturnValue({
      positive: 'futuristic motorcycle',
      negative: 'blurry, low quality',
    });

    const result = await PromptWeightService.generateWeightedPrompt({
      prompt: 'a futuristic bike in rain',
      model_name: 'Flux Dev',
      style_name: 'Cinematic',
      creative_tone: 65,
    });

    expect(connectDB).toHaveBeenCalled();
    expect(PromptService.getExpandedPrompt).toHaveBeenCalledWith({
      prompt: 'a futuristic bike in rain',
    });
    expect(Model.findOne).toHaveBeenCalled();
    expect(Style.findOne).toHaveBeenCalled();
    expect(LockWord.find).toHaveBeenCalledWith({ styleId: 'style-1' });
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        system: 'Mock weight system prompt',
        prompt: expect.stringContaining('"name":"Cinematic"'),
      }),
    );
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('"max":1.36'),
      }),
    );
    expect(formatForModel).toHaveBeenCalledWith(expect.any(Array), 'blurry, low quality', 'flux');
    expect(result.enhancement).toEqual(enhancement);
    expect(result.model_target).toBe('flux');
    expect(result.creative_tone).toBe(65);
  });

  it('should throw a 404-style error when the model does not exist', async () => {
    vi.mocked(PromptService.getExpandedPrompt).mockResolvedValue({
      blueprint: {
        subject: createEntry('test'),
        scene: createEntry('scene'),
        mood: createEntry('mood'),
        lighting: createEntry('lighting'),
        composition: createEntry('composition'),
        style: createEntry('style'),
        color_palette: createEntry('palette'),
        details: createEntry('details'),
      },
      original_prompt: 'test prompt',
      expanded_prompt_text: 'expanded prompt',
    });
    vi.mocked(Model.findOne).mockResolvedValue(null);

    await expect(
      PromptWeightService.generateWeightedPrompt({
        prompt: 'test prompt',
        model_name: 'Missing Model',
        style_name: 'Cinematic',
        creative_tone: 40,
      }),
    ).rejects.toThrow('Model "Missing Model" not found');
  });
});
