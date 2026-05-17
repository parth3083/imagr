import type { WeightedToken } from '@repo/core-types/prompt';

export type ModelTarget = 'stable_diffusion' | 'flux' | 'comfyui' | 'gpt_image';

export interface ModelFormattedOutput {
  positive: string;
  negative: string;
}

// ─── Stable Diffusion & ComfyUI ───────────────────────────────────────────────

function formatForSD(tokens: WeightedToken[], negativePrompt: string): ModelFormattedOutput {
  const sorted = [...tokens].sort((a, b) => b.weight - a.weight);
  const positive = sorted.map((t) => `(${t.token}:${t.weight.toFixed(1)})`).join(', ');
  return { positive, negative: negativePrompt };
}

// ─── FLUX ─────────────────────────────────────────────────────────────────────

function formatForFlux(tokens: WeightedToken[], negativePrompt: string): ModelFormattedOutput {
  // Sort by weight descending — anchor tokens lead the sentence naturally.
  const sorted = [...tokens].sort((a, b) => b.weight - a.weight);
  const positive = sorted.map((t) => t.token).join(', ');

  // Strip parenthetical weight syntax — FLUX uses plain text.
  const plainNegative = negativePrompt
    .replace(/\(([^:)]+):[0-9.]+\)/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return { positive, negative: plainNegative };
}

// ─── GPT Image ────────────────────────────────────────────────────────────────

/**
 * Format weighted tokens for GPT Image (DALL-E) models.
 * Uses natural language with tier-based organization and embedded negative prompts.
 * Negative prompts are included in the positive prompt as "Avoid: ..." clause.
 * Example: "A beautiful landscape, set in mountains. with dramatic lighting.
 *           rendered in photorealistic style. Avoid: blurry, low quality."
 *
 * @param tokens - Array of weighted tokens to format
 * @param negativePrompt - Negative prompt string (will be embedded in positive)
 * @returns Formatted output with natural language prompt
 */
function formatForGptImage(tokens: WeightedToken[], negativePrompt: string): ModelFormattedOutput {
  const sorted = [...tokens].sort((a, b) => b.weight - a.weight);

  const anchors = sorted.filter((t) => t.tier === 'anchor');
  const moodDrivers = sorted.filter((t) => t.tier === 'mood_driver');
  const styles = sorted.filter((t) => t.tier === 'style');
  const scenes = sorted.filter((t) => t.tier === 'scene_context');
  const fillers = sorted.filter((t) => t.tier === 'filler');

  const sections: string[] = [];
  if (anchors.length > 0) sections.push(anchors.map((t) => t.token).join(', '));
  if (scenes.length > 0) sections.push(`set in ${scenes.map((t) => t.token).join(', ')}`);
  if (moodDrivers.length > 0)
    sections.push(`with ${moodDrivers.map((t) => t.token).join(' and ')}`);
  if (styles.length > 0)
    sections.push(`rendered in ${styles.map((t) => t.token).join(', ')} style`);
  if (fillers.length > 0) sections.push(fillers.map((t) => t.token).join(', '));

  const plainNegatives = negativePrompt
    .replace(/\(([^:)]+):[0-9.]+\)/g, '$1')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const avoidClause = plainNegatives.length > 0 ? ` Avoid: ${plainNegatives.join(', ')}.` : '';

  // For GPT Image the negative is encoded inside the positive prompt.
  return {
    positive: sections.join('. ') + '.' + avoidClause,
    negative: '',
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Main switch-case helper function to format weighted prompts based on model type.
 * This function routes to the appropriate formatter based on the target model.
 *
 * Supported formats:
 * - Stable Diffusion: (token:weight) format, e.g., (beautiful:1.3)
 * - ComfyUI: Same as Stable Diffusion
 * - FLUX: Plain text, weight determines order
 * - GPT Image: Natural language with embedded negatives
 *
 * @param tokens - Array of weighted tokens from the weighting system
 * @param negativePrompt - Negative prompt string
 * @param target - Target model type to format for
 * @returns Formatted output specific to the model type
 * @throws Error if model target is unknown
 */
export function formatForModel(
  tokens: WeightedToken[],
  negativePrompt: string,
  target: ModelTarget,
): ModelFormattedOutput {
  switch (target) {
    case 'stable_diffusion':
      return formatForSD(tokens, negativePrompt);
    case 'comfyui':
      return formatForSD(tokens, negativePrompt);
    case 'flux':
      return formatForFlux(tokens, negativePrompt);
    case 'gpt_image':
      return formatForGptImage(tokens, negativePrompt);
    default: {
      const exhaustive: never = target;
      throw new Error(`Unknown model target: ${exhaustive}`);
    }
  }
}
