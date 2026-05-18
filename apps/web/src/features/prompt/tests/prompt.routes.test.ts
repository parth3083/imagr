import { Elysia } from 'elysia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { promptEnhancer } from '../index';
import { PromptService } from '../service';

// Mock the PromptService
vi.mock('../service', () => ({
  PromptService: {
    getExpandedPrompt: vi.fn(),
  },
}));

// Mock auth middleware
vi.mock('@/features/auth/auth-middleware', () => ({
  authMiddleware: new Elysia(),
}));

describe('Prompt Enhancer Routes', () => {
  let app: Elysia;
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
    app = new Elysia().use(promptEnhancer);
  });

  describe('POST /prompt-enhance', () => {
    it('should enhance a prompt successfully', async () => {
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

      const mockResponse = {
        blueprint: mockBlueprint,
        original_prompt: 'a futuristic bike in rain',
        expanded_prompt_text:
          '(futuristic cyberpunk motorcycle:1.4), (heavy rain, wet reflections:1.2), night scene, neon-lit street, volumetric fog, cinematic lighting, 8k',
      };

      vi.mocked(PromptService.getExpandedPrompt).mockResolvedValue(mockResponse);

      const response = await app.handle(
        new Request('http://localhost/prompt-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'a futuristic bike in rain',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockResponse);
      expect(PromptService.getExpandedPrompt).toHaveBeenCalledWith({
        prompt: 'a futuristic bike in rain',
      });
    });

    it('should handle empty prompt', async () => {
      const response = await app.handle(
        new Request('http://localhost/prompt-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: '',
          }),
        }),
      );

      expect(response.status).toBe(422);
      expect(PromptService.getExpandedPrompt).not.toHaveBeenCalled();
    });

    it('should handle complex prompts with multiple elements', async () => {
      const mockResponse = {
        blueprint: {
          subject: createEntry('dragon'),
          scene: createEntry('mountain peak at sunset'),
          mood: createEntry('mystical'),
          lighting: createEntry('dramatic sunset'),
          composition: createEntry('heroic wide shot', 'ai_infered'),
          style: createEntry('fantasy art'),
          color_palette: createEntry('amber and crimson', 'ai_infered'),
          details: createEntry('scales, wings, fire breathing'),
        },
        original_prompt: 'a majestic dragon breathing fire on a mountain at sunset',
        expanded_prompt_text:
          '(majestic dragon:1.5), (fire breathing:1.3), mountain landscape, dramatic sunset lighting, mystical atmosphere, ultra detailed, fantasy art style, 8k',
      };

      vi.mocked(PromptService.getExpandedPrompt).mockResolvedValue(mockResponse);

      const response = await app.handle(
        new Request('http://localhost/prompt-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'a majestic dragon breathing fire on a mountain at sunset',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.blueprint.subject.value).toBe('dragon');
      expect(data.blueprint.details.value).toContain('fire breathing');
    });

    it('should return 500 when prompt enhancement fails', async () => {
      const error = new Error('AI service unavailable');
      vi.mocked(PromptService.getExpandedPrompt).mockRejectedValue(error);

      const response = await app.handle(
        new Request('http://localhost/prompt-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'test prompt',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'AI service unavailable' });
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(PromptService.getExpandedPrompt).mockRejectedValue('Unknown error');

      const response = await app.handle(
        new Request('http://localhost/prompt-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'test prompt',
          }),
        }),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Prompt expansion failed' });
    });

    it('should handle prompts with special characters', async () => {
      const mockResponse = {
        blueprint: {
          subject: createEntry('character with symbols'),
          scene: createEntry('minimal backdrop', 'ai_infered'),
          mood: createEntry('calm'),
          lighting: createEntry('natural'),
          composition: createEntry('portrait framing', 'ai_infered'),
          style: createEntry('modern'),
          color_palette: createEntry('neutral tones', 'ai_infered'),
          details: createEntry('special character motifs', 'ai_infered'),
        },
        original_prompt: 'a character with @#$% symbols!',
        expanded_prompt_text:
          'character with special symbols, modern style, natural lighting, calm atmosphere, high quality',
      };

      vi.mocked(PromptService.getExpandedPrompt).mockResolvedValue(mockResponse);

      const response = await app.handle(
        new Request('http://localhost/prompt-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'a character with @#$% symbols!',
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.original_prompt).toBe('a character with @#$% symbols!');
    });

    it('should handle very long prompts', async () => {
      const longPrompt = 'a ' + 'very '.repeat(100) + 'long prompt';
      const mockResponse = {
        blueprint: {
          subject: createEntry('complex scene'),
          scene: createEntry('layered environment', 'ai_infered'),
          mood: createEntry('complex'),
          lighting: createEntry('varied'),
          composition: createEntry('panoramic frame', 'ai_infered'),
          style: createEntry('detailed'),
          color_palette: createEntry('broad spectrum', 'ai_infered'),
          details: createEntry('many elements'),
        },
        original_prompt: longPrompt,
        expanded_prompt_text: 'complex detailed scene with many elements',
      };

      vi.mocked(PromptService.getExpandedPrompt).mockResolvedValue(mockResponse);

      const response = await app.handle(
        new Request('http://localhost/prompt-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: longPrompt,
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.original_prompt).toBe(longPrompt);
    });

    it('should preserve original prompt in response', async () => {
      const originalPrompt = 'test prompt with specific wording';
      const mockResponse = {
        blueprint: {
          subject: createEntry('test'),
          scene: createEntry('neutral backdrop', 'ai_infered'),
          mood: createEntry('neutral'),
          lighting: createEntry('basic'),
          composition: createEntry('centered', 'ai_infered'),
          style: createEntry('simple'),
          color_palette: createEntry('balanced tones', 'ai_infered'),
          details: createEntry('standard'),
        },
        original_prompt: originalPrompt,
        expanded_prompt_text: 'expanded version',
      };

      vi.mocked(PromptService.getExpandedPrompt).mockResolvedValue(mockResponse);

      const response = await app.handle(
        new Request('http://localhost/prompt-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: originalPrompt,
          }),
        }),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.original_prompt).toBe(originalPrompt);
    });
  });
});
