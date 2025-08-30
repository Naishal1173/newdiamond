import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Diamond RAP Calculator',
  description: 'A full-stack application to calculate diamond prices based on the Rapaport price list.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${inter.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
