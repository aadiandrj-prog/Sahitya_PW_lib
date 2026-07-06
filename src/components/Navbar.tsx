"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-white/60 bg-white/40 dark:bg-surface-dim/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center py-3 px-6">
      <Link
        className="font-display-xl text-headline-md tracking-tighter text-primary dark:text-primary-fixed-dim flex items-center gap-2"
        href="/"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          height="32"
          viewBox="0 0 32 32"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2"></circle>
          <path
            d="M11 10V22M21 10V22M11 16H21"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          ></path>
        </svg>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <Link
          className="text-primary font-bold font-body-md text-body-md scale-95 active:scale-90 transition-transform"
          href="/archive"
        >
          Archive
        </Link>
        <Link
          className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md scale-95 active:scale-90 transition-transform"
          href="/community"
        >
          Community
        </Link>
        <Link
          className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md scale-95 active:scale-90 transition-transform"
          href="/about"
        >
          About Us
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {!loading && user ? (
          <div className="flex items-center gap-4">
            <span className="text-on-surface-variant text-sm font-medium hidden sm:inline-block">
              Hi, {user.displayName || "Author"}
            </span>
            <button
              onClick={logout}
              className="bg-white/40 text-on-surface border border-white/60 shadow-sm backdrop-blur-md font-body-md text-sm font-medium px-4 py-2 rounded-full hover:bg-white/60 transition-colors duration-300 scale-95 active:scale-90"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-primary text-white border border-transparent shadow-sm backdrop-blur-md font-body-md text-body-md font-medium px-6 py-2 rounded-full hover:bg-primary/90 transition-colors duration-300 scale-95 active:scale-90"
          >
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
}