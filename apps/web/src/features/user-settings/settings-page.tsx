'use client';

import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Key, User } from 'lucide-react';
import { useState } from 'react';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

import { useSaveApiKey } from './hooks/useSaveApiKey';
import { useUserSettings } from './hooks/useUserSettings';

export function SettingsPage() {
  const { data: user } = useCurrentUser();
  const { data: settings } = useUserSettings();
  const saveApiKey = useSaveApiKey();
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) return;
    saveApiKey.mutate(apiKey.trim(), {
      onSuccess: () => setApiKey(''),
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 flex-shrink-0 border-b backdrop-blur">
        <div className="flex h-16 items-center px-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your account and API keys</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="text-primary h-4 w-4" />
                <CardTitle className="text-base">Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Name</Label>
                <p className="text-sm font-medium">{user?.name || '—'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Email</Label>
                <p className="text-sm font-medium">{user?.email || '—'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="text-primary h-4 w-4" />
                <CardTitle className="text-base">Gemini API Key</CardTitle>
              </div>
              <CardDescription>
                {settings?.hasApiKey
                  ? 'You have a Gemini API key saved. Enter a new key below to replace it.'
                  : 'Add your Google Gemini API key to use Studio and Styles.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings?.hasApiKey && (
                <div className="bg-muted rounded-md px-3 py-2 font-mono text-sm tracking-widest text-green-600">
                  •••••••••••••••• (key saved)
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSave} disabled={!apiKey.trim() || saveApiKey.isPending}>
                  {saveApiKey.isPending ? 'Saving...' : settings?.hasApiKey ? 'Update' : 'Save'}
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Get a free key at{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Google AI Studio
                </a>
                . Your key is stored in your account and never shared.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
