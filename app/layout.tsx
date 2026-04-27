/**
 * Root Layout for TechRover Automated Appraisal Process
 * Contains the global layout structure with sidebar navigation
 */

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TechRover Appraisal System',
  description: 'Automated employee appraisal process',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
