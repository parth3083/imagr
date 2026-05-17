# Weighted Prompt Generation System

## Overview

The weighted prompt generation system transforms raw user prompts into model-specific formatted prompts with weighted tokens. This system ensures that prompts are optimized for different AI image generation models.

## Architecture Flow

```
User Input (Raw Prompt)
    ↓
1. Enhance Prompt (PromptService.getExpandedPrompt)
    ↓
Structured Blueprint
    ↓
2. Generate Weighted Tokens (PromptWeightService.weightBlueprint)
    ↓
Weighted Tokens + Metadata
    ↓
3. Format for Model (formatForModel - Switch Case)
    ↓
Model-Specific Output
```

## Step-by-Step Process

### Step 1: Enhance Prompt

**Location:** `apps/web/src/features/prompt/service.ts`

The raw prompt is analyzed and converted into a structured blueprint with categorized elements:

- **Anchors**: Main subjects
- **Scene Context**: Environment and setting
- **Mood Drivers**: Emotional tone and atmosphere
- **Style**: Artistic style and rendering approach
- **Fillers**: Supporting details

**Example:**

```typescript
Input: "A beautiful sunset over mountains"
Output: {
  blueprint: {
    anchors: { items: ["sunset", "mountains"], confidence: 0.9 },
    scene_context: { items: ["over mountains"], confidence: 0.8 },
    mood_drivers: { items: ["beautiful"], confidence: 0.7 },
    // ...
  }
}
```

### Step 2: Generate Weighted Tokens

**Location:** `apps/web/src/features/prompt/weight/service.ts`

The structured blueprint is processed to assign weights to each token based on:

- **Style requirements**: Style-specific emphasis patterns
- **Creative tone**: User-defined creativity level (0-100)
- **Lock words**: Mandatory style-specific tokens
- **Token importance**: Tier-based prioritization

**Weight Calculation:**

- Base weight: 1.0
- Maximum weight: 1.1 + (creativeTone / 100) \* 0.4
- Range: 1.0 to 1.5 (at 100% creative tone)

**Example:**

```typescript
Input: blueprint + style + creative_tone: 80
Output: {
  weighted_tokens: [
    { token: "sunset", weight: 1.4, tier: "anchor" },
    { token: "mountains", weight: 1.3, tier: "anchor" },
    { token: "beautiful", weight: 1.2, tier: "mood_driver" },
    // ...
  ]
}
```

### Step 3: Format for Model (Switch-Case Helper)

**Location:** `apps/web/src/lib/model-router.ts`

The weighted tokens are formatted according to the target model's requirements using a switch-case pattern:

#### Supported Model Formats

##### 1. Stable Diffusion / ComfyUI

**Format:** `(token:weight)`

```typescript
Input: [
  { token: 'sunset', weight: 1.4 },
  { token: 'mountains', weight: 1.3 },
];
Output: '(sunset:1.4), (mountains:1.3), (beautiful:1.2)';
```

##### 2. FLUX

**Format:** Plain text (weight determines order)

```typescript
Input: [
  { token: 'sunset', weight: 1.4 },
  { token: 'mountains', weight: 1.3 },
];
Output: 'sunset, mountains, beautiful';
```

##### 3. GPT Image (DALL-E)

**Format:** Natural language with embedded negatives

```typescript
Input: weighted_tokens + negative_prompt;
Output: 'A sunset, set in mountains. with beautiful atmosphere. rendered in photorealistic style. Avoid: blurry, low quality.';
```

## Model Target Resolution

The system automatically detects the model type from the model name:

```typescript
function resolveModelTarget(modelName: string): ModelTarget {
  const normalized = modelName.trim().toLowerCase();

  if (normalized.includes('flux')) return 'flux';
  if (normalized.includes('comfy')) return 'comfyui';
  if (normalized.includes('gpt image') || normalized.includes('dall-e')) return 'gpt_image';

  return 'stable_diffusion'; // default
}
```

## API Usage

### Endpoint

```
POST /api/weight
```

### Request Body

```typescript
{
  prompt: string; // Raw user prompt
  model_name: string; // AI model name
  style_name: string; // Style to apply
  creative_tone: number; // 0-100, controls weight range
}
```

### Response

```typescript
{
  enhancement: {
    blueprint: BluePrint;           // Structured prompt breakdown
    original_prompt: string;
    expanded_prompt_text: string;
  },
  weighting: {
    weighted_tokens: WeightedToken[];  // Tokens with weights
    compiled_prompt: string;           // Combined prompt
    negative_prompt: string;
    quality_score: number;
    lint_warnings: LintWarning[];
  },
  model_output: {
    positive: string;  // Model-specific formatted prompt
    negative: string;  // Model-specific negative prompt
  },
  model_target: ModelTarget;
  model_name: string;
  style_name: string;
  creative_tone: number;
}
```

## Adding New Model Formats

To add support for a new model format:

1. **Add model target type** in `model-router.ts`:

```typescript
export type ModelTarget = 'stable_diffusion' | 'flux' | 'comfyui' | 'gpt_image' | 'new_model';
```

2. **Create formatter function**:

```typescript
function formatForNewModel(tokens: WeightedToken[], negativePrompt: string): ModelFormattedOutput {
  // Implement model-specific formatting logic
  return { positive: '...', negative: '...' };
}
```

3. **Add case to switch statement**:

```typescript
export function formatForModel(
  tokens: WeightedToken[],
  negativePrompt: string,
  target: ModelTarget,
): ModelFormattedOutput {
  switch (target) {
    // ... existing cases
    case 'new_model':
      return formatForNewModel(tokens, negativePrompt);
    default:
      throw new Error(`Unknown model target: ${target}`);
  }
}
```

4. **Update model resolution logic**:

```typescript
function resolveModelTarget(modelName: string): ModelTarget {
  const normalized = modelName.trim().toLowerCase();

  if (normalized.includes('new_model_keyword')) return 'new_model';
  // ... existing conditions
}
```

## Lock Words

Lock words are style-specific tokens that must appear in the final prompt with predefined weights:

```typescript
// Example lock words for a style
[
  { word: 'photorealistic', format: '(photorealistic:1.3)' },
  { word: '8k', format: '(8k:1.2)' },
];
```

These are automatically injected at the beginning of the compiled prompt.

## Error Handling

The system includes comprehensive error handling:

- **404**: Model or style not found
- **500**: Prompt enhancement or weight generation failed

All errors are logged with detailed context for debugging.

## Testing

Run tests with:

```bash
bun test apps/web/src/features/prompt/weight/tests/
```

## Related Files

- **Route Handler**: `apps/web/src/features/prompt/weight/index.ts`
- **Service Logic**: `apps/web/src/features/prompt/weight/service.ts`
- **Model Formatting**: `apps/web/src/lib/model-router.ts`
- **Prompt Enhancement**: `apps/web/src/features/prompt/service.ts`
- **Type Definitions**: `packages/core-types/src/features/prompt/`
