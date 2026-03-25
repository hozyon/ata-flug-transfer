/**
 * Build-time sitemap generator.
 * Fetches blog posts from Supabase and combines with static pages/regions.
 * Run via: node scripts/generate-sitemap.mjs
 * Configured as prebuild in package.json.
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://www.ataflugtransfer.com';
const TODAY = new Date().toISOString().split('T')[0];

// All active transfer destination slugs (static — matches SCRAPED_REGIONS in constants.ts)
const REGION_SLUGS = [
  'antalya-havalimanı-transfer',
  'kundu-transfer',
  'kemer-transfer',
  'belek-transfer',
  'side-transfer',
  'alanya-transfer',
  'lara-transfer',
  'manavgat-transfer',
  'konyaalti-transfer',
  'marmaris-transfer',
  'fethiye-transfer',
  'bodrum-transfer',
  'mahmutlar-transfer',
  'tekirova-transfer',
  'oludeniz-transfer',
  'okurcalar-transfer',
  'avsallar-transfer',
  'incekum-transfer',
  'turkler-transfer',
  'konakli-transfer',
  'kas-transfer',
  'kalkan-transfer',
  'dalaman-transfer',
  'gocek-transfer',
  'olimpos-transfer',
  'beldibi-transfer',
  'goynuk-transfer',
  'kizilagac-transfer',
  'kargicak-transfer',
  'adrasan-transfer',
  'demre-transfer',
  'finike-transfer',
  'kumluca-transfer',
  'cirali-transfer',
  'bogazkent-transfer',
  'camyuva-transfer',
  'kiris-transfer',
  'kestel-transfer',
  'kizilot-transfer',
  'sorgun-transfer',
  'titreyengol-transfer',
  'colakli-transfer',
  'evrenseki-transfer',
  'kumkoy-transfer',
  'denizyaka-transfer',
  'gundogdu-transfer',
  'antalya-merkez-transfer',
];

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { path: '/',              priority: '1.0', changefreq: 'weekly' },
  { path: '/bolgeler',     priority: '0.9', changefreq: 'weekly' },
  { path: '/hakkimizda',   priority: '0.8', changefreq: 'monthly' },
  { path: '/sss',          priority: '0.8', changefreq: 'monthly' },
  { path: '/blog',         priority: '0.8', changefreq: 'weekly' },
  { path: '/iletisim',     priority: '0.7', changefreq: 'monthly' },
  { path: '/vizyon-misyon', priority: '0.6', changefreq: 'monthly' },
];

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchBlogPosts() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[sitemap] Supabase env vars not set — skipping blog posts.');
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('isPublished', true);

    if (error) {
      console.warn('[sitemap] Supabase query failed:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('[sitemap] Could not reach Supabase:', err.message);
    return [];
  }
}

async function main() {
  console.log('[sitemap] Generating sitemap.xml...');

  const blogPosts = await fetchBlogPosts();
  console.log(`[sitemap] Found ${blogPosts.length} published blog post(s).`);

  const entries = [];

  // Static pages
  for (const page of STATIC_PAGES) {
    entries.push(urlEntry(`${BASE_URL}${page.path}`, TODAY, page.changefreq, page.priority));
  }

  // Transfer destination pages
  for (const slug of REGION_SLUGS) {
    entries.push(urlEntry(`${BASE_URL}/${slug}`, TODAY, 'monthly', '0.8'));
  }

  // Blog post pages (dynamic from Supabase)
  for (const post of blogPosts) {
    const lastmod = post.updated_at
      ? new Date(post.updated_at).toISOString().split('T')[0]
      : TODAY;
    entries.push(urlEntry(`${BASE_URL}/blog/${post.slug}`, lastmod, 'monthly', '0.7'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${entries.join('\n\n')}

</urlset>
`;

  const outPath = resolve(__dirname, '../public/sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`[sitemap] Written to ${outPath} (${entries.length} URLs)`);
}

main().catch((err) => {
  console.error('[sitemap] Fatal error:', err);
  process.exit(1);
});
