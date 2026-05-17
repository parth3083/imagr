'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui/components/ui/empty';
import { Input } from '@repo/ui/components/ui/input';
import { Spinner } from '@repo/ui/components/ui/spinner';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Check, Copy, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { type LibraryStyle, useCreateStyle, useDeleteStyle, useInfiniteStyles } from './hooks';

function CreateStyleDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [basicPrompt, setBasicPrompt] = useState('');
  const createStyle = useCreateStyle();

  const canSubmit =
    name.trim().length > 0 && basicPrompt.trim().length > 0 && !createStyle.isPending;

  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      await createStyle.mutateAsync({
        name: name.trim(),
        basicPrompt: basicPrompt.trim(),
      });

      setName('');
      setBasicPrompt('');
      setOpen(false);
    } catch {
      // Mutation error feedback is handled by the hook toast.
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Style
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Style</DialogTitle>
          <DialogDescription>
            Enter a style name and describe your style — any length. We&apos;ll enhance your
            description with AI and store the full style prompt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Style name</label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Cinematic Neon"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Style description</label>
            <Textarea
              value={basicPrompt}
              onChange={(event) => setBasicPrompt(event.target.value)}
              placeholder="Describe your baseline style..."
              className="min-h-28 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={createStyle.isPending}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!canSubmit} className="gap-2">
            {createStyle.isPending && <Spinner className="h-4 w-4" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StyleCard({ style }: { style: LibraryStyle }) {
  const deleteStyle = useDeleteStyle();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(style.extendedPrompt);
      setCopied(true);
      toast.success('Style prompt copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="space-y-3 p-4">
        <h3 className="text-base font-semibold">{style.name}</h3>

        <div className="bg-muted/50 rounded-md p-3">
          <p className="text-muted-foreground font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {style.extendedPrompt}
          </p>
        </div>

        <div className="text-muted-foreground text-xs">{style.usageCount} uses</div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => deleteStyle.mutate({ id: style._id })}
            disabled={deleteStyle.isPending}
          >
            {deleteStyle.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function StyleLibraryPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const stylesQuery = useInfiniteStyles(search);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !stylesQuery.hasNextPage || stylesQuery.isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          stylesQuery.fetchNextPage();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    stylesQuery.fetchNextPage,
    stylesQuery.hasNextPage,
    stylesQuery.isFetchingNextPage,
    stylesQuery.dataUpdatedAt,
  ]);

  const styles = useMemo(
    () => stylesQuery.data?.pages.flatMap((page) => page.data.items) ?? [],
    [stylesQuery.data],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div>
            <h1 className="text-2xl font-bold">Library</h1>
            <p className="text-muted-foreground text-sm">
              Search, save, and use your style presets
            </p>
          </div>
          <CreateStyleDialog />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search styles..."
              className="pl-8"
            />
          </div>

          {stylesQuery.isLoading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Spinner />
              Loading styles...
            </div>
          )}

          {stylesQuery.isError && (
            <Card>
              <CardContent className="text-destructive py-6 text-sm">
                {(stylesQuery.error as Error).message}
              </CardContent>
            </Card>
          )}

          {!stylesQuery.isLoading && !stylesQuery.isError && styles.length === 0 && (
            <Empty className="border py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Sparkles />
                </EmptyMedia>
                <EmptyTitle>No styles yet</EmptyTitle>
                <EmptyDescription>
                  {search
                    ? 'No styles match your search. Try a different keyword.'
                    : 'Create your first style to get started.'}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <CreateStyleDialog />
              </EmptyContent>
            </Empty>
          )}

          {styles.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {styles.map((style) => (
                <StyleCard key={style._id} style={style} />
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="h-8" />

          {stylesQuery.isFetchingNextPage && (
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Spinner />
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
