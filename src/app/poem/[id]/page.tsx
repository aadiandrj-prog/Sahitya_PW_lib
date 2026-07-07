"use client";

import { useEffect, useState, use } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { toggleReaction, postComment } from "@/lib/firebase/db";
import { Poem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function PoemReader({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { user } = useAuth();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  useEffect(() => {
    // We use a listener for real-time reactions and comments
    const unsub = onSnapshot(doc(db, "poems", id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Poem, "id">;
        setPoem({ ...data, id: docSnap.id });

        // Prioritize DB user reaction if available, else fall back to local storage
        if (user && data.userReactions && data.userReactions[user.uid]) {
            setUserReaction(data.userReactions[user.uid]);
        } else {
            setUserReaction(localStorage.getItem(`reaction_poem_${id}`));
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id, user]);

  const handleReaction = async (emojiObj: any) => {
    if (!user) {
        alert("Please log in to react.");
        return;
    }
    const emoji = emojiObj.emoji;
    setShowEmojiPicker(false);

    try {
        const newReaction = await toggleReaction(id, emoji, userReaction, user.uid);
        if (newReaction) {
            localStorage.setItem(`reaction_poem_${id}`, newReaction);
            setUserReaction(newReaction);
        } else {
            localStorage.removeItem(`reaction_poem_${id}`);
            setUserReaction(null);
        }
    } catch (e) {
        console.error("Error reacting:", e);
    }
  };

  const handleToggleExistingReaction = async (emoji: string) => {
      if (!user) {
          alert("Please log in to react.");
          return;
      }
      try {
        const newReaction = await toggleReaction(id, emoji, userReaction, user.uid);
        if (newReaction) {
            localStorage.setItem(`reaction_poem_${id}`, newReaction);
            setUserReaction(newReaction);
        } else {
            localStorage.removeItem(`reaction_poem_${id}`);
            setUserReaction(null);
        }
    } catch (e) {
        console.error("Error reacting:", e);
    }
  }

  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!user) {
        alert("Please log in to comment.");
        return;
    }
    try {
      await postComment(id, commentText, user.displayName || "Anonymous", user.uid);
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-24 text-on-surface">Loading poem...</div>;
  }

  if (!poem) {
    return <div className="min-h-screen flex items-center justify-center pt-24 text-on-surface">Poem not found.</div>;
  }

  const fontClass = poem.font === 'font-serif' ? 'font-serif' : poem.font === 'font-mono' ? 'font-mono' : 'font-sans';

  return (
    <div className="min-h-screen pt-24 pb-12 flex justify-center px-4 relative">
      {/* Background layer */}
      {poem.imageUrl && (
        <div
           className="fixed inset-0 z-[-1] bg-cover bg-center opacity-10 filter blur-[15px] pointer-events-none"
           style={{ backgroundImage: `url(${poem.imageUrl})` }}
        />
      )}
      {!poem.imageUrl && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#38BDF8]/10 via-[#C084FC]/5 to-background -z-10 pointer-events-none"></div>
      )}

      <div className="w-full max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-8 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Archive
        </Link>

        <article className="bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 md:p-16 mb-12">
          <header className="mb-10 text-center">
            <h1 className={`text-4xl md:text-5xl font-bold text-on-surface mb-4 leading-tight ${fontClass}`}>
              {poem.title}
            </h1>
            <div className="text-primary font-medium text-lg mb-2">by {poem.author}</div>
            <div className="text-on-surface-variant text-sm font-semibold uppercase tracking-widest">
              {poem.createdAt?.toDate ? poem.createdAt.toDate().toLocaleDateString('default', { month: 'long', year: 'numeric' }) : "Unknown Date"}
            </div>
          </header>

          {poem.audioUrl && (
            <div className="mb-10">
              <audio controls src={poem.audioUrl} className="w-full h-12 outline-none" />
            </div>
          )}

          <div className={`text-lg leading-relaxed text-on-surface whitespace-pre-wrap ${fontClass} border-t border-b border-white/40 py-10 my-10`}>
            {poem.body}
          </div>

          <footer className="mt-12">
            <h4 className="text-center font-bold text-on-surface mb-6 font-display-xl text-xl">React to this piece</h4>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {Object.entries(poem.reactions || {}).map(([emoji, count]) => {
                if (count <= 0) return null;
                const isActive = userReaction === emoji;
                return (
                  <button
                    key={emoji}
                    onClick={() => handleToggleExistingReaction(emoji)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        isActive
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'bg-white/50 border-white/60 text-on-surface hover:bg-white/80'
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="font-bold text-sm">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center relative mb-12">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="bg-white/60 border border-white/80 shadow-sm rounded-full px-6 py-2 text-sm font-bold text-on-surface hover:bg-white/80 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add_reaction</span>
                  Add Emoji
                </button>

                {showEmojiPicker && (
                    <div className="absolute top-12 z-50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)]">
                        <EmojiPicker onEmojiClick={handleReaction} />
                    </div>
                )}
            </div>

            <div className="bg-surface/30 rounded-2xl p-6 border border-white/40">
                <h4 className="font-bold text-on-surface mb-4">Comments</h4>

                <div className="mb-8">
                    <textarea
                       value={commentText}
                       onChange={(e) => setCommentText(e.target.value)}
                       placeholder={user ? "Share your thoughts..." : "Please log in to comment"}
                       disabled={!user}
                       className="w-full bg-white/50 border border-white/60 rounded-xl p-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] resize-none shadow-sm"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleComment}
                            disabled={!user || !commentText.trim()}
                            className="bg-primary text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            Post Comment
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {poem.comments && [...poem.comments].reverse().map((c, i) => (
                        <div key={i} className="bg-white/60 p-4 rounded-xl border border-white/40 shadow-sm relative pl-4 border-l-4 border-l-primary">
                            <p className="text-on-surface text-sm mb-2">{c.text}</p>
                            <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block text-right">
                                {c.time?.toDate ? c.time.toDate().toLocaleString() : "Just now"}
                            </span>
                        </div>
                    ))}
                    {(!poem.comments || poem.comments.length === 0) && (
                        <div className="text-center text-on-surface-variant text-sm py-4">
                            No comments yet. Be the first!
                        </div>
                    )}
                </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}