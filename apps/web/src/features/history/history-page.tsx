'use client';

import { Card, CardContent } from '@repo/ui/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui/components/ui/empty';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { Spinner } from '@repo/ui/components/ui/spinner';
import { cn } from '@repo/ui/lib/utils';
import { History } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import { useHistory } from './hooks/useHistory';
import type { ConversationItem } from './service';

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function getDateLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function TimelineItem({ item }: { item: ConversationItem }) {
  const score = item.qualityScore;

  return (
    <div className="relative pb-6 pl-6">
      {/* vertical line */}
      <div className="bg-border absolute top-0 bottom-0 left-2 w-px" />
      {/* dot */}
      <div className="border-primary bg-background absolute top-2 left-[5px] h-2.5 w-2.5 rounded-full border-2" />
      {/* card */}
      <div className="bg-card space-y-2 rounded-lg border p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-2 flex-1 text-sm font-medium">{item.inputPrompt}</p>
          <span
            className={cn(
              'text-sm font-bold shrink-0',
              score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-500' : 'text-destructive',
            )}
          >
            {item.qualityScore}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-medium">
            {item.modelName}
          </span>
          <span className="text-muted-foreground rounded border px-2 py-0.5 text-xs font-medium">
            {item.styleName}
          </span>
          <span className="text-muted-foreground ml-auto text-xs">
            {formatRelativeTime(item.createdAt)}
          </span>
        </div>
        {item.outputPrompt && (
          <p className="text-muted-foreground line-clamp-2 font-mono text-xs">
            {item.outputPrompt}
          </p>
        )}
      </div>
    </div>
  );
}

function TimelineSkeletons() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="relative pb-6 pl-6">
          <div className="bg-border absolute top-0 bottom-0 left-2 w-px" />
          <div className="border-primary bg-background absolute top-2 left-[5px] h-2.5 w-2.5 rounded-full border-2" />
          <div className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HistoryPage() {
  const historyQuery = useHistory();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !historyQuery.hasNextPage || historyQuery.isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          historyQuery.fetchNextPage();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    historyQuery.fetchNextPage,
    historyQuery.hasNextPage,
    historyQuery.isFetchingNextPage,
    historyQuery.dataUpdatedAt,
  ]);

  const allItems = useMemo(
    () => historyQuery.data?.pages.flatMap((page) => page.data.items) ?? [],
    [historyQuery.data],
  );

  // Group items by date label
  const grouped = useMemo(() => {
    const groups: { label: string; items: ConversationItem[] }[] = [];
    const seen = new Map<string, ConversationItem[]>();

    for (const item of allItems) {
      const label = getDateLabel(item.createdAt);
      if (!seen.has(label)) {
        seen.set(label, []);
        groups.push({ label, items: seen.get(label)! });
      }
      seen.get(label)!.push(item);
    }

    return groups;
  }, [allItems]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="flex h-16 items-center px-6">
          <div>
            <h1 className="text-2xl font-bold">History</h1>
            <p className="text-muted-foreground text-sm">Your recent prompt compilations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl">
          {historyQuery.isLoading && <TimelineSkeletons />}

          {historyQuery.isError && (
            <Card>
              <CardContent className="text-destructive py-6 text-sm">
                {(historyQuery.error as Error).message}
              </CardContent>
            </Card>
          )}

          {!historyQuery.isLoading && !historyQuery.isError && allItems.length === 0 && (
            <Empty className="border py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <History />
                </EmptyMedia>
                <EmptyTitle>No compilations yet</EmptyTitle>
                <EmptyDescription>Head to Studio to generate your first prompt.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {grouped.length > 0 && (
            <div className="space-y-6">
              {grouped.map(({ label, items }) => (
                <div key={label}>
                  <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                    {label}
                  </p>
                  <div>
                    {items.map((item) => (
                      <TimelineItem key={item._id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="h-8" />

          {historyQuery.isFetchingNextPage && (
            <div className="flex items-center justify-center py-4">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
