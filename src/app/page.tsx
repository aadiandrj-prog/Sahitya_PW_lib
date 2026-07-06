"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll(".cursor-reactive-container").forEach((container) => {
        const el = container.querySelector(".cursor-reactive") as HTMLElement;
        if (el) {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;

          if (
            e.clientY >= rect.top - window.innerHeight &&
            e.clientY <= rect.bottom + window.innerHeight
          ) {
            el.style.setProperty("--mouse-x", `${x}%`);
            el.style.setProperty("--mouse-y", `${y}%`);
          }
        }
      });

      const ctaContainer = document.querySelector(".group\\/cta") as HTMLElement;
      if (ctaContainer) {
        const rect = ctaContainer.getBoundingClientRect();
        ctaContainer.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        ctaContainer.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      }

      const cursor = document.getElementById("custom-cursor");
      if (cursor) {
          cursor.style.display = 'block';
      }
    };

    let cursorX = 0;
    let cursorY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const animateCursor = () => {
      const cursor = document.getElementById("custom-cursor");
      if (cursor) {
        let dx = mouseX - cursorX;
        let dy = mouseY - cursorY;
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateCursor);
    };

    const handleMouseUpdate = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const handleMouseEnter = () => {
        const cursor = document.getElementById("custom-cursor");
        if (cursor) cursor.style.display = "block";
    }

    const handleMouseLeave = () => {
        const cursor = document.getElementById("custom-cursor");
        if (cursor) cursor.style.display = "none";
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousemove", handleMouseUpdate);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    animateCursor();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", handleMouseUpdate);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-white/60 bg-white/40 dark:bg-surface-dim/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center py-3 px-6">
        <a
          className="font-display-xl text-headline-md tracking-tighter text-primary dark:text-primary-fixed-dim flex items-center gap-2"
          href="#"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            height="32"
            viewBox="0 0 32 32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="15" stroke="black" strokeWidth="2"></circle>
            <path
              d="M11 10V22M21 10V22M11 16H21"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            ></path>
          </svg>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a
            className="text-primary font-bold font-body-md text-body-md scale-95 active:scale-90 transition-transform"
            href="#"
          >
            Archive
          </a>
          <a
            className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md scale-95 active:scale-90 transition-transform"
            href="#"
          >
            Community
          </a>
          <a
            className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md scale-95 active:scale-90 transition-transform"
            href="#"
          >
            About Us
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="bg-white/40 text-on-surface border border-white/60 shadow-sm backdrop-blur-md font-body-md text-body-md font-medium px-6 py-2 rounded-full hover:bg-white/60 transition-colors duration-300 scale-95 active:scale-90 transition-transform"
            href="#"
          >
            Login / Signup
          </a>
        </div>
      </nav>

      <main className="max-w-[1728px] mx-auto w-full">
        {/* Section 1: Hero */}
        <section className="relative pt-48 pb-section-gap px-container-padding min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden cursor-reactive-container">
          <div className="absolute inset-0 hero-dynamic-gradient cursor-reactive -z-10"></div>
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full px-4 py-2 mb-8 shadow-sm">
            <span className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-2 py-1 rounded-full uppercase">
              NEW
            </span>
            <span className="font-body-md text-body-md text-on-surface">
              Welcome to the New Sahitya Archive
            </span>
          </div>
          <h1 className="font-display-xl text-[64px] leading-[1.1] tracking-tighter text-on-surface max-w-4xl mb-6">
            Preserving Our Community's Literary Works
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
            Explore, read, and share poetry in an airy, minimalist workspace designed for seamless literary immersion.
          </p>

          <div className="w-full max-w-[870px] bg-white/40 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 mb-8 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="w-full bg-transparent border-none resize-none font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:ring-0 min-h-[40px] outline-none"
                placeholder="🔍 Search by title, author, or line..."
              />
              <div className="flex items-center justify-between pt-4 border-t border-white/40">
                 <div className="flex items-center gap-3">
                   <span className="font-body-md text-body-md text-on-surface-variant">Find the perfect poem</span>
                 </div>
                <button className="bg-white/50 border border-white/60 text-on-surface rounded-full w-12 h-12 flex items-center justify-center shadow-sm hover:bg-white/70 transition-colors scale-95 active:scale-90">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="bg-white/30 text-on-surface border border-white/50 shadow-sm rounded-full px-5 py-2 font-body-md text-body-md hover:bg-white/50 transition-colors backdrop-blur-md">
              Submit a Poem
            </button>
            <button className="bg-white/30 text-on-surface border border-white/50 shadow-sm rounded-full px-5 py-2 font-body-md text-body-md hover:bg-white/50 transition-colors backdrop-blur-md">
              Browse by Month
            </button>
          </div>
        </section>

        {/* Section 3: Feature 01 */}
        <section className="pt-section-gap pb-0 px-container-padding relative">
          <div className="max-w-[1118px] mx-auto bg-white/40 backdrop-blur-2xl rounded-[10px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[596px]">
            <div className="p-card-internal flex-1 flex flex-col justify-center">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-6 tracking-widest">
                01 / 02
              </span>
              <h3 className="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">
                Share your poetry with the community
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
                Publish your works instantly. Customize the reading experience by adding background images, choosing fonts, or even uploading voice recordings.
              </p>
              <a
                className="inline-flex items-center justify-center gap-2 bg-white/40 border border-white/60 shadow-sm backdrop-blur-md text-on-surface font-body-md text-body-md font-medium px-8 py-4 rounded-[8px] w-fit hover:bg-white/60 transition-colors"
                href="#"
              >
                Submit Now
              </a>
            </div>
            <div className="flex-1 bg-white/20 relative overflow-hidden flex items-center justify-end border-l border-white/40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-bright/50 to-tertiary/10"></div>
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-tertiary/20 rounded-full blur-[100px]"></div>
              </div>
              <div className="relative z-10 w-[85%] h-[80%] mx-auto bg-white/10 backdrop-blur-[32px] rounded-2xl border border-white/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
                <div className="flex items-center justify-center p-4 border-b border-white/10">
                  <div className="flex p-1 rounded-full border border-white/20 backdrop-blur-md bg-white/40">
                    <button className="px-4 py-1.5 rounded-full text-[12px] font-bold bg-white text-on-surface shadow-sm">
                      Classic
                    </button>
                    <button className="px-4 py-1.5 rounded-full text-[12px] font-semibold text-on-surface hover:text-primary transition-colors">
                      Modern
                    </button>
                    <button className="px-4 py-1.5 rounded-full text-[12px] font-semibold text-on-surface hover:text-primary transition-colors">
                      Typewriter
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-6">
                  <div className="space-y-5">
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-2">
                         <div className="h-4 w-1/3 bg-on-surface/60 rounded-full mb-4"></div>
                        <div className="h-1.5 w-full bg-on-surface/30 rounded-full"></div>
                        <div className="h-1.5 w-5/6 bg-on-surface/30 rounded-full"></div>
                        <div className="h-1.5 w-4/6 bg-on-surface/30 rounded-full"></div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
                      <div className="h-12 bg-white/30 rounded-xl border border-white/40 flex items-center justify-center text-xs font-bold text-on-surface/60">
                        📷 Add Background
                      </div>
                      <div className="h-12 bg-white/30 rounded-xl border border-white/40 flex items-center justify-center text-xs font-bold text-on-surface/60">
                        🎙️ Add Audio
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Feature 02 */}
        <section className="pt-10 pb-section-gap px-container-padding relative">
          <div className="max-w-[1118px] mx-auto bg-white/40 backdrop-blur-2xl rounded-[10px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[596px]">
            <div className="p-card-internal flex-1 flex flex-col justify-center">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-6 tracking-widest">
                02 / 02
              </span>
              <h3 className="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">
                Engage and Connect
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
                Create an account to securely save your favorites, interact with poems using emojis, and leave anonymous comments safely validated by our backend.
              </p>
            </div>
            <div className="flex-1 bg-surface relative overflow-hidden flex items-center justify-center backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/5 to-tertiary/10"></div>
              <div
                className="absolute inset-0 opacity-30 mix-blend-soft-light"
                style={{
                  backgroundImage: "radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 100%)",
                }}
              ></div>
              <div className="relative z-10 w-[80%] bg-white/60 backdrop-blur-[40px] rounded-3xl border border-white/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                      <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                    </div>
                    <div>
                      <span className="block text-on-surface font-bold text-base leading-none">
                        Reactions
                      </span>
                      <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                        Live Data
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                   <div className="flex items-center gap-3 text-on-surface-variant text-[13px] font-medium">
                    <span className="material-symbols-outlined text-sm font-bold">verified_user</span>
                    <span className="font-body-md">Authenticated securely</span>
                  </div>
                   <div className="flex items-center gap-3 text-on-surface-variant text-[13px] font-medium">
                    <span className="material-symbols-outlined text-sm font-bold">sync</span>
                    <span className="font-body-md">Real-time comment updates</span>
                  </div>
                   <div className="mt-6 p-4 bg-white/80 rounded-2xl border border-white shadow-sm flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary text-[18px]">add_reaction</span>
                       <span className="text-on-surface text-[12px] font-bold">Interact with a poem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Final CTA */}
        <section className="py-section-gap px-container-padding relative overflow-hidden flex flex-col items-center justify-center min-h-[70vh] group/cta">
          <div className="absolute inset-0 bg-surface -z-10"></div>
          <div
            className="absolute inset-0 opacity-20 -z-10"
            style={{
              background:
                "radial-gradient(circle at 10% 20%, #312e81 0%, transparent 50%), radial-gradient(circle at 90% 80%, #581c87 0%, transparent 50%), radial-gradient(circle at 50% 50%, #134e4a 0%, transparent 70%)",
            }}
          ></div>
          <div
            className="absolute inset-0 -z-10 opacity-0 group-hover/cta:opacity-40 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.3), transparent 60%)",
            }}
          ></div>
          <h2 className="font-display-xl text-[54px] leading-tight mb-10 text-center relative z-10 max-w-2xl drop-shadow-sm text-on-surface">
            Ready to explore?
          </h2>
          <a
            className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-md border border-white/60 font-body-md text-body-md font-medium px-6 py-2.5 rounded-full hover:bg-white/60 hover:scale-105 transition-all shadow-sm group relative z-10 text-on-surface"
            href="#"
          >
            Enter the Archive
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface text-[16px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </a>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="bg-transparent w-full py-8 text-secondary dark:text-secondary-fixed-dim font-body-md text-body-md relative z-20 -mt-[80px]">
        <div className="max-w-[1515px] mx-auto px-container-padding flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-display-xl text-headline-md hover:opacity-100 transition-opacity flex items-center gap-2 text-on-surface">
            Sahitya PW
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a className="hover:text-primary transition-colors hover:opacity-100 transition-opacity text-on-surface" href="#">
              About Us
            </a>
            <a className="hover:text-primary transition-colors hover:opacity-100 transition-opacity text-on-surface" href="#">
              Contact Us
            </a>
            <a className="hover:text-primary transition-colors hover:opacity-100 transition-opacity text-on-surface" href="#">
              Report Issue
            </a>
          </div>
          <div className="text-sm text-on-surface">
             Made to preserve community works.
          </div>
        </div>
      </footer>

      <div id="custom-cursor"></div>
    </>
  );
}