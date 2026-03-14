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

Dev admin login: `admin@ataflugtransfer.com` / `admin123`

## Architecture

### Routing & Auth

- React Router v7 with path-based routes: `/login`, `/blog/:slug`, `/admin/*`, etc.
- `isAdmin` in Zustand controls rendering: `true` → `<AdminPanel>`, `false` → public `<Routes>`
- `App.tsx` sets `isAdmin` via Supabase `onAuthStateChange`; dev mode falls back to hardcoded credential check

### State Layer

Single Zustand store at `src/store/useAppStore.ts` owns all runtime state (bookings, siteContent, isAdmin).

- Initializes from Supabase when `isSupabaseConfigured === true`, otherwise from localStorage
- All mutations (addBooking, updateSiteContent, etc.) write to Supabase first, fall back to localStorage on error
- `src/lib/supabase.ts` — Supabase client + `isSupabaseConfigured` flag

**Supabase tables:** `bookings`, `site_content` (singleton `id=1`), `blog_posts`, `reviews`

**localStorage keys (fallback mode):**
- `ata_bookings_v6` — bookings
- `ata_site_content_v10` — site content
- `ata_blog_posts_v1` — blog posts
- `ata_user_reviews_v1` — pending reviews
- `ata_language` — language preference
- `ata_admin_theme` — light/dark

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

### Admin Panel

`src/components/AdminPanel.tsx` is a large monolithic component (~160KB). Each admin view (bookings, blog, settings, etc.) is a lazy-loaded component under `src/components/admin/views/`.

### SEO System

SEO is managed via `SeoSettings` in `src/types.ts` and stored as part of `SiteContent.seo`.

- Defaults defined in `INITIAL_SITE_CONTENT.seo` in `src/constants.ts`
- Admin UI: `src/components/admin/views/SEOView.tsx` — accessible via sidebar "SEO Yönetimi"
- Global meta tags + JSON-LD structured data rendered in `App.tsx` home route `<Helmet>`
- Per-page SEO fields: `pagesSeo.{home,about,regions,blog,faq,contact}`
- `public/robots.txt` — crawl directives; `public/sitemap.xml` — static sitemap
- `mergeContent()` in `src/store/useAppStore.ts` deep-merges `seo` and `seo.structuredData` / `seo.pagesSeo` from persisted data with defaults

## Deployment

```bash
vercel --prod
```

- `vercel.json` includes SPA rewrites — no extra config needed
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project environment variables
- Before first deploy, run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor
