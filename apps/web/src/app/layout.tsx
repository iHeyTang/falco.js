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
  description: 'a light weight for workflows management system',
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
            <main className="p-4">{children}</main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
