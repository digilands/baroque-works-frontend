"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ThemeProvider from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "@/components/Providers";

/** Client-side provider tree (extracted so the root layout can stay a
 * server component and export metadata). */
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </AppRouterCacheProvider>
    </Providers>
  );
}
