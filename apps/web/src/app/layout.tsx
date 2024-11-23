import { ThemeProvider } from '@falcojs/ui/components/core/theme-provider';
import { SidebarProvider, SidebarTrigger } from '@falcojs/ui/components/ui/sidebar';
import { AppSidebar } from '@falcojs/web/components/AppSiderbar';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@falcojs/ui/globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Falco.js',
  description: '基于Nextjs的快速开发框架',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-cn" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SidebarProvider>
            <AppSidebar />
            <main className="pl-4">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
