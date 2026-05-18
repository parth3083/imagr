'use client';

import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Key } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useSaveApiKey } from '../hooks/useSaveApiKey';
import { useUserSettings } from '../hooks/useUserSettings';

export function ApiKeyGate({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading } = useUserSettings();
  const [apiKey, setApiKey] = useState('');
  const saveApiKey = useSaveApiKey();

  const needsKey = !isLoading && settings !== null && !settings?.hasApiKey;

  const handleSave = () => {
    if (!apiKey.trim()) return;
    saveApiKey.mutate(apiKey.trim());
  };

  return (
    <>
      {children}
      <Dialog open={needsKey} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2">
              <Key className="text-primary h-5 w-5" />
              <DialogTitle>Add your Gemini API Key</DialogTitle>
            </div>
            <DialogDescription>
              To use Studio and Styles, you need your own Google Gemini API key. Get one free at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Google AI Studio
              </a>
              . Your key is stored securely and used only for your prompts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="gemini-key">Gemini API Key</Label>
            <Input
              id="gemini-key"
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link href="/dashboard/settings">Manage in Settings →</Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim() || saveApiKey.isPending}
              className="gap-2"
            >
              {saveApiKey.isPending ? 'Saving...' : 'Save & Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
