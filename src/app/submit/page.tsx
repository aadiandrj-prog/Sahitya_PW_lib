"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { uploadFile, submitPoem } from "@/lib/firebase/db";
import { Timestamp } from "firebase/firestore";

export default function SubmitPoem() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [font, setFont] = useState("font-serif");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick redirect if not logged in
  if (!loading && !user) {
    router.push("/login");
    return null;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      let audioUrl = null;

      if (imageFile) {
        imageUrl = await uploadFile(imageFile, "images/");
      }
      if (audioFile) {
        audioUrl = await uploadFile(audioFile, "audio/");
      }

      let createdAt = Timestamp.now();
      if (month && year) {
        createdAt = Timestamp.fromDate(new Date(`${month} 1, ${year}`));
      }

      await submitPoem({
        title,
        author: author || user.displayName || "Anonymous",
        body,
        font,
        imageUrl: imageUrl || undefined,
        audioUrl: audioUrl || undefined,
        createdAt,
        reactions: {},
        userReactions: {},
        comments: [],
      });

      alert("Poem published successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error submitting poem:", error);
      alert("Failed to publish poem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 flex justify-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 via-[#C084FC]/5 to-background -z-10 pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8">
        <div className="text-center mb-8">
          <h1 className="font-display-xl text-3xl font-bold text-on-surface">Share Your Work</h1>
          <p className="text-on-surface-variant mt-2 text-sm">Contribute to the Sahitya Archive</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                placeholder="Poem Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Author (Alias)</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                placeholder={user?.displayName || "Your Name"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={12}
              className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm resize-y"
              placeholder="Type your poem here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">When did you write this?</label>
              <div className="flex gap-2">
                <select
                  value={month} onChange={(e) => setMonth(e.target.value)} required
                  className="flex-1 bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface outline-none"
                >
                  <option value="" disabled>Month</option>
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={year} onChange={(e) => setYear(e.target.value)} required
                  className="w-24 bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface outline-none"
                >
                  <option value="" disabled>Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Mood / Font</label>
              <select
                value={font} onChange={(e) => setFont(e.target.value)}
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-on-surface outline-none"
              >
                <option value="font-serif">Classic (Serif)</option>
                <option value="font-sans">Modern (Sans-Serif)</option>
                <option value="font-mono">Raw (Typewriter)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <label className="block cursor-pointer border border-dashed border-primary/40 bg-primary/5 rounded-xl p-6 text-center hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-primary mb-2 block">image</span>
                <span className="text-sm font-bold text-primary block truncate">
                   {imageFile ? imageFile.name : "Add Background Image (Optional)"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
             </label>
             <label className="block cursor-pointer border border-dashed border-tertiary/40 bg-tertiary/5 rounded-xl p-6 text-center hover:bg-tertiary/10 transition-colors">
                <span className="material-symbols-outlined text-tertiary mb-2 block">mic</span>
                <span className="text-sm font-bold text-tertiary block truncate">
                   {audioFile ? audioFile.name : "Add Voice Recording (Optional)"}
                </span>
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
             </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/40">
             <button
               type="button"
               onClick={() => router.back()}
               className="px-6 py-2 rounded-full text-on-surface-variant hover:bg-white/50 transition-colors font-medium mr-4"
             >
               Cancel
             </button>
             <button
               type="submit"
               disabled={isSubmitting}
               className="bg-primary text-white rounded-full px-8 py-2 font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
             >
               {isSubmitting ? "Publishing..." : "Publish"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}