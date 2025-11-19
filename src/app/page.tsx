'use client'
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function Page() {
   const { theme, setTheme } = useTheme();
 const router = useRouter()
  return (
       <>
        <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-1 rounded bg-[var(--color-white-bg)] text-[var(--color-text)] border"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
     <button
      onClick={() => router.push('/Home')}
     className="px-3 py-1 rounded bg-blue-600 text-white ml-2"
    >
      Go to Home
    </button>
      
      </>
   
  )
}
