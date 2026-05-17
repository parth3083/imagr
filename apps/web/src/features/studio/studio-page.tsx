'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { AlertCircle, Check, Copy, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useModels, useStylesList, useWeightPrompt } from './hooks';

export function StudioPage() {
  const [prompt, setPrompt] = useState('');
  const [modelId, setModelId] = useState<string>('');
  const [styleId, setStyleId] = useState<string>('');
  const [creativeTone, setCreativeTone] = useState(65);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: modelsData, isLoading: modelsLoading } = useModels();
  const { data: stylesData, isLoading: stylesLoading } = useStylesList();
  const { mutate: generate, isPending, data: result } = useWeightPrompt();

  const models = modelsData ?? [];
  const styles = stylesData ?? [];
  const hasNoStyles = !stylesLoading && styles.length === 0;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // clipboard write failed silently
    }
  };

  const handleCompile = () => {
    generate({ prompt, model_id: modelId, style_id: styleId, creative_tone: creativeTone });
  };

  const positiveText = result?.model_output?.positive ?? '';
  const negativeText = result?.model_output?.negative ?? '';
  const scores = result?.weighting?.quality_score;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 flex-shrink-0 border-b backdrop-blur">
        <div className="flex h-16 items-center px-6">
          <div>
            <h1 className="text-2xl font-bold">Prompt Studio</h1>
            <p className="text-muted-foreground text-sm">
              Write your raw idea. We'll compile it into production-grade prompts.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mx-auto grid h-full max-w-7xl gap-6 p-6 lg:grid-cols-[1fr_480px]">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {hasNoStyles && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    No styles yet
                  </p>
                  <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                    You need at least one style to compile prompts.{' '}
                    <Link href="/dashboard/library" className="font-medium underline">
                      Create your first style →
                    </Link>
                  </p>
                </div>
              </div>
            )}
            <Card className="flex-shrink-0">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                  Raw Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision..."
                  className="border-primary min-h-32 resize-none"
                />
              </CardContent>
            </Card>

            <div className="grid flex-shrink-0 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select value={modelId} onValueChange={setModelId} disabled={modelsLoading}>
                  <SelectTrigger className="border-primary">
                    <SelectValue placeholder={modelsLoading ? 'Loading...' : 'Select a model'} />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model._id} value={model._id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Style Preset</label>
                <Select
                  value={styleId}
                  onValueChange={setStyleId}
                  disabled={stylesLoading || hasNoStyles}
                >
                  <SelectTrigger className="border-primary">
                    <SelectValue
                      placeholder={
                        stylesLoading
                          ? 'Loading...'
                          : hasNoStyles
                            ? 'No styles — create one first'
                            : 'Select a style'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem key={style._id} value={style._id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Creative Tone</label>
                <span className="text-primary text-sm font-medium">{creativeTone}%</span>
              </div>
              <div className="space-y-2">
                <div className="relative h-5">
                  <div className="bg-muted absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full" />
                  <div
                    className="bg-primary absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
                    style={{ width: `${creativeTone}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creativeTone}
                    onChange={(e) => setCreativeTone(Number(e.target.value))}
                    className="[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-background [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-background absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-[-2px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:shadow-sm"
                  />
                </div>
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 shadow-lg"
              onClick={handleCompile}
              disabled={isPending || !prompt.trim() || !modelId || !styleId}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {isPending ? 'Compiling...' : 'Compile Prompt'}
            </Button>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {!result && !isPending && (
              <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
                <Sparkles className="text-muted-foreground mb-3 h-10 w-10" />
                <p className="text-muted-foreground text-sm">
                  Your compiled prompt will appear here
                </p>
              </div>
            )}

            {isPending && (
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result && !isPending && (
              <Card className="flex flex-col">
                <CardHeader className="border-border/50 flex-shrink-0 border-b pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="flex-1">Compiled Output</CardTitle>
                    <span className="bg-accent text-accent-foreground rounded px-2 py-0.5 text-xs font-medium">
                      {result.model_name}
                    </span>
                    <span className="bg-accent text-accent-foreground rounded px-2 py-0.5 text-xs font-medium">
                      {result.style_name}
                    </span>
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
                      {result.model_target}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 pt-4">
                  {/* Positive Prompt */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Prompt
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => copyToClipboard(positiveText, 'positive')}
                      >
                        {copiedField === 'positive' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-primary/5 ring-primary/20 rounded-lg p-4 font-mono text-sm ring-1">
                      {positiveText}
                    </div>
                  </div>

                  {/* Negative Prompt */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Negative
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => copyToClipboard(negativeText, 'negative')}
                      >
                        {copiedField === 'negative' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm">{negativeText}</div>
                  </div>

                  {/* Quality Scores */}
                  {scores && (
                    <div className="space-y-3">
                      <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Quality Scores
                      </span>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Card className="bg-accent/50">
                          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {scores.overall}
                            </div>
                            <div className="text-muted-foreground mt-1 text-xs font-medium">
                              Overall
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-accent/50">
                          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                            <div className="text-primary text-3xl font-bold">
                              {scores.specificity}
                            </div>
                            <div className="text-muted-foreground mt-1 text-xs font-medium">
                              Specificity
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-accent/50">
                          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                            <div className="text-primary text-3xl font-bold">
                              {scores.coherence}
                            </div>
                            <div className="text-muted-foreground mt-1 text-xs font-medium">
                              Coherence
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-accent/50">
                          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                            <div className="text-primary text-3xl font-bold">
                              {scores.weight_distribution}
                            </div>
                            <div className="text-muted-foreground mt-1 text-xs font-medium">
                              Weight Dist.
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium tracking-wider uppercase">
                            Overall Quality
                          </span>
                          <span className="font-semibold text-green-600">{scores.overall}%</span>
                        </div>
                        <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="bg-primary absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                            style={{ width: `${scores.overall}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => copyToClipboard(positiveText, 'footer-positive')}
                    >
                      {copiedField === 'footer-positive' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copy Positive
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => copyToClipboard(negativeText, 'footer-negative')}
                    >
                      {copiedField === 'footer-negative' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copy Negative
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
