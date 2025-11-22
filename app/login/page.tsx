"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { setAuthCookie } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_ROUTE_CLANKERS_AUTH

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    router.refresh();

    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validación básica
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      
      setAuthCookie(data.idToken, data.userData);

      
      router.push("/discover");

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F4EE] font-mono px-4 py-6">
      <main className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/LOGOG.png"
              alt="Clankers Reading Logo"
              width={48}
              height={48}
            />
            <h1 className="text-2xl font-bold text-[#2B2B2B]">Clankers Reading</h1>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-2">Welcome Back!</h2>
          <p className="text-[#2B2B2B] text-sm">Log in to conitnue your reading joruney</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2B2B2B] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-[#B8B1A6] bg-[#FCFBF9] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#D6A55F] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#2B2B2B] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-lg border border-[#B8B1A6] bg-[#FCFBF9] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#D6A55F] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#D6A55F] text-[#FCFBF9] font-medium hover:bg-[#B8B1A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mb-6">
          <Link href="/forgot-password" className="text-sm text-[#D6A55F] hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Create Account Section */}
        <div className="text-center space-y-3">
          <p className="text-sm text-[#2B2B2B]">Don&apos;t have an account?</p>
          <Link
            href="/signup"
            className="inline-block w-full py-3 rounded-lg bg-[#FCFBF9] border border-[#B8B1A6] text-[#2B2B2B] font-medium hover:bg-[#EAE7E2] transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Security Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#6F6F6F]">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Never share your password. Your security is our priority.</span>
        </div>
      </main>
    </div>
  );
}

