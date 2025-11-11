'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeProvider  from "@/contexts/ThemeProvider";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "BaroqueWorks",
  description: "product of imperium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Prevent rendering until theme is ready
    return (
      <html>
        <body className="bg-white text-black transition-colors duration-300">
          {/* You can also add a loader or skeleton */}
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <body
        className={` ${geistSans.variable} ${geistMono.variable} antialiased bg-bg`}
        >
          <AppRouterCacheProvider  options={{ enableCssLayer: true }}>
          <ThemeProvider>
        {children}
        </ThemeProvider>
          </AppRouterCacheProvider>
      </body>
    </html>
  );
}
