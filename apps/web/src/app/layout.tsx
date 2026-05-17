import type { Metadata } from 'next';
import { Francois_One } from 'next/font/google';

import Provider from '@/providers/Provider';

import '@repo/ui/globals.css';

const francoisOne = Francois_One({
  variable: '--font-francois',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: {
    default: 'Imagr — AI Prompt Compiler',
    template: '%s | Imagr',
  },
  description:
    'Imagr turns your raw ideas into production-grade AI image prompts. Pick a model, choose a style, and let AI compile the perfect prompt.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://imagr.parth3083.live/'),
  openGraph: {
    type: 'website',
    siteName: 'Imagr',
    title: 'Imagr — AI Prompt Compiler',
    description:
      'Imagr turns your raw ideas into production-grade AI image prompts. Pick a model, choose a style, and let AI compile the perfect prompt.',
    images: [
      {
        url: 'https://res.cloudinary.com/do8etu7ml/image/upload/v1779021000/Imagr-preview_synuzn.webp',
        width: 1200,
        height: 630,
        alt: 'Imagr — AI Prompt Compiler',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imagr — AI Prompt Compiler',
    description:
      'Imagr turns your raw ideas into production-grade AI image prompts. Pick a model, choose a style, and let AI compile the perfect prompt.',
    images: [
      'https://res.cloudinary.com/do8etu7ml/image/upload/v1779021000/Imagr-preview_synuzn.webp',
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${francoisOne.variable} ${francoisOne.className} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
