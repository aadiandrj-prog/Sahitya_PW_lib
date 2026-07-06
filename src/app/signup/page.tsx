"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 via-surface-bright/50 to-primary/10 -z-10"></div>
      <div className="absolute inset-0 overflow-hidden opacity-20 -z-10">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-tertiary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8">
        <div className="text-center mb-8">
          <h2 className="font-display-xl text-3xl font-bold text-on-surface tracking-tight">
            Create an Account
          </h2>
          <p className="text-on-surface-variant mt-2 font-body-md">
            Join the archive to save and share your work.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Name / Alias
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-tertiary/50 transition-all shadow-sm"
              placeholder="Your pen name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-tertiary/50 transition-all shadow-sm"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-tertiary/50 transition-all shadow-sm"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tertiary text-white rounded-xl py-3 font-medium hover:bg-tertiary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
            {!loading && <span className="material-symbols-outlined text-[18px]">person_add</span>}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="text-tertiary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}