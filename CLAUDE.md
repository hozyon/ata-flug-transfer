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

No test runner is configured.

## Environment Setup

```bash
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

Without env vars the app runs in **localStorage fallback mode** — fully functional for development.

Dev admin login: Supabase Auth ile `ataflugtransfer@gmail.com` (gerçek credentials .env.local'da)

## Architecture

### Routing & Auth

- React Router v7 with path-based routes: `/login`, `/blog/:slug`, `/admin/*`, etc.
- `isAdmin` in Zustand controls rendering: `true` → `<AdminPanel>`, `false` → public `<Routes>`
- `App.tsx` sets `isAdmin` via Supabase `onAuthStateChange`; dev mode falls back to hardcoded credential check

### State Layer

Single Zustand store at `src/store/useAppStore.ts` owns all runtime state (bookings, siteContent, isAdmin).

- Initializes from Supabase when `isSupabaseConfigured === true`, otherwise from localStorage
- All mutations (addBooking, updateSiteContent, etc.) write to Supabase first, **throw on error** (no silent fallback)
- `src/lib/supabase.ts` — Supabase client + `isSupabaseConfigured` flag

**Supabase tables:** `bookings`, `site_content` (singleton `id=1`), `blog_posts`, `reviews`

**localStorage keys (fallback mode only — not used when Supabase is configured):**
- `ata_bookings_v6` — bookings
- `ata_site_content_v10` — site content (also updated on every successful Supabase write as offline cache)
- `ata_blog_posts_v1` — blog posts
- `ata_user_reviews_v1` — pending reviews
- `ata_language` — language preference
- `ata_admin_theme` — light/dark

### mergeContent() — Critical Function

`mergeContent()` in `src/store/useAppStore.ts` merges Supabase-persisted data with `INITIAL_SITE_CONTENT` defaults. **This function has a strict contract — do not break it:**

- **`parsed.regions`** is the **source of truth** for which regions are active. INITIAL defaults are only used to fill in missing fields on existing regions. A region not present in `parsed.regions` must **never** be re-added (user may have deactivated it).
- Exception: if `parsed.regions === undefined` (first-time init, no saved data), fall back to all INITIAL defaults.
- Same rule applies to `pricingRules`, `drivers`, `coupons` — use `parsed` arrays as-is, never add back from defaults.
- `blogPosts` are stored separately in the `blog_posts` Supabase table, **not** inside `site_content`. If Supabase returns 0 blog posts, return `[]` — do **not** fall back to the `BLOG_POSTS` constant.

### SiteContent — Extended Fields

`SiteContent` in `src/types.ts` includes these fields beyond the obvious UI content:

- `regions[]` — active transfer destinations with prices (`price` field per region)
- `pricingRules[]` — seasonal add/subtract rules (percent or fixed)
- `drivers[]` — driver roster with vehicle assignments
- `coupons[]` — discount codes with usage tracking
- `adminAccount` — admin profile, notification prefs, password history

All of these are persisted inside the `site_content` JSONB column in Supabase and flow through the AdminPanel auto-save mechanism (800ms debounce).

### Admin Panel

`src/components/AdminPanel.tsx` is a large monolithic component. Each admin view is lazy-loaded under `src/components/admin/views/`.

**Auto-save flow:**
1. Any `setEditContent(...)` call in a view updates `editContent` state
2. `useEffect([editContent])` in AdminPanel fires (debounced 800ms)
3. `editContentRef.current` (not stale `editContent`) is read inside the timer
4. `onUpdateSiteContent(toSave)` is awaited — error shows toast, does not silently swallow
5. On success, localStorage is also updated as offline cache

**Error boundary:** `AdminViewErrorBoundary` wraps the `<Suspense>` block. A crash in any lazy view shows a "Tekrar Dene" button instead of taking down the whole panel. The error state resets automatically when the user navigates to a different view.

**Views that use editContent directly (Supabase-backed via auto-save):**
- `PricingView` — reads/writes `editContent.pricingRules`
- `DriversView` — reads/writes `editContent.drivers`
- `CouponsView` — reads/writes `editContent.coupons`
- `RegionsView` — reads/writes `editContent.regions`

### i18n

Turkish is the source language. All other languages are auto-translated via Google Translate API.

- `t('key')` resolves through `src/i18n/translations.ts` → Turkish text → translated text
- Add new UI strings to `src/i18n/translations.ts` only — no per-language files needed

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
vercel --prod
```

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

## Blog Post System

Blog posts are stored in the `blog_posts` Supabase table. The `BLOG_POSTS` constant in `src/constants.ts` is **not used at runtime** — it exists only as a reference/seed source.

- Admin panel has a "Tümünü Sil" button in BlogView (requires confirmation, deletes from Supabase + localStorage)
- `clearAllBlogPosts()` in the store handles bulk deletion
- Supabase RLS: delete requires authenticated session (anon key cannot delete)

### setBlogPosts Prop Type

`BlogViewProps.setBlogPosts` is `(posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => Promise<void>` — async, matches AdminPanel's implementation.
