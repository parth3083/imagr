import { generateObject } from 'ai';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { PromptService } from '../service';

// Mock the AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock the Google AI provider
vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(() => vi.fn((model: string) => ({ model }))),
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

// Mock system prompt
vi.mock('@/prompts/systemPrompt', () => ({
  ANALYZE_SYSTEM_PROMPT: 'Mock system prompt for analysis',
}));

// Mock prompt utils
vi.mock('../utils/prompt-utils', () => ({
  expandedPromptToText: vi.fn((blueprint) => `Expanded: ${JSON.stringify(blueprint)}`),
}));

describe('PromptService', () => {
  const createEntry = (
    value: string,
    source: 'user_provided' | 'ai_infered' = 'user_provided',
  ) => ({
    value,
    source,
    confidence: 0.9,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getExpandedPrompt', () => {
    it('should successfully expand a prompt', async () => {
      const mockBlueprint = {
        subject: createEntry('futuristic motorcycle'),
        scene: createEntry('rainy city street', 'ai_infered'),
        mood: createEntry('cyberpunk'),
        lighting: createEntry('neon'),
        composition: createEntry('dynamic side view', 'ai_infered'),
        style: createEntry('cinematic concept art'),
        color_palette: createEntry('electric blue and magenta', 'ai_infered'),
        details: createEntry('wet reflections, volumetric fog', 'ai_infered'),
      };

      const mockResult = {
        object: mockBlueprint,
      };

      vi.mocked(generateObject).mockResolvedValue(mockResult as any);

      const result = await PromptService.getExpandedPrompt({
        prompt: 'a futuristic bike in rain',
      });

      expect(generateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: expect.stringContaining('a futuristic bike in rain'),
          system: 'Mock system prompt for analysis',
        }),
      );

      expect(result).toEqual({
        blueprint: mockBlueprint,
        original_prompt: 'a futuristic bike in rain',
        expanded_prompt_text: `Expanded: ${JSON.stringify(mockBlueprint)}`,
      });
    });

    it('should handle empty prompt', async () => {
      const mockBlueprint = {
        subject: createEntry('minimal subject', 'ai_infered'),
        scene: createEntry('minimal scene', 'ai_infered'),
        mood: createEntry('neutral', 'ai_infered'),
        lighting: createEntry('soft', 'ai_infered'),
        composition: createEntry('simple', 'ai_infered'),
        style: createEntry('minimal', 'ai_infered'),
        color_palette: createEntry('neutral', 'ai_infered'),
        details: createEntry('clean', 'ai_infered'),
      };

      const mockResult = {
        object: mockBlueprint,
      };

      vi.mocked(generateObject).mockResolvedValue(mockResult as any);

      const result = await PromptService.getExpandedPrompt({
        prompt: '',
      });

      expect(result.original_prompt).toBe('');
      expect(result.blueprint).toEqual(mockBlueprint);
    });

    it('should throw error when generateObject returns no object', async () => {
      const mockResult = {
        object: null,
      };

      vi.mocked(generateObject).mockResolvedValue(mockResult as any);

      await expect(
        PromptService.getExpandedPrompt({
          prompt: 'test prompt',
        }),
      ).rejects.toThrow('Prompt expansion failed');
    });

    it('should handle AI generation errors', async () => {
      const error = new Error('AI service unavailable');
      vi.mocked(generateObject).mockRejectedValue(error);

      await expect(
        PromptService.getExpandedPrompt({
          prompt: 'test prompt',
        }),
      ).rejects.toThrow('AI service unavailable');
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(generateObject).mockRejectedValue('Unknown error');

      await expect(
        PromptService.getExpandedPrompt({
          prompt: 'test prompt',
        }),
      ).rejects.toThrow('Prompt expansion failed');
    });

    it('should process complex prompts with multiple elements', async () => {
      const mockBlueprint = {
        subject: createEntry('dragon'),
        scene: createEntry('mountain peak at sunset'),
        mood: createEntry('mystical'),
        lighting: createEntry('dramatic sunset'),
        composition: createEntry('heroic wide shot', 'ai_infered'),
        style: createEntry('fantasy art'),
        color_palette: createEntry('amber and crimson', 'ai_infered'),
        details: createEntry('scales, wings, fire breathing, mountain background'),
      };

      const mockResult = {
        object: mockBlueprint,
      };

      vi.mocked(generateObject).mockResolvedValue(mockResult as any);

      const result = await PromptService.getExpandedPrompt({
        prompt: 'a majestic dragon breathing fire on a mountain at sunset',
      });

      expect(result.blueprint).toEqual(mockBlueprint);
      expect(result.original_prompt).toBe(
        'a majestic dragon breathing fire on a mountain at sunset',
      );
    });

    it('should handle prompts with special characters', async () => {
      const mockBlueprint = {
        subject: createEntry('character with symbols'),
        scene: createEntry('minimal backdrop', 'ai_infered'),
        mood: createEntry('calm'),
        lighting: createEntry('natural'),
        composition: createEntry('portrait framing', 'ai_infered'),
        style: createEntry('modern'),
        color_palette: createEntry('neutral tones', 'ai_infered'),
        details: createEntry('special character motifs', 'ai_infered'),
      };

      const mockResult = {
        object: mockBlueprint,
      };

      vi.mocked(generateObject).mockResolvedValue(mockResult as any);

      const result = await PromptService.getExpandedPrompt({
        prompt: 'a character with @#$% symbols!',
      });

      expect(result.original_prompt).toBe('a character with @#$% symbols!');
    });

    it('should preserve original prompt in response', async () => {
      const originalPrompt = 'test prompt with specific wording';
      const mockBlueprint = {
        subject: createEntry('test'),
        scene: createEntry('neutral backdrop', 'ai_infered'),
        mood: createEntry('neutral'),
        lighting: createEntry('basic'),
        composition: createEntry('centered', 'ai_infered'),
        style: createEntry('simple'),
        color_palette: createEntry('balanced tones', 'ai_infered'),
        details: createEntry('standard'),
      };

      const mockResult = {
        object: mockBlueprint,
      };

      vi.mocked(generateObject).mockResolvedValue(mockResult as any);

      const result = await PromptService.getExpandedPrompt({
        prompt: originalPrompt,
      });

      expect(result.original_prompt).toBe(originalPrompt);
    });
  });
});

// Made with Bob
