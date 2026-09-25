import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // Add necessary weights
});

export const metadata: Metadata = {
  title: {
    default: "Handyman — Trusted local trade professionals",
    template: "%s · Handyman",
  },
  description:
    "Find vetted electricians, plumbers, carpenters, painters, and more across Nigeria. Book trusted local pros in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased bg-bg font-sans`}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
