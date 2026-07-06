# Sahitya PW Archive - Audit Report & Migration Roadmap

## 1. Audit Findings

### Code Quality & Architecture
**Current State:**
- The project is built using vanilla HTML, CSS, and JavaScript.
- All logic (fetching, uploading, DOM manipulation) is tightly coupled in a single `app.js` file (~300 lines).
- Lacks a modern build tool or bundler, making it harder to manage dependencies and optimize assets.
- Hardcoded HTML components limit reusability and scalability.

**Improvements Needed:**
- **Component-Based Architecture:** Moving to a component-based framework like React or Next.js will make the codebase modular, maintainable, and easier to scale.
- **State Management:** Complex states (like all poems, active user reactions, reader modal state) are managed via global variables. A proper state management system (e.g., React Context, Zustand) is required.
- **Routing:** Currently, the app relies on single-page DOM replacement and modal overlays. A dedicated router would improve navigation and allow direct linking to specific poems or sections.

### Security
**Current State:**
- **Hardcoded Firebase Credentials:** The Firebase configuration, including the `apiKey`, `projectId`, etc., is exposed directly in `app.js`.
- **Database Rules & Anonymity:** Currently, it seems anyone can write to the database anonymously without authentication, which leaves the app vulnerable to spam, abuse, and quota exhaustion.
- **LocalStorage for Reactions:** Reaction limits are currently handled via LocalStorage, which can easily be cleared or manipulated by a user to vote multiple times.

**Improvements Needed:**
- **Environment Variables:** Move all sensitive API keys and configuration to environment variables (`.env`). Even though Firebase client keys are somewhat public, utilizing a backend/serverless layer for sensitive operations is safer.
- **Authentication & Authorization:** Introduce user authentication (Firebase Auth). Only authenticated users should be allowed to submit or comment.
- **Backend Validation:** Move reaction tracking to a backend or use secure Firestore Rules tied to User IDs instead of LocalStorage.

### UI/UX & Design
**Current State:**
- The UI follows a classic, literary theme using traditional serif fonts and vignette effects.
- It is functional but feels slightly dated and lacks the fluidity and polish of modern web applications.
- Layout shifting can occur during loading or searching.

**Improvements Needed:**
- **Design Overhaul (Horizon Template):** Transition to a modern, glassmorphism-based UI (inspired by the Horizon template). This includes using vibrant, dynamic gradients, blur backdrops, and modern sans-serif fonts (like Plus Jakarta Sans).
- **Animations & Micro-interactions:** Add smooth transitions for opening modals, submitting forms, and hovering over cards.
- **Responsive & Accessible Components:** Utilize a utility-first CSS framework like Tailwind CSS to quickly build out the new responsive and accessible components.

### User Features
**Current State:**
- Anonymous poem submission.
- Anonymous commenting and emoji reactions.
- Search functionality.
- Simple dark/light mode toggle.

**Improvements Needed:**
- **User Accounts & Profiles:** Allow users to create accounts to manage their submissions, track their reactions, and bookmark favorite poems.
- **Rich Text / Markdown Editor:** Instead of a plain textarea, provide a rich text editor for formatting poems.
- **Social Features:** Follow authors, share to social media (with auto-generated preview images), and view a personalized feed.
- **Admin Dashboard:** Implement a moderation dashboard for admins to review, edit, or remove inappropriate submissions and comments.

---

## 2. Migration Roadmap

To transition this project from its current state to a professional, scalable, and secure platform, here is a phased roadmap:

### Phase 1: Architecture & Setup
1. **Initialize Next.js Project:** Setup a new Next.js 14+ (App Router) project with TypeScript and Tailwind CSS.
2. **Setup Firebase Admin & Client:** Configure Firebase securely. Use `.env.local` for the client keys and Firebase Admin SDK on the server side for secure operations.
3. **Design System Integration:** Import the core design tokens, fonts (Plus Jakarta Sans), and CSS animations from the Horizon template into `tailwind.config.ts` and `globals.css`.

### Phase 2: Authentication & Security
1. **Implement Firebase Auth:** Create Login/Signup pages using Firebase Authentication (Email/Password & Google OAuth).
2. **Secure Firestore Rules:** Update Firebase Security Rules to restrict read/write access. For example:
   - Anyone can read poems.
   - Only authenticated users can write comments or react.
   - Only the author or an admin can delete/edit a poem.
3. **Move Logic to Server Actions/APIs:** Refactor the direct database calls into Next.js Server Actions or API routes to hide implementation details and validate payloads securely.

### Phase 3: Core Features Refactoring (The UI Overhaul)
1. **Layout & Navigation:** Build the glassmorphic sidebar/navigation bar from the template.
2. **Poem Feed (Home Page):** Rebuild the poem grid using modern glassmorphism cards. Implement server-side rendering or static site generation with Incremental Static Regeneration (ISR) for faster load times.
3. **Submission Form:** Create a dedicated, secure submission page using a rich text editor.
4. **Reader View:** Build a dynamic route (`/poem/[id]`) for a full-page, distraction-free reading experience, complete with dynamic gradient backgrounds.

### Phase 4: Enhancements & Social Features
1. **User Profiles:** Build user profile pages displaying their submitted poems.
2. **Robust Reactions & Comments:** Replace LocalStorage with database-backed tracking tied to User IDs.
3. **Search & Filtering:** Implement a robust search experience (potentially leveraging Algolia or Meilisearch if scaling, or optimized Firestore queries).

### Phase 5: Testing & Deployment
1. **Testing:** Write end-to-end tests using Playwright and unit tests for core utilities to ensure the new architecture is stable.
2. **Deployment:** Deploy the application to Vercel, ensuring all environment variables and build steps are properly configured.
