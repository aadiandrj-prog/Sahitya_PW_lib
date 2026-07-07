"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getUserPoems } from "@/lib/firebase/db";
import { Poem } from "@/types";
import Link from "next/link";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserPoems = async () => {
      if (user?.displayName) {
        try {
          const data = await getUserPoems(user.displayName);
          setPoems(data);
        } catch (error) {
          console.error("Error fetching user poems:", error);
        } finally {
          setFetching(false);
        }
      } else if (user) {
          setFetching(false);
      }
    };
    fetchUserPoems();
  }, [user]);

  if (loading || fetching) {
    return <div className="min-h-screen pt-24 text-center">Loading profile...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 flex justify-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 via-[#C084FC]/5 to-background -z-10 pointer-events-none"></div>

      <div className="w-full max-w-5xl">
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 mb-12 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white text-3xl shadow-sm">
            {user.displayName?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <h1 className="font-display-xl text-3xl font-bold text-on-surface">{user.displayName || "Anonymous User"}</h1>
            <p className="text-on-surface-variant text-sm mt-1">{user.email}</p>
            <p className="text-sm font-semibold text-primary mt-2">{poems.length} Contributions</p>
          </div>
        </div>

        <h2 className="font-display-xl text-2xl text-on-surface mb-6">Your Archive</h2>

        {poems.length === 0 ? (
          <div className="text-center py-12 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
            <p className="text-on-surface-variant mb-4">You haven't shared any poems yet.</p>
            <Link href="/submit" className="text-primary font-bold hover:underline">
              Submit your first piece &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poems.map((poem) => {
              const fontClass = poem.font === 'font-serif' ? 'font-serif' : poem.font === 'font-mono' ? 'font-mono' : 'font-sans';
              return (
                <Link href={`/poem/${poem.id}`} key={poem.id} className="group relative">
                  <div className="h-full bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 p-6 flex flex-col">
                    <h3 className={`text-xl font-bold text-on-surface mb-2 line-clamp-1 ${fontClass}`}>
                      {poem.title}
                    </h3>
                    <p className={`text-on-surface-variant leading-relaxed line-clamp-3 flex-grow ${fontClass} text-sm mb-4`}>
                      {poem.body}
                    </p>
                    <div className="pt-4 border-t border-white/40 text-xs font-semibold text-on-surface/50 uppercase tracking-wider">
                      {poem.createdAt?.toDate ? poem.createdAt.toDate().toLocaleDateString() : "Unknown Date"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}