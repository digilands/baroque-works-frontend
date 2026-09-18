import React from "react";
import Link from "next/link";

/** Minimal admin shell — deliberately separate from the main dashboard. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-bold tracking-tight hover:text-gray-300 transition-colors">
            BaroqueWorks · Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
              Overview
            </Link>
            <Link href="/admin/catalog" className="text-white/70 hover:text-white transition-colors">
              Catalog
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
