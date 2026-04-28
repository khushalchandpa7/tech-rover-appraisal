import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { AppProviders } from "@/providers/AppProviders";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechRover Appraisals",
  description:
    "Automated appraisal workflow powered by the TechRover Odoo ERP.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#07091A] text-[#DDE8F5]">
        <SessionProvider session={session}>
          <AppProviders>{children}</AppProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
