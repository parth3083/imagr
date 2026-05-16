import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Sparkles, Sword, Palette, FolderOpen, ArrowRight, Zap, Target, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back to Imagr</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Stats */}
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="border-primary/20 from-accent/60 via-accent/40 to-accent/30 border-2 bg-gradient-to-br shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Zap className="text-primary mb-3 h-8 w-8" />
                <div className="text-4xl font-bold">12,847</div>
                <div className="text-muted-foreground mt-1 text-sm">Prompts Compiled</div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 from-accent/60 via-accent/40 to-accent/30 border-2 bg-gradient-to-br shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Target className="text-primary mb-3 h-8 w-8" />
                <div className="text-4xl font-bold">94.2%</div>
                <div className="text-muted-foreground mt-1 text-sm">Avg Quality Score</div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 from-accent/60 via-accent/40 to-accent/30 border-2 bg-gradient-to-br shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Clock className="text-primary mb-3 h-8 w-8" />
                <div className="text-4xl font-bold">38%</div>
                <div className="text-muted-foreground mt-1 text-sm">Tokens Saved</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-primary/20 from-accent/40 via-accent/30 to-background border-2 bg-gradient-to-br shadow-xl">
              <CardHeader className="border-border/50 border-b">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <Link href="/studio">
                  <button className="group bg-background ring-border/50 hover:ring-primary/30 flex w-full items-center justify-between rounded-xl p-4 text-left shadow-sm ring-1 transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="from-primary/20 to-primary/10 text-primary ring-primary/20 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ring-1">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">New Compilation</span>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>

                <Link href="/arena">
                  <button className="group bg-background ring-border/50 hover:ring-primary/30 flex w-full items-center justify-between rounded-xl p-4 text-left shadow-sm ring-1 transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="from-primary/20 to-primary/10 text-primary ring-primary/20 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ring-1">
                        <Sword className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">Start Arena Battle</span>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>

                <Link href="/library">
                  <button className="group bg-background ring-border/50 hover:ring-primary/30 flex w-full items-center justify-between rounded-xl p-4 text-left shadow-sm ring-1 transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="from-primary/20 to-primary/10 text-primary ring-primary/20 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ring-1">
                        <Palette className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">Browse Styles</span>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>

                <Link href="/projects">
                  <button className="group bg-background ring-border/50 hover:ring-primary/30 flex w-full items-center justify-between rounded-xl p-4 text-left shadow-sm ring-1 transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="from-primary/20 to-primary/10 text-primary ring-primary/20 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ring-1">
                        <FolderOpen className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">My Projects</span>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-primary/20 from-accent/40 via-accent/30 to-background border-2 bg-gradient-to-br shadow-xl">
              <CardHeader className="border-border/50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary h-auto p-0 text-xs hover:underline"
                  >
                    View All →
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {[
                  {
                    title: 'Neon City Campaign',
                    time: '2 hrs ago',
                    status: 'Compiled',
                    statusColor: 'green',
                  },
                  {
                    title: 'Product Flat Lay',
                    time: '5 hrs ago',
                    status: 'Draft',
                    statusColor: 'yellow',
                  },
                  {
                    title: 'Editorial Portrait',
                    time: 'Yesterday',
                    status: 'Compiled',
                    statusColor: 'green',
                  },
                  {
                    title: 'Abstract Fluid Art',
                    time: '2 days ago',
                    status: 'Compiled',
                    statusColor: 'green',
                  },
                ].map((project, index) => (
                  <div
                    key={index}
                    className="group bg-background ring-border/50 hover:ring-primary/20 rounded-xl p-4 shadow-sm ring-1 transition-all hover:scale-[1.01] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="group-hover:text-primary text-sm font-semibold transition-colors">
                          {project.title}
                        </div>
                        <div className="text-muted-foreground text-xs">{project.time}</div>
                      </div>
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                          project.statusColor === 'green'
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-200 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-800/50'
                            : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-800/50'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
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
