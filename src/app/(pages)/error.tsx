"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Public pages segment boundary. */
export default function PagesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">
        Something went wrong
      </p>
      <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
        We couldn&apos;t load this page
      </h1>
      <p className="text-gray-500 font-medium max-w-md mb-8">
        Check your connection and try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3.5 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
