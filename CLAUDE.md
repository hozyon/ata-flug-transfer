# ATA FLUG TRANSFER — Developer Guide

VIP airport transfer booking SPA for Antalya, Turkey. React 18 + TypeScript + Vite 6 + Tailwind CSS v4 + Zustand + Supabase.

**GitHub:** https://github.com/hozyon/ata-flug-transfer

## Commands

```bash
npm run dev      # Vite dev server (port 3000)
npm run build    # Production build → /dist
npm run preview  # Preview production build locally
npm run lint     # ESLint (TypeScript + React hooks)
```

No test runner is configured (Vitest kurulu ama aktif script yok).

## Environment Setup

```bash
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

Without env vars the app starts with **empty state** — no data shown. Supabase credentials required for development.

Dev admin login: Supabase Auth ile `ataflugtransfer@gmail.com` (gerçek credentials .env.local'da)

## Architecture

### Routing & Auth

- React Router v7 with path-based routes: `/login`, `/blog/:slug`, `/admin/*`, etc.
- `isAdmin` in Zustand controls rendering: `true` → `<AdminPanel>`, `false` → public `<Routes>`
- `App.tsx` sets `isAdmin` via Supabase `onAuthStateChange`; dev mode falls back to hardcoded credential check

### State Layer

Single Zustand store at `src/store/useAppStore.ts` owns all runtime state (bookings, siteContent, isAdmin).

- Initializes **only from Supabase**. If not configured → empty state (`[]`, `INITIAL_SITE_CONTENT` with blank contact fields)
- All mutations write to Supabase first, **throw on error** (no silent fallback, no localStorage fallback)
- `src/lib/supabase.ts` — Supabase client + `isSupabaseConfigured` flag

**Supabase tables:** `bookings`, `site_content` (singleton `id=1`), `blog_posts`, `reviews`

**localStorage — business data is NEVER stored here. Only UI preferences:**
- `ata_language` — language preference
- `ata_admin_theme` — light/dark theme
- `ata_ai_api_key` — Claude AI API key (intentional client-only, not sent to server)
- `ata_blog_draft_v1` — unsaved blog post draft (editor cache, cleared on save)

**Do NOT add localStorage reads/writes for business data (bookings, site content, blog posts, reviews).** Supabase is the single source of truth.

### mergeContent() — Critical Function

`mergeContent()` in `src/store/mergeContent.ts` merges Supabase-persisted data with `INITIAL_SITE_CONTENT` defaults. **This function has a strict contract — do not break it:**

- **`parsed.regions`** is the **source of truth** for which regions are active. INITIAL defaults are only used to fill in missing fields on existing regions. A region not present in `parsed.regions` must **never** be re-added (user may have deactivated it).
- Exception: if `parsed.regions === undefined` (first-time init, no saved data), fall back to all INITIAL defaults.
- `blogPosts` are stored separately in the `blog_posts` Supabase table, **not** inside `site_content`. If Supabase returns 0 blog posts, return `[]` — do **not** fall back to the `BLOG_POSTS` constant.

### SiteContent — Extended Fields

`SiteContent` in `src/types.ts` includes these fields beyond the obvious UI content:

- `regions[]` — active transfer destinations with prices (`price` field per region)
- `adminAccount` — admin profile, notification prefs, password history

All of these are persisted inside the `site_content` JSONB column in Supabase and flow through the AdminPanel auto-save mechanism (300ms debounce).

### Admin Panel

`src/components/AdminPanel.tsx` is a large monolithic component. Each admin view is lazy-loaded under `src/components/admin/views/`.

**Auto-save flow:**
1. Any `setEditContent(...)` call in a view updates `editContent` state
2. `useEffect([editContent])` in AdminPanel fires (debounced 300ms)
3. `editContentRef.current` (not stale `editContent`) is read inside the timer
4. `onUpdateSiteContent(toSave)` is awaited — error shows toast, does not silently swallow
5. **No localStorage write on success** — Supabase is the only persistence target

**Error boundary:** `AdminViewErrorBoundary` wraps the `<Suspense>` block. A crash in any lazy view shows a "Tekrar Dene" button instead of taking down the whole panel. The error state resets automatically when the user navigates to a different view.

**Active views and their editContent fields:**
- `RegionsView` — reads/writes `editContent.regions` (bölgeler + fiyatlar)
- `BusinessSettingsView` — reads/writes `editContent.business`
- `FleetView` — reads/writes `editContent.vehicles`
- `FAQView` — reads/writes `editContent.faq`
- `SEOView` — reads/writes `editContent.seo`
- `AboutView`, `VisionMissionView`, `HeroImagesView` — respective fields

### i18n

Turkish is the source language. All other languages are auto-translated via Google Translate API.

- `t('key')` resolves through `src/i18n/translations.ts` → Turkish text → translated text
- Add new UI strings to `src/i18n/translations.ts` only — no per-language files needed
- `LanguageSwitcher` supports both hover (desktop) and click/tap (mobile) — `onClick` toggle + `pointerdown` outside-click handler
- Mobile menu sheet (`Navbar.tsx`) contains an inline language selector row (flat buttons, no dropdown) for easy language switching on touch devices
- **Never use `onMouseEnter/onMouseLeave` as the sole interaction** for interactive UI — always add `onClick` or `active:` Tailwind class for touch support

### CSS

Tailwind v4 — do **not** use the old `@tailwind` directives:

```css
/* src/index.css */
@import "tailwindcss";  /* correct */
```

PostCSS plugin is `@tailwindcss/postcss` (not `tailwindcss` directly).

Brand tokens:
- Gold: `#c5a059` | Dark: `#0f172a` | Darker: `#020617`
- Fonts: Montserrat (body), Outfit (headings), Playfair Display (decorative)

### SEO System

SEO is managed via `SeoSettings` in `src/types.ts` and stored as part of `SiteContent.seo`.

- Defaults defined in `INITIAL_SITE_CONTENT.seo` in `src/constants.ts`
- Admin UI: `src/components/admin/views/SEOView.tsx` — accessible via sidebar "SEO Yönetimi"
- Global meta tags + JSON-LD structured data rendered in `App.tsx` home route `<Helmet>`
- Per-page SEO fields: `pagesSeo.{home,about,regions,blog,faq,contact}`
- `public/robots.txt` — crawl directives; `public/sitemap.xml` — static sitemap

## Deployment

```bash
git push   # Vercel auto-deploys from GitHub (linked via vercel link --repo)
```

- Vercel project linked to `git@github.com:hozyon/ata-flug-transfer.git` under `hasanozyon-8289s-projects`
- Every push to `main` triggers a production deployment automatically
- `vercel.json` includes SPA rewrites — no extra config needed
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project environment variables
- Before first deploy, run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor

## Known Bug History — Do Not Reintroduce

These bugs were fixed and must not be reintroduced:

### mergeContent Overwrite Pattern (fixed 2026-03-22)

**Symptom:** Region prices reset to 50, deactivated regions reappear, blog posts reappear.
**Root cause:** `mergeContent` iterated over `INITIAL_SITE_CONTENT.regions` instead of `parsed.regions`, re-adding removed items and overwriting saved values with defaults.
**Rule:** Always use `parsed.*` arrays as the source of truth. INITIAL is only for first-time defaults and filling missing fields.

### Stale Closure in Auto-Save (fixed 2026-03-22)

**Symptom:** Price/content changes not saved despite success toast.
**Root cause:** `editContent` was captured at effect creation time inside `setTimeout`. By the time the timer fired, `editContent` had old values.
**Rule:** Always read `editContentRef.current` (not `editContent`) inside async timer callbacks.

### Silent Supabase Errors (fixed 2026-03-22)

**Symptom:** Save appeared to succeed (toast shown) but Supabase was never updated.
**Root cause:** `updateSiteContent` caught errors, saved to localStorage fallback, and did not throw — so the caller's catch block never ran.
**Rule:** `updateSiteContent` must throw on Supabase error. AdminPanel catch block shows error toast.

### Blog Posts Fallback to BLOG_POSTS Constant (fixed 2026-03-22)

**Symptom:** Deleted blog posts reappear after page refresh.
**Root cause:** `loadBlogFromLS()` returned `BLOG_POSTS` constant when localStorage was empty; store used this when Supabase returned 0 rows.
**Rule:** Empty Supabase result → `[]`. Never fall back to hardcoded `BLOG_POSTS`.

### localStorage-Only Admin Views (fixed 2026-03-22)

**Symptom:** PricingRules, Drivers, Coupons lost on different device/browser or after localStorage clear.
**Root cause:** These views wrote directly to localStorage instead of going through `editContent` → auto-save → Supabase.
**Rule:** All admin data must flow through `editContent`/`setEditContent` → AdminPanel auto-save → Supabase.

### Hardcoded Business Data in Public UI (fixed 2026-03-25)

**Symptom:** BookingForm showed hardcoded WhatsApp number and hardcoded region list even when DB had different data. Navbar showed hardcoded business name.
**Root cause:** `BUSINESS_INFO` and `DESTINATIONS` constants exported from `constants.ts` were used directly in `BookingForm.tsx` and `Navbar.tsx` instead of reading from the store.
**Rule:** Never use `BUSINESS_INFO`, `DESTINATIONS`, or any business-data constants in components. Always read from `siteContent` (store state). These exports have been deleted from `constants.ts`.

### localStorage as Business Data Cache (fixed 2026-03-25)

**Symptom:** Business data (bookings, site content, blog posts, reviews) survived in localStorage after Supabase data was changed from another device.
**Root cause:** Store mutations wrote to localStorage as "offline cache" after every Supabase write. `loadXxxFromLS()` functions were used as fallback on init.
**Rule:** localStorage must never store business data. All 8 LS helper functions (`loadBookingsFromLS`, `saveBookingsToLS`, etc.) have been deleted. Supabase is the only persistence layer.

## Blog Post System

Blog posts are stored in the `blog_posts` Supabase table. The `BLOG_POSTS` constant in `src/constants.ts` is **not used at runtime** — it exists only as a reference/seed source.

- Admin panel has a "Tümünü Sil" button in BlogView (requires confirmation, deletes from Supabase)
- `clearAllBlogPosts()` in the store handles bulk deletion
- Supabase RLS: delete requires authenticated session (anon key cannot delete)

### setBlogPosts Prop Type

`BlogViewProps.setBlogPosts` is `(posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => Promise<void>` — async, matches AdminPanel's implementation.

### Homepage Blog Section

Homepage blog highlights section (`#blog-highlights` in `App.tsx`) renders only when `blogPosts.length > 0`. It uses `useMemo` over the store's `blogPosts` (not the hardcoded `BLOG_POSTS` constant). If there are no blog posts, the entire section is hidden.

## Mobile — Rules & Known Fixes

### Hover-Only Interactions (fixed 2026-03-22)

**Symptom:** Language switcher, dropdowns, or hover-highlighted elements don't respond to tap on mobile.
**Root cause:** Interactions bound only to `onMouseEnter/onMouseLeave` — no touch/click equivalent.
**Rule:** Every interactive element must have an `onClick` handler. Use `active:` Tailwind classes for visual tap feedback. Never rely solely on hover events.

### LanguageSwitcher Mobile (fixed 2026-03-22)

**Symptom:** Users could not change language on mobile — dropdown never opened.
**Root cause:** `LanguageSwitcher` had no `onClick` on the trigger button; only `onMouseEnter` on the wrapper.
**Fix:** Added `onClick` toggle to button + `pointerdown` outside-click handler. Also added inline language row inside the mobile bottom sheet.

### Homepage Blog Posts Showing When Empty (fixed 2026-03-22)

**Symptom:** Blog section heading visible even with no blog posts.
**Root cause:** `<section>` rendered unconditionally; grid was empty but header/eyebrow still showed.
**Rule:** Wrap the entire blog section with `{randomBlogPosts.length > 0 && (...)}`.

### Homepage Used Hardcoded BLOG_POSTS (fixed 2026-03-22)

**Symptom:** Deleted blog posts reappeared on the homepage after admin deletion.
**Root cause:** `RANDOM_BLOG_POSTS` was computed at module load from the `BLOG_POSTS` constant, never reading live store data.
**Rule:** Use `useMemo(() => [...blogPosts].sort(...).slice(0, 4), [blogPosts])` inside the component.

### Mobile Autocomplete Missing (fixed 2026-03-22)

**Rule:** All name/email/phone inputs must have correct `autoComplete` attributes:
- First name → `autoComplete="given-name"`
- Last name → `autoComplete="family-name"`
- Phone → `autoComplete="tel"`
- Email → `autoComplete="email"`
- Full name → `autoComplete="name"`

### Hooks After Conditional Return (fixed 2026-03-22)

**Symptom:** TypeScript/React error or unexpected behavior in `TransferDestination.tsx`.
**Root cause:** `useLanguage()` was called after an early `return <Navigate />`, violating React's Rules of Hooks.
**Rule:** All hooks must be called unconditionally at the top of the component, before any early returns.
