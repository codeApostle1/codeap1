# Portfolio Website Beginner Guide (UI + Functionality)

This guide explains how this portfolio is built so a complete beginner can recreate it.

## 1) What the app contains

- A public portfolio homepage with sections (hero, about, skills, projects, contact).
- A projects listing page.
- Authentication pages (login + sign-up).
- An admin dashboard where the owner can manage projects and moderate comments.

## 2) Core app structure

- `app/layout.tsx`: wraps all pages with global providers and styles.
- `app/page.tsx`: public homepage that composes section components.
- `app/projects/page.tsx`: projects list page.
- `app/admin/page.tsx`: protected admin area.
- `components/*`: reusable UI blocks (navbar, hero, featured projects, dashboard).
- `app/admin/actions.ts`: secure server actions for admin CRUD operations.
- `app/globals.css`: global styles and design tokens.

## 3) Essential UI composition (the "page assembly" idea)

The homepage is built by stacking reusable sections in `app/page.tsx`:

```tsx
<Navbar />
<HeroSection />
<AboutSection />
<SkillsSection />
<FeaturedProjects />
<ContactSection />
<Footer />
```

Beginner lesson: each section is an independent component. This makes your project easy to grow.

## 4) Vital styling lines (how design is controlled)

### A) Layout + surface

- `min-h-screen bg-background`: ensures full viewport height and theme-aware background.
- `fixed ... backdrop-blur-xl`: sticky glass-style navbar.
- Tailwind utility classes are used directly in JSX to style spacing, colors, typography, and responsive behavior.

### B) Responsive navigation

In `components/navbar.tsx`, the menu uses:

- `md:flex` / `md:hidden` to switch desktop vs mobile layout.
- `useState(false)` and menu button toggling for mobile drawer behavior.

### C) Theming

`ThemeToggle` component appears in navbar and uses project theme setup for dark/light mode.

## 5) Vital functionality lines (admin + data)

### A) Admin authorization guard

In `app/admin/actions.ts`, every critical action starts with:

1. Create Supabase server client.
2. Verify authenticated user.
3. Verify user is admin email (`isAdminEmail`).

This pattern protects writes like add/update/delete projects.

### B) Project creation/update

`addProject` and `updateProject` both:

- Parse form fields.
- Validate required data.
- Optionally upload image to Supabase storage.
- Save `published_at` and `show_published_date` fields.
- Revalidate affected pages (`/`, `/projects`, `/admin`) so UI updates instantly.

### C) Comment moderation

`approveComment`, `deleteComment`, and `replyToComment` provide admin moderation workflow.

## 6) Step-by-step process for beginners

1. **Create a Next.js app** with App Router + TypeScript.
2. **Install Tailwind CSS** and create global design tokens in `app/globals.css`.
3. **Build reusable sections** (`components/*`) and compose them in `app/page.tsx`.
4. **Add Supabase**:
   - Create project.
   - Add env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   - Create tables for projects/comments.
5. **Create auth pages** (`/auth/login`, `/auth/sign-up`) and callback route.
6. **Create admin dashboard** UI (`components/admin-dashboard.tsx`).
7. **Add server actions** (`app/admin/actions.ts`) for secure CRUD.
8. **Protect admin routes** by user + email allowlist checks.
9. **Display projects publicly** (`FeaturedProjects`, `/projects`).
10. **Test and build**:
    - `npm run build`
    - `npx tsc --noEmit`
    - `npm run lint` (after setting proper eslint config/ignores)

## 7) Database essentials

Minimum tables:

- `projects`: title, description, url, image_url, image_focus_x, image_focus_y, published_at, show_published_date, user_id.
- `project_comments`: project_id, name, comment, parent_id, is_admin_reply, is_approved.

Also create a storage bucket (for project images), e.g. `project-images`.

## 8) Why this architecture is beginner-friendly

- Components isolate UI complexity.
- Server actions isolate sensitive operations.
- Tailwind gives fast styling feedback.
- Revalidation keeps UI fresh after admin updates.
- Small files with clear responsibility are easier to learn.

## 9) Learning roadmap (if you have never coded)

Week 1: HTML/CSS basics + React components.
Week 2: Next.js routing + props/state.
Week 3: Forms + validation + simple API concepts.
Week 4: Supabase auth + database + storage.
Week 5: Admin CRUD + moderation workflow.
Week 6: Polish design + deploy.

If you follow this structure, you can build a professional portfolio with real admin tools and dynamic content.


## 10) `.env.local` example

Copy `.env.local.example` to `.env.local` and fill real values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
ADMIN_EMAILS=you@example.com
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback?next=/admin
```

Tips:
- `NEXT_PUBLIC_SUPABASE_*` values come from Supabase Dashboard → Project Settings → API.
- `ADMIN_EMAILS` controls who can access `/admin`.
- Keep `.env.local` out of git (it is already ignored in most Next.js setups).
