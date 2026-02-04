"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { GoogleIcon } from "@hugeicons/core-free-icons";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google Auth endpoint
    // The backend should redirect back to /api/auth/google/callback on frontend
    // ensure backend is configured to redirect to FRONTEND_URL/api/auth/google/callback
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm font-medium"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-black/10"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
        >
          <HugeiconsIcon icon={GoogleIcon} size={20} />
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-black hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
