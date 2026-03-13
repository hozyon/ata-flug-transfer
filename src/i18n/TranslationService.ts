/**
 * TranslationService — FAST automatic translation via free Google Translate API
 * 
 * Optimized for speed:
 * - Aggressive batching: combines ALL texts into single API calls
 * - Parallel requests for large batches
 * - Minimal debounce (50ms)
 * - localStorage cache (translate once → instant forever)
 */

const CACHE_PREFIX = 'ata_autotr_';
const BATCH_SEPARATOR = '\n\u2063\n'; // invisible separator that Google preserves
const MAX_CHARS_PER_REQUEST = 4500; // Google limit ~5000 chars
const DEBOUNCE_MS = 50;

class TranslationService {
    private memoryCache: Record<string, Record<string, string>> = {};
    private currentLang: string = 'en';

    constructor() {
        // Clean old static translation caches from previous system
        try {
            for (const key of Object.keys(localStorage)) {
                if (key.startsWith('ata_tr_') || key.startsWith('ata_translations')) {
                    localStorage.removeItem(key);
                }
            }
        } catch { /* ignore */ }
        this.loadAllCaches();
    }

    private loadAllCaches() {
        try {
            for (const lang of ['en', 'de', 'fr', 'ru', 'ar']) {
                const cached = localStorage.getItem(CACHE_PREFIX + lang);
                if (cached) this.memoryCache[lang] = JSON.parse(cached);
            }
        } catch { /* ignore */ }
    }

    private saveCache(lang: string) {
        try {
            if (this.memoryCache[lang]) {
                localStorage.setItem(CACHE_PREFIX + lang, JSON.stringify(this.memoryCache[lang]));
            }
        } catch { /* ignore */ }
    }

    setLanguage(lang: string) { this.currentLang = lang; }

    getCached(text: string, lang?: string): string | null {
        const l = lang || this.currentLang;
        return this.memoryCache[l]?.[text] || null;
    }

    setCache(text: string, translation: string, lang?: string) {
        const l = lang || this.currentLang;
        if (!this.memoryCache[l]) this.memoryCache[l] = {};
        this.memoryCache[l][text] = translation;
    }

    /** Save all pending cache changes to localStorage */
    flushCache(lang?: string) {
        this.saveCache(lang || this.currentLang);
    }

    /**
     * Translate multiple texts in optimized batches
     * Combines texts into single API calls for maximum speed
     */
    async translateBatch(texts: string[], targetLang?: string): Promise<string[]> {
        const lang = targetLang || this.currentLang;
        if (lang === 'tr') return texts;

        const results: string[] = new Array(texts.length);
        const uncachedIndices: number[] = [];
        const uncachedTexts: string[] = [];

        // Step 1: Fill from cache, collect uncached
        for (let i = 0; i < texts.length; i++) {
            const cached = this.getCached(texts[i], lang);
            if (cached) {
                results[i] = cached;
            } else if (texts[i] && texts[i].trim()) {
                uncachedIndices.push(i);
                uncachedTexts.push(texts[i]);
            } else {
                results[i] = texts[i]; // empty/whitespace
            }
        }

        if (uncachedTexts.length === 0) return results;

        // Step 2: Group uncached texts into batches by character limit
        const batches: { texts: string[]; indices: number[] }[] = [];
        let currentBatch: string[] = [];
        let currentIndices: number[] = [];
        let currentLength = 0;

        for (let i = 0; i < uncachedTexts.length; i++) {
            const textLen = uncachedTexts[i].length + BATCH_SEPARATOR.length;
            if (currentLength + textLen > MAX_CHARS_PER_REQUEST && currentBatch.length > 0) {
                batches.push({ texts: [...currentBatch], indices: [...currentIndices] });
                currentBatch = [];
                currentIndices = [];
                currentLength = 0;
            }
            currentBatch.push(uncachedTexts[i]);
            currentIndices.push(uncachedIndices[i]);
            currentLength += textLen;
        }
        if (currentBatch.length > 0) {
            batches.push({ texts: currentBatch, indices: currentIndices });
        }

        // Step 3: Send ALL batches in PARALLEL
        const batchPromises = batches.map(batch => this.translateCombined(batch.texts, lang));

        try {
            const batchResults = await Promise.all(batchPromises);

            for (let b = 0; b < batches.length; b++) {
                const translated = batchResults[b];
                for (let i = 0; i < batches[b].indices.length; i++) {
                    const originalIdx = batches[b].indices[i];
                    const translatedText = translated[i] || texts[originalIdx];
                    results[originalIdx] = translatedText;
                    this.setCache(texts[originalIdx], translatedText, lang);
                }
            }
            this.flushCache(lang);
        } catch (error) {
            // On error, fill remaining with originals
            for (const idx of uncachedIndices) {
                if (!results[idx]) results[idx] = texts[idx];
            }
        }

        return results;
    }

    /**
     * Combine multiple texts into a SINGLE API call using separator
     */
    private async translateCombined(texts: string[], targetLang: string): Promise<string[]> {
        if (texts.length === 0) return [];
        if (texts.length === 1) {
            const result = await this.callGoogleTranslate(texts[0], targetLang);
            return [result];
        }

        // Combine with separator
        const combined = texts.join(BATCH_SEPARATOR);

        try {
            const translated = await this.callGoogleTranslate(combined, targetLang);

            // Split by separator (Google usually preserves it or translates it predictably)
            const parts = translated.split(/\n?\u2063\n?/);

            if (parts.length === texts.length) {
                return parts.map(p => p.trim());
            }

            // If separator didn't work, try fallback split strategies
            // Strategy 2: Split by newlines and match count
            const nlParts = translated.split('\n').filter(p => p.trim());
            if (nlParts.length === texts.length) {
                return nlParts.map(p => p.trim());
            }

            // Strategy 3: Translate individually (slower but reliable)
            return Promise.all(texts.map(t => this.callGoogleTranslate(t, targetLang)));
        } catch {
            // Fallback: try individually
            try {
                return await Promise.all(texts.map(t => this.callGoogleTranslate(t, targetLang)));
            } catch {
                return texts; // give up, return originals
            }
        }
    }

    /** Single Google Translate API call */
    private async callGoogleTranslate(text: string, targetLang: string): Promise<string> {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data) && Array.isArray(data[0])) {
            return data[0]
                .filter((seg: any) => Array.isArray(seg) && seg[0])
                .map((seg: any) => seg[0])
                .join('');
        }

        throw new Error('Unexpected response format');
    }

    /** Translate single text (convenience method) */
    async translate(text: string, targetLang?: string): Promise<string> {
        const results = await this.translateBatch([text], targetLang);
        return results[0];
    }

    clearCache() {
        this.memoryCache = {};
        for (const lang of ['en', 'de', 'fr', 'ru', 'ar']) {
            localStorage.removeItem(CACHE_PREFIX + lang);
        }
    }
}

export const translationService = new TranslationService();
export const TRANSLATION_DEBOUNCE_MS = DEBOUNCE_MS;
export default translationService;
