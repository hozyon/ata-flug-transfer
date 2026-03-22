import { SiteContent } from '../types';
import { INITIAL_SITE_CONTENT } from '../constants';

/**
 * Merges persisted SiteContent with INITIAL_SITE_CONTENT defaults.
 *
 * Contract (do not break):
 * - parsed.regions is the source of truth for WHICH regions are active.
 *   INITIAL defaults only fill in missing *fields* on existing regions.
 *   A region absent from parsed.regions must never be re-added.
 * - Exception: if parsed.regions === undefined (first-time init), use all INITIAL defaults.
 * - Same rule for pricingRules, drivers, coupons — use parsed arrays as-is.
 */
export function mergeContent(parsed: SiteContent): SiteContent {
    const defaultRegionMap = new Map(INITIAL_SITE_CONTENT.regions.map(r => [r.id, r]));
    const mergedRegions = parsed.regions === undefined
        ? INITIAL_SITE_CONTENT.regions
        : parsed.regions.map(savedRegion => {
            const def = defaultRegionMap.get(savedRegion.id);
            return def ? { ...def, ...savedRegion } : savedRegion;
        });

    const merged: SiteContent = {
        ...INITIAL_SITE_CONTENT,
        ...parsed,
        regions: mergedRegions,
        hero: { ...INITIAL_SITE_CONTENT.hero, ...(parsed.hero || {}) },
        about: { ...INITIAL_SITE_CONTENT.about, ...(parsed.about || {}) },
        business: { ...INITIAL_SITE_CONTENT.business, ...(parsed.business || {}) },
        visionMission: { ...INITIAL_SITE_CONTENT.visionMission, ...(parsed.visionMission || {}) },
        seo: {
            ...INITIAL_SITE_CONTENT.seo,
            ...(parsed.seo || {}),
            structuredData: { ...INITIAL_SITE_CONTENT.seo.structuredData, ...(parsed.seo?.structuredData || {}) },
            pagesSeo: { ...INITIAL_SITE_CONTENT.seo.pagesSeo, ...(parsed.seo?.pagesSeo || {}) },
        },
        branding: { ...INITIAL_SITE_CONTENT.branding, ...(parsed.branding || {}) },
        currency: { ...INITIAL_SITE_CONTENT.currency, ...(parsed.currency || {}) },
        adminAccount: parsed.adminAccount
            ? { ...INITIAL_SITE_CONTENT.adminAccount, ...parsed.adminAccount }
            : INITIAL_SITE_CONTENT.adminAccount,
        pricingRules: Array.isArray(parsed.pricingRules) ? parsed.pricingRules : [],
        drivers: Array.isArray(parsed.drivers) ? parsed.drivers : [],
        coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [],
    };

    if (!Array.isArray(merged.hero.backgrounds) || merged.hero.backgrounds.length === 0) {
        merged.hero.backgrounds = INITIAL_SITE_CONTENT.hero.backgrounds;
    }

    // Strip subMenus from /bolgeler nav item (enforced rule)
    if (Array.isArray(merged.navbar)) {
        merged.navbar = merged.navbar.map(item =>
            item.url === '/bolgeler' ? { ...item, subMenus: [] } : item
        );
    }

    return merged;
}
