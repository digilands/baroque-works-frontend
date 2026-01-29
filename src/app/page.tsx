'use client'
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-3 py-1 rounded bg-[var(--color-white-bg)] text-[var(--color-text)] border"
      >
        {mounted ? (theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode") : "🌙 Dark Mode"}
      </button>
      <Link
        href="/Home"
        className="px-3 py-1 rounded bg-blue-600 text-white ml-2"
      >
        Go to Home
      </Link>

    </>

  )
}
