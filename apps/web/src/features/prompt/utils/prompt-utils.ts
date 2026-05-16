import { bluePrint } from '@repo/core-types/prompt';

const CATEGORY_ORDER: (keyof bluePrint)[] = [
  'color_palette',
  'composition',
  'details',
  'lighting',
  'mood',
  'scene',
  'style',
  'subject',
];

export function expandedPromptToText(blueprint: bluePrint): string {
  return CATEGORY_ORDER.map((key) => blueprint[key].value)
    .filter(Boolean)
    .join(', ');
}
