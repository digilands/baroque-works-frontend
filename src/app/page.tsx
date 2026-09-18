import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PopularCategories from "@/components/landing/PopularCategories";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";
import { getCategories } from "@/lib/server/queries";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-bg relative overflow-x-hidden font-sans">
      <Navbar />
      <HeroSection />
      <PopularCategories
        categories={categories.slice(0, 4).map((c) => ({
          title: c.displayName ?? "Services",
          image: c.image?.url ?? "",
          subtitle: c.description,
        }))}
      />
      <TrustSection />
      <Footer />
    </main>
  );
}
