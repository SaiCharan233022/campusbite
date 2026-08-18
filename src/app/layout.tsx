import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { GlassNav } from '@/components/ui/GlassNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'CampusBite — Smart College Canteen System',
  description:
    'Skip the peak rush, pre-order meals, track live kitchen queues, and enjoy seamless digital payments at campus canteens.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FAFAFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <Providers>
          <GlassNav />
          <main className="page-wrapper">{children}</main>
          <CartDrawer />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
