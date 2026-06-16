'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import {
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Zap,
  Palette,
  FolderOpen,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { authClient } from '@/lib/auth-client';

const Page = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      router.push('/dashboard/studio');
    }
  }, [session, router]);

  const handleOpenStudio = () => {
    if (session?.user) {
      router.push('/dashboard/studio');
    } else {
      router.push('/sign-up');
    }
  };

  const handleGetStarted = () => {
    router.push('/sign-up');
  };

  return (
    <div className="from-background via-background to-accent/10 min-h-screen bg-linear-to-b">
      {/* Header */}
      <header className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="from-primary via-primary to-primary/80 text-primary-foreground group-hover:shadow-primary/25 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all group-hover:shadow-xl">
              <ImageIcon className="h-5 w-5" />
            </div>
            <span className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-bold text-transparent">
              Imagr
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                size="sm"
                variant="outline"
                className="group bg-accent hover:bg-accent/80 border-border gap-2 shadow-md transition-all hover:scale-105 hover:shadow-lg"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex min-h-[90vh] items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="bg-primary/10 text-primary ring-primary/20 animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Transform Your Creative Vision</span>
            </div>
            <h1 className="animate-fade-in-up text-5xl leading-tight font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Your prompts are broken.
              <br />
              <span className="from-primary via-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent">
                We fix them.
              </span>
            </h1>
            <p className="animate-fade-in-up text-muted-foreground mt-6 text-lg leading-relaxed [animation-delay:100ms] sm:text-xl">
              Writing good prompts shouldn&apos;t feel like guesswork. Imagr turns your raw ideas
              into weighted, optimized, production-grade prompts — automatically.
            </p>
            <p className="animate-fade-in-up text-muted-foreground/80 mt-4 text-sm italic [animation-delay:200ms]">
              No more copy-pasting from Discord. No more &quot;please try again.&quot; Just results.
            </p>
            <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-6 [animation-delay:300ms] sm:flex-row">
              <Button
                size="lg"
                onClick={handleGetStarted}
                variant="outline"
                className="group bg-accent hover:bg-accent/80 border-border h-14 gap-2 px-8 text-base shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Start Compiling
              </Button>
              <Link href="#demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:border-primary/50 hover:bg-primary/5 h-14 gap-2 px-8 text-base transition-all hover:scale-105"
                >
                  See it work
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Works With Section */}
      <section className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="from-accent/40 via-accent/30 to-accent/20 ring-border/50 rounded-2xl bg-gradient-to-br p-8 shadow-lg ring-1 backdrop-blur-sm">
            <p className="text-muted-foreground mb-6 text-center text-sm font-semibold tracking-wider uppercase">
              Works with
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: 'Nano Banana', color: 'yellow' },
                { name: 'Midjourney', color: 'blue' },
                { name: 'DALL-E 3', color: 'purple' },
                { name: 'Stable Diff', color: 'pink' },
                { name: 'Flux', color: 'green' },
              ].map((model) => (
                <span
                  key={model.name}
                  className={`group cursor-default rounded-full bg-${model.color}-100 px-5 py-2 text-sm font-medium text-${model.color}-800 shadow-sm ring-1 ring-${model.color}-200 transition-all hover:scale-105 hover:shadow-md dark:bg-${model.color}-900/30 dark:text-${model.color}-300 dark:ring-${model.color}-800/50`}
                >
                  ● {model.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {[
            { icon: Zap, value: '12,847', label: 'Prompts Compiled', delay: '0ms' },
            { icon: Target, value: '94.2%', label: 'Avg Quality Score', delay: '100ms' },
            { icon: Clock, value: '38%', label: 'Tokens Saved', delay: '200ms' },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="group animate-fade-in-up border-primary/20 from-accent/60 via-accent/40 to-accent/30 ring-border/50 hover:border-primary/40 hover:shadow-primary/10 border-2 bg-gradient-to-br shadow-lg ring-1 transition-all hover:scale-105 hover:shadow-xl"
              style={{ animationDelay: stat.delay }}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <stat.icon className="text-primary mb-4 h-10 w-10 transition-transform group-hover:scale-110 group-hover:rotate-6" />
                <div className="text-5xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-muted-foreground mt-2 text-sm font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* What we actually do */}
            <Card className="animate-fade-in-up border-primary/20 from-accent/40 via-accent/30 to-background ring-border/50 border-2 bg-gradient-to-br shadow-xl ring-1">
              <CardHeader className="border-border/50 border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">What we actually do</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:border-primary/50 hover:bg-primary/5 gap-2 transition-all hover:scale-105"
                  >
                    <Sparkles className="h-4 w-4" />
                    Live Example
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <div className="space-y-4">
                  <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    What you type
                  </div>
                  <div className="group bg-background ring-border/50 hover:ring-primary/30 rounded-xl p-5 font-mono text-sm shadow-inner ring-1 transition-all">
                    a futuristic bike in the rain at night
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-800 shadow-sm ring-1 ring-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-800/50">
                      Vague
                    </span>
                    <span className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 shadow-sm ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800/50">
                      No weights
                    </span>
                    <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 shadow-sm ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800/50">
                      7 tokens
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="from-primary to-primary/70 text-primary-foreground ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ring-4 transition-all hover:scale-110 hover:shadow-xl">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    What the model gets
                  </div>
                  <div className="group from-primary/5 to-background ring-primary/20 hover:ring-primary/40 rounded-xl bg-gradient-to-br p-5 font-mono text-sm shadow-inner ring-1 transition-all">
                    (futuristic cyberpunk motorcycle:1.4), (heavy rain, wet reflections:1.2), night
                    scene, neon-lit street, volumetric fog, cinematic lighting, 8k
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 shadow-sm ring-1 ring-green-200 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-800/50">
                      Weighted
                    </span>
                    <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 shadow-sm ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800/50">
                      Optimized
                    </span>
                    <span className="rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-800 shadow-sm ring-1 ring-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:ring-purple-800/50">
                      24 tokens
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Jump in */}
            <Card className="animate-fade-in-up border-primary/20 from-accent/40 via-accent/30 to-background ring-border/50 border-2 bg-gradient-to-br shadow-xl ring-1 [animation-delay:100ms]">
              <CardHeader className="border-border/50 border-b pb-4">
                <CardTitle className="text-2xl font-bold">Jump in</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2 pt-6">
                {[
                  { icon: Sparkles, label: 'New Compilation', href: '/sign-up' },
                  { icon: Palette, label: 'Browse Styles', href: '/sign-up' },
                  { icon: FolderOpen, label: 'History', href: '/sign-up' },
                ].map((item, index) => (
                  <Link key={item.label} href={item.href}>
                    <button
                      className="group bg-background ring-border/50 hover:ring-primary/30 animate-fade-in-up flex w-full items-center justify-between rounded-xl p-4 text-left shadow-sm ring-1 transition-all hover:scale-[1.02] hover:shadow-lg"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="from-primary/20 to-primary/10 text-primary ring-primary/20 group-hover:from-primary/30 group-hover:to-primary/20 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-all group-hover:scale-110">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      <ArrowRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ))}

                {/* Recent */}
                <div className="pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold">Recent</h3>
                    <Link
                      href="/sign-up"
                      className="text-primary hover:text-primary/80 text-xs font-medium transition-colors hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-2">
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
                    ].map((project, index) => (
                      <div
                        key={project.title}
                        className="group bg-background ring-border/50 hover:ring-primary/20 animate-fade-in-up cursor-pointer rounded-xl p-4 shadow-sm ring-1 transition-all hover:scale-[1.01] hover:shadow-md"
                        style={{ animationDelay: `${200 + index * 50}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="group-hover:text-primary text-sm font-semibold transition-colors">
                              {project.title}
                            </div>
                            <div className="text-muted-foreground text-xs">{project.time}</div>
                          </div>
                          <span
                            className={`rounded-lg bg-${project.statusColor}-100 px-3 py-1 text-xs font-semibold text-${project.statusColor}-800 shadow-sm ring-1 ring-${project.statusColor}-200 dark:bg-${project.statusColor}-900/30 dark:text-${project.statusColor}-300 dark:ring-${project.statusColor}-800/50`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="animate-fade-in-up border-primary/20 from-primary/5 via-accent/30 to-accent/20 ring-border/50 border-2 bg-linear-to-br shadow-2xl ring-1">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <div className="relative shrink-0 bg-transparent">
                  <div className="relative h-28 w-28 overflow-hidden transition-all">
                    <Image
                      src="https://res.cloudinary.com/do8etu7ml/image/upload/v1779029829/picofme_s8g4ip.png"
                      width={500}
                      height={500}
                      alt="Parth Image"
                      className="h-full w-full bg-transparent object-fill"
                    />
                  </div>
                  <div className="ring-background absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-pink-600 text-white shadow-lg ring-4">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <blockquote className="text-lg leading-relaxed font-medium sm:text-xl lg:text-2xl">
                    &quot;Writing prompts the hard way. Imagr exists because I got tired of wasting
                    tokens on garbage output.&quot;
                  </blockquote>
                  <div className="mt-6">
                    <div className="text-lg font-bold">Parth (pr.sh)</div>
                    <div className="text-muted-foreground text-sm font-medium">Creator, Imagr</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 pt-12 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="animate-fade-in-up text-4xl font-bold sm:text-5xl lg:text-6xl">
            Stop guessing. Start compiling.
          </h2>
          <p className="animate-fade-in-up text-muted-foreground mt-6 text-lg leading-relaxed [animation-delay:100ms] sm:text-xl">
            From raw idea to production-ready prompt in seconds. Every model. Every style. Every
            time.
          </p>
          <div className="animate-fade-in-up mt-12 [animation-delay:200ms]">
            <Button
              size="lg"
              onClick={handleOpenStudio}
              variant="outline"
              className="group bg-accent hover:bg-accent/80 border-border h-14 gap-2 px-8 text-base shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
              Open Studio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
