"use client";

import { ReactNode, useEffect } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Dark mode is not designed yet. Keep the document deterministic even
    // when the user's OS or an older saved preference is dark.
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }, []);

  return <>{children}</>;
}
