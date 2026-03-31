const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// ── Core API caller ───────────────────────────────────────────────────────────
// v1 API does not support responseMimeType. Instead, prompts explicitly
// instruct Gemini to return only a raw JSON object. Parsing is done with
// a two-step strategy: direct JSON.parse first, then regex fallback.
async function callGemini<T>(apiKey: string, prompt: string): Promise<T> {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `Gemini API Hatası: ${res.status}`);
  }

  const data = await res.json() as {
    candidates?: { content: { parts: { text: string }[] } }[];
  };

  const text = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();

  // Strategy 1: direct parse (model returned clean JSON)
  try {
    return JSON.parse(text) as T;
  } catch {
    // Strategy 2: extract JSON object from surrounding text/markdown
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Yanıt JSON formatında değil. Tekrar deneyin.');
    return JSON.parse(match[0]) as T;
  }
}

// ── Return types ──────────────────────────────────────────────────────────────
export interface FullArticleResult {
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export interface ImproveResult {
  content: string;
}

export interface FaqResult {
  faq: string;
}

export interface MetaResult {
  seoTitle: string;
  seoDescription: string;
  tags: string[];
}

// ── Prompt builders ───────────────────────────────────────────────────────────
function buildFullArticlePrompt(
  topic: string,
  keyword: string,
  region: string,
  tone: string,
  articleType: string,
  businessName = 'Ata Flug Transfer'
): string {
  return `Sen SEO, AEO (Answer Engine Optimization) ve GEO (Generative Engine Optimization) konularında uzman, Türkçe içerik üreten bir blog yazarısın.

${businessName} — Antalya Havalimanı'ndan (AYT) lüks VIP transfer hizmeti veren bir firma için aşağıdaki yazıyı hazırla.

YAZI KONUSU: ${topic}
ANA ANAHTAR KELİME: ${keyword || topic}
HEDEF BÖLGE/LOKASYON: ${region || 'Antalya'}
YAZI TÜRÜ: ${articleType}
ÜSLUP: ${tone}

─── SEO KURALLARI ───
- Anahtar kelimeyi H1 başlıkta, ilk paragrafta ve 2–3 H2 başlıkta kullan
- SEO başlığı max 60 karakter olsun
- Meta description 120–155 karakter arası olsun
- Her H2 altında en az bir H3 olsun
- İçerik min 800 kelime olsun
- Sıralı ve sırasız listeler kullan
- Siteye iç link ekle: /bolgeler, /iletisim, /blog

─── AEO (Answer Engine Optimization) ───
- En az 5 sorulu-cevaplı SSS bölümü ekle (## Sıkça Sorulan Sorular)
- Her soru doğrudan ve net bir cevap ile başlasın (sesli arama uyumluluğu)
- Featured snippet için "Nedir, Nasıl, Ne kadar" tarzı sorular kullan

─── GEO (Generative Engine Optimization) ───
- Antalya Havalimanı (IATA: AYT), ${region || 'Antalya'}, Türkiye gibi coğrafi entiteleri kullan
- Özgün ve doğrulanabilir veriler ekle (km mesafesi, yaklaşık süre vb.)
- ${businessName} markasını doğal biçimde 3–5 kez geçir
- Yapılandırılmış ve alıntılanabilir bilgiler sun

YANIT KURALI: Sadece aşağıdaki JSON nesnesini döndür. Markdown kullanma, açıklama yazma, kod bloğu açma. İlk karakter { son karakter } olsun. content alanında satır sonu için \\n kullan, çift tırnak kullanma:
{"title":"...","seoTitle":"...","seoDescription":"...","excerpt":"...","tags":["tag1","tag2"],"content":"..."}`;
}

function buildImprovePrompt(content: string, title: string): string {
  return `Sen SEO, AEO ve GEO konusunda uzman bir Türkçe içerik editörüsün. "Ata Flug Transfer" şirketi için aşağıdaki blog yazısını profesyonel düzeyde geliştir.

MEVCUT BAŞLIK: ${title}

MEVCUT İÇERİK:
${content}

Yapılacaklar:
- Genel akıcılığı ve okunabilirliği artır
- Anahtar kelime yoğunluğunu iyileştir
- Eksik H2/H3 başlıklar ekle
- Eğer yoksa SSS bölümü ekle (AEO)
- Daha spesifik coğrafi bilgiler ekle (GEO)
- Antalya Havalimanı, Ata Flug Transfer gibi entiteleri doğal kullan
- İçeriği minimum 800 kelimeye tamamla

YANIT KURALI: Sadece aşağıdaki JSON nesnesini döndür. Markdown kullanma, açıklama yazma, kod bloğu açma. content alanında satır sonu için \\n kullan, çift tırnak kullanma:
{"content":"..."}`;
}

function buildFaqPrompt(title: string, region: string): string {
  return `Sen AEO (Answer Engine Optimization) uzmanısın. "Ata Flug Transfer" şirketi için "${title}" konusunda, ${region || 'Antalya'} bölgesine yönelik sesli arama ve AI motorlarına uyumlu bir SSS bölümü oluştur.

Kurallar:
- Tam olarak 7 soru-cevap çifti yaz
- Her soru gerçek kullanıcı dilinde, doğal ifadeyle
- Her cevap 2-4 cümle, direkt ve net
- Fiyat, süre, hizmet kalitesi, güvenlik, rezervasyon konularını kapsasın
- Ata Flug Transfer markasını doğal kullan

YANIT KURALI: Sadece aşağıdaki JSON nesnesini döndür. Markdown kullanma, açıklama yazma, kod bloğu açma. faq alanında satır sonu için \\n kullan:
{"faq":"## Sıkça Sorulan Sorular\\n\\n**Soru 1?**\\nCevap...\\n\\n**Soru 2?**\\nCevap..."}`;
}

function buildMetaPrompt(title: string, content: string, keyword: string): string {
  return `SEO uzmanı olarak, aşağıdaki Türkçe blog yazısı için optimal meta etiketler oluştur.

BAŞLIK: ${title}
ANA ANAHTAR KELİME: ${keyword || title}
İÇERİK ÖZETİ: ${content.substring(0, 500)}

Kurallar:
- SEO başlığı: kesinlikle max 60 karakter, anahtar kelime içermeli
- Meta description: 120-155 karakter arası, call-to-action içermeli
- 6-8 SEO etiketi öner

YANIT KURALI: Sadece aşağıdaki JSON nesnesini döndür. Markdown kullanma, açıklama yazma, kod bloğu açma:
{"seoTitle":"...","seoDescription":"...","tags":["tag1","tag2"]}`;
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function generateFullArticle(
  apiKey: string,
  params: { topic: string; keyword: string; region: string; tone: string; articleType: string }
): Promise<FullArticleResult> {
  return callGemini<FullArticleResult>(
    apiKey,
    buildFullArticlePrompt(params.topic, params.keyword, params.region, params.tone, params.articleType)
  );
}

export async function improveContent(
  apiKey: string,
  params: { content: string; title: string }
): Promise<ImproveResult> {
  return callGemini<ImproveResult>(apiKey, buildImprovePrompt(params.content, params.title));
}

export async function generateFAQ(
  apiKey: string,
  params: { title: string; region: string }
): Promise<FaqResult> {
  return callGemini<FaqResult>(apiKey, buildFaqPrompt(params.title, params.region));
}

export async function generateMeta(
  apiKey: string,
  params: { title: string; content: string; keyword: string }
): Promise<MetaResult> {
  return callGemini<MetaResult>(apiKey, buildMetaPrompt(params.title, params.content, params.keyword));
}
