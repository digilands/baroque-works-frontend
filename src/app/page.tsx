"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PopularCategories from "@/components/landing/PopularCategories";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg relative overflow-x-hidden font-sans">
      <Navbar />
      <HeroSection />
      <PopularCategories />
      <TrustSection />
      <Footer />
    </main>
  );
}
