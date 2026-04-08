import { describe, it, expect } from 'vitest';
import { mergeContent } from '../mergeContent';
import { INITIAL_SITE_CONTENT } from '../../constants';
import type { SiteContent } from '../../types';

// Minimal SiteContent that satisfies the type — only override what matters for each test
function base(overrides: Partial<SiteContent> = {}): SiteContent {
    return { ...INITIAL_SITE_CONTENT, ...overrides };
}

describe('mergeContent — regions', () => {
    it('returns all INITIAL regions when parsed.regions is undefined (first-time init)', () => {
        const input = base({ regions: undefined });
        const result = mergeContent(input);
        expect(result.regions).toEqual(INITIAL_SITE_CONTENT.regions);
    });

    it('does NOT re-add regions the user removed', () => {
        const [first] = INITIAL_SITE_CONTENT.regions;
        const input = base({ regions: [first] });
        const result = mergeContent(input);
        expect(result.regions).toHaveLength(1);
        expect(result.regions[0].id).toBe(first.id);
    });

    it('preserves a custom price set by the user', () => {
        const region = { ...INITIAL_SITE_CONTENT.regions[0], price: 999 };
        const input = base({ regions: [region] });
        const result = mergeContent(input);
        expect(result.regions[0].price).toBe(999);
    });

    it('fills in missing fields from INITIAL defaults for existing regions', () => {
        const regionWithoutIcon = { ...INITIAL_SITE_CONTENT.regions[0] };
        delete (regionWithoutIcon as any).icon;
        const input = base({ regions: [regionWithoutIcon] });
        const result = mergeContent(input);
        // INITIAL default has icon: 'fa-location-dot'
        expect(result.regions[0].icon).toBe('fa-location-dot');
    });

    it('keeps custom regions not present in INITIAL defaults', () => {
        const customRegion = {
            id: 'custom-xyz',
            name: 'Custom Region',
            desc: 'desc',
            image: '',
            icon: 'fa-star',
            price: 75,
        };
        const input = base({ regions: [customRegion] });
        const result = mergeContent(input);
        expect(result.regions).toHaveLength(1);
        expect(result.regions[0].id).toBe('custom-xyz');
    });
});

describe('mergeContent — drivers / coupons', () => {
    it('returns [] for drivers when parsed value is undefined', () => {
        const input = base({ drivers: undefined });
        const result = mergeContent(input);
        expect(result.drivers).toEqual([]);
    });

    it('returns [] for coupons when parsed value is undefined', () => {
        const input = base({ coupons: undefined });
        const result = mergeContent(input);
        expect(result.coupons).toEqual([]);
    });
});

describe('mergeContent — hero', () => {
    it('merges hero fields with INITIAL defaults', () => {
        const input = base({ hero: { ...INITIAL_SITE_CONTENT.hero, title: 'Custom Title' } });
        const result = mergeContent(input);
        expect(result.hero.title).toBe('Custom Title');
        expect(result.hero.desc).toBe(INITIAL_SITE_CONTENT.hero.desc);
    });

    it('restores hero.backgrounds from INITIAL when saved value is empty array', () => {
        const input = base({ hero: { ...INITIAL_SITE_CONTENT.hero, backgrounds: [] } });
        const result = mergeContent(input);
        expect(result.hero.backgrounds).toEqual(INITIAL_SITE_CONTENT.hero.backgrounds);
        expect(result.hero.backgrounds.length).toBeGreaterThan(0);
    });
});

describe('mergeContent — navbar /bolgeler rule', () => {
    it('strips subMenus from /bolgeler nav item', () => {
        const navbarWithSubMenus = INITIAL_SITE_CONTENT.navbar.map(item =>
            item.url === '/bolgeler'
                ? { ...item, subMenus: [{ label: 'Sub', url: '/sub' }] }
                : item
        );
        const input = base({ navbar: navbarWithSubMenus });
        const result = mergeContent(input);
        const bolgelerItem = result.navbar?.find(i => i.url === '/bolgeler');
        expect(bolgelerItem?.subMenus).toEqual([]);
    });
});

describe('mergeContent — seo', () => {
    it('merges top-level seo fields', () => {
        const input = base({
            seo: { ...INITIAL_SITE_CONTENT.seo, siteTitle: 'Custom SEO Title' },
        });
        const result = mergeContent(input);
        expect(result.seo.siteTitle).toBe('Custom SEO Title');
        expect(result.seo.canonicalUrl).toBe(INITIAL_SITE_CONTENT.seo.canonicalUrl);
    });
});
