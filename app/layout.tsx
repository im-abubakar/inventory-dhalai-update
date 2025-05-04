import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Point of Sale', 
  description: 'Point of Sale System for Small Businesses',
  icons: {
    icon: '/favicon1.png', // ✅ Favicon PNG path
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    

      <body className={inter.className}>{children}</body>
      <Toaster /> 
    </html>
  );
}
