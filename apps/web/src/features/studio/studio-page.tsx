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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Sparkles, Plus, Copy, Download, Share2, Check } from 'lucide-react';
import { useState } from 'react';

const outputData = {
  safe: {
    weighted: 'futuristic bike, rain, night scene, neon lighting, 8k',
    negative: 'blurry, low quality',
    tokens: 18,
    quality: 82,
  },
  balanced: {
    weighted:
      '(futuristic cyberpunk motorcycle:1.4), (heavy rain, wet reflections:1.2), night scene, neon-lit street, volumetric fog, cinematic lighting, 8k',
    negative: 'blurry, low quality, distorted, watermark, text, deformed',
    tokens: 24,
    quality: 94,
  },
  aggressive: {
    weighted:
      '(futuristic cyberpunk motorcycle:1.8), (heavy rain, wet reflections:1.5), (night scene:1.3), (neon-lit street:1.4), volumetric fog, cinematic lighting, dramatic atmosphere, ultra detailed, 8k, masterpiece',
    negative:
      'blurry, low quality, distorted, watermark, text, deformed, ugly, bad anatomy, worst quality, low resolution',
    tokens: 32,
    quality: 96,
  },
};

export function StudioPage() {
  const [rawPrompt, setRawPrompt] = useState('a futuristic bike in rain');
  const [creativeTone, setCreativeTone] = useState(65);
  const [activeTab, setActiveTab] = useState('balanced');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const currentOutput = outputData[activeTab as keyof typeof outputData];

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExport = () => {
    const exportData = {
      rawPrompt,
      output: currentOutput,
      settings: {
        creativeTone,
        tab: activeTab,
      },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Imagr Prompt',
          text: currentOutput.weighted,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 flex-shrink-0 border-b backdrop-blur">
        <div className="flex h-16 items-center px-6">
          <div>
            <h1 className="text-2xl font-bold">Prompt Studio</h1>
            <p className="text-muted-foreground text-sm">
              Write your raw idea. We'll compile it into production-grade prompts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto grid h-full max-w-7xl gap-6 p-6 lg:grid-cols-[1fr_480px]">
          {/* Left Column - Input Section */}
          <div className="flex flex-col gap-4">
            {/* Raw Prompt Input */}
            <Card className="flex-shrink-0">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                  Raw Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  placeholder="Describe your vision..."
                  className="border-primary min-h-32 resize-none"
                />
              </CardContent>
            </Card>

            {/* Model and Style Selection */}
            <div className="grid flex-shrink-0 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select defaultValue="midjourney">
                  <SelectTrigger className="border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midjourney">Midjourney v6</SelectItem>
                    <SelectItem value="dalle">DALL-E 3</SelectItem>
                    <SelectItem value="stable">Stable Diffusion</SelectItem>
                    <SelectItem value="flux">Flux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Style Preset</label>
                <Select defaultValue="cinematic">
                  <SelectTrigger className="border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="photorealistic">Photorealistic</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Creative Tone Slider */}
            <div className="flex-shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Creative Tone</label>
                <span className="text-primary text-sm font-medium">{creativeTone}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={creativeTone}
                  onChange={(e) => setCreativeTone(Number(e.target.value))}
                  className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${creativeTone}%, hsl(var(--muted)) ${creativeTone}%, hsl(var(--muted)) 100%)`,
                  }}
                />
                <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="flex-shrink-0 space-y-2">
              <label className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                Smart Suggestions
              </label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-3 w-3" />
                  Add lighting keywords
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-3 w-3" />
                  Specify camera angle
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-3 w-3" />
                  Include atmosphere
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-3 w-3" />
                  Add resolution
                </Button>
              </div>
            </div>

            {/* Compile Button */}
            <Button size="lg" className="w-full gap-2 shadow-lg">
              <Sparkles className="h-5 w-5" />
              Compile Prompt
            </Button>
          </div>

          {/* Right Column - Output Section */}
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col">
              <CardHeader className="border-border/50 flex-shrink-0 border-b pb-4">
                <CardTitle>Compiled Output</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex h-full flex-col"
                >
                  <div className="border-border/30 flex-shrink-0 border-b px-6 pt-4">
                    <TabsList className="w-full">
                      <TabsTrigger value="safe" className="flex-1">
                        Safe
                      </TabsTrigger>
                      <TabsTrigger value="balanced" className="flex-1">
                        Balanced
                      </TabsTrigger>
                      <TabsTrigger value="aggressive" className="flex-1">
                        Aggressive
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-auto">
                    {(['safe', 'balanced', 'aggressive'] as const).map((tab) => (
                      <TabsContent
                        key={tab}
                        value={tab}
                        className="m-0 p-6 data-[state=active]:flex data-[state=active]:flex-col"
                      >
                        <div className="space-y-3">
                          {/* Weighted Prompt */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                Weighted Prompt
                              </div>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                  copyToClipboard(outputData[tab].weighted, `${tab}-weighted`)
                                }
                              >
                                {copiedField === `${tab}-weighted` ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="bg-primary/5 ring-primary/20 rounded-lg p-4 font-mono text-sm ring-1">
                              {outputData[tab].weighted}
                            </div>
                          </div>

                          {/* Negative Prompt */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                Negative Prompt
                              </div>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                  copyToClipboard(outputData[tab].negative, `${tab}-negative`)
                                }
                              >
                                {copiedField === `${tab}-negative` ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                              {outputData[tab].negative}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-3">
                            <Card className="bg-accent/50">
                              <CardContent className="flex flex-col items-center justify-center p-5 text-center">
                                <div className="text-primary text-3xl font-bold">
                                  {outputData[tab].tokens}
                                </div>
                                <div className="text-muted-foreground mt-1 text-xs font-medium">
                                  Tokens
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-accent/50">
                              <CardContent className="flex flex-col items-center justify-center p-5 text-center">
                                <div className="text-3xl font-bold text-green-600">
                                  {outputData[tab].quality}
                                </div>
                                <div className="text-muted-foreground mt-1 text-xs font-medium">
                                  Quality Score
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Quality Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-medium tracking-wider uppercase">
                                Quality
                              </span>
                              <span className="font-semibold text-green-600">
                                {outputData[tab].quality}%
                              </span>
                            </div>
                            <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
                              <div
                                className="from-primary to-primary absolute top-0 left-0 h-full rounded-full bg-gradient-to-r transition-all duration-300"
                                style={{ width: `${outputData[tab].quality}%` }}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 gap-2"
                              onClick={() =>
                                copyToClipboard(outputData[tab].weighted, `${tab}-all`)
                              }
                            >
                              {copiedField === `${tab}-all` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                              Copy
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1 gap-2"
                              onClick={handleExport}
                            >
                              <Download className="h-4 w-4" />
                              Export
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-2"
                              onClick={handleShare}
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* History */}
            <Card className="flex-shrink-0">
              <CardHeader className="border-border/50 border-b pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                    History
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary h-auto p-0 text-xs hover:underline"
                  >
                    View All →
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                {[
                  { title: 'a futuristic bike in rain', time: '2 min ago', score: 94 },
                  { title: 'vintage car on coastal road', time: '15 min ago', score: 88 },
                  { title: 'abstract fluid art', time: '1 hr ago', score: 91 },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="bg-accent/30 hover:bg-accent/50 flex w-full items-center justify-between rounded-lg p-3 text-left transition-all"
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-sm font-medium">{item.title}</div>
                      <div className="text-muted-foreground text-xs">{item.time}</div>
                    </div>
                    <div className="text-primary ml-2 text-sm font-semibold">{item.score}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
