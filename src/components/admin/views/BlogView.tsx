import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import DOMPurify from 'dompurify';
import { EmptyState } from '../EmptyState';
import type { BlogPost } from '../../../types';

const BLOG_DRAFT_KEY = 'ata_blog_draft_v1';
const BLOG_PER_PAGE = 10;

interface BlogViewProps {
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => Promise<void>;
  blogTab: 'published' | 'draft';
  setBlogTab: Dispatch<SetStateAction<'published' | 'draft'>>;
  blogCategories: string[];
  setBlogCategories: Dispatch<SetStateAction<string[]>>;
  blogSearchTerm: string;
  setBlogSearchTerm: Dispatch<SetStateAction<string>>;
  selectedBlogs: string[];
  setSelectedBlogs: Dispatch<SetStateAction<string[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'delete') => void;
  clearAllBlogPosts: () => Promise<void>;
  confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

// ── Markdown → HTML renderer ────────────────────────────────────────────────
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1 text-white">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2 text-white">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black mt-6 mb-2 text-white">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-amber-500 pl-4 text-slate-400 italic my-3">$1</blockquote>')
    .replace(/```([\s\S]*?)```/gm, '<pre class="bg-black/40 rounded-lg p-3 text-xs text-emerald-400 my-3 overflow-x-auto">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-black/30 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/~~(.+?)~~/g, '<del class="text-slate-500 line-through">$1</del>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-amber-400 underline hover:text-amber-300" target="_blank">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-slate-300 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-slate-300 list-decimal">$1</li>')
    .replace(/(<li[\s\S]+?<\/li>)/g, '<ul class="my-2 space-y-1">$1</ul>')
    .replace(/^(?!<[h1-6|ul|ol|li|blockquote|pre|div])(.+)$/gm, '<p class="text-slate-300 leading-relaxed my-2">$1</p>')
    .replace(/\n\n/g, '')
    .trim();
}

// ── Cursor insertion helpers ─────────────────────────────────────────────────
function insertAtCursor(ta: HTMLTextAreaElement, prefix: string, suffix = '', placeholder = '', setter: (v: string) => void) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.substring(start, end);
  const insert = `${prefix}${selected || placeholder}${suffix}`;
  const next = ta.value.substring(0, start) + insert + ta.value.substring(end);
  setter(next);
  setTimeout(() => {
    ta.focus();
    const cursor = start + prefix.length + (selected || placeholder).length + suffix.length;
    ta.setSelectionRange(cursor, cursor);
  }, 0);
}

function insertLine(ta: HTMLTextAreaElement, line: string, setter: (v: string) => void) {
  const start = ta.selectionStart;
  const before = ta.value.substring(0, start);
  const lineStart = before.lastIndexOf('\n') + 1;
  const next = ta.value.substring(0, lineStart) + line + '\n' + ta.value.substring(lineStart);
  setter(next);
  setTimeout(() => { ta.focus(); ta.setSelectionRange(lineStart + line.length + 1, lineStart + line.length + 1); }, 0);
}

// ── SEO Score Calculator ──────────────────────────────────────────────────────
function calcSeoScore(post: BlogPost): { score: number; checks: { label: string; pass: boolean; tip: string }[] } {
  const content = post.content || '';
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const seoTitle = post.seoTitle || post.title || '';
  const seoDesc = post.seoDescription || post.excerpt || '';
  const kw = ((post.tags || [])[0] || '').toLowerCase();

  const checks = [
    { label: 'Başlık 50–60 karakter', pass: seoTitle.length >= 30 && seoTitle.length <= 70, tip: `Mevcut: ${seoTitle.length} karakter` },
    { label: 'Meta açıklama 120–160 karakter', pass: seoDesc.length >= 80 && seoDesc.length <= 165, tip: `Mevcut: ${seoDesc.length} karakter` },
    { label: 'İçerik 600+ kelime', pass: wordCount >= 600, tip: `Mevcut: ${wordCount} kelime` },
    { label: 'H2 başlık var', pass: /^## .+$/m.test(content), tip: '## ile H2 başlık ekleyin' },
    { label: 'H3 başlık var', pass: /^### .+$/m.test(content), tip: '### ile H3 başlık ekleyin' },
    { label: 'Kapak görseli var', pass: !!(post.featuredImage), tip: 'Ayarlar > Kapak Görseli' },
    { label: 'Etiket (keyword) var', pass: (post.tags || []).length > 0, tip: 'SEO sekmesinde etiket ekleyin' },
    { label: 'İçerikte anahtar kelime', pass: kw.length > 0 && content.toLowerCase().includes(kw), tip: kw ? `"${kw}" içerikte geçmeli` : 'Etiket ekleyin' },
    { label: 'FAQ / S.S.S bölümü', pass: /sık.*soru|s\.s\.s|faq|sıkça/i.test(content), tip: 'AEO için SSS bölümü ekleyin' },
    { label: 'İç link var', pass: /\[.+\]\(\//.test(content), tip: 'Siteye iç link ekleyin (/blog, /bolgeler vb.)' },
  ];

  const score = Math.round((checks.filter(c => c.pass).length / checks.length) * 100);
  return { score, checks };
}

// ── AI Writing Assistant ───────────────────────────────────────────────────────
const AI_LS_KEY = 'ata_ai_api_key';

const TONES = ['Profesyonel', 'Samimi', 'Bilgilendirici', 'Heyecanlı', 'Güven verici'];
const AI_MODES = [
  { id: 'full', label: 'Tam Makale', icon: 'fa-wand-magic-sparkles', desc: 'Sıfırdan 800+ kelime üret' },
  { id: 'improve', label: 'İçeriği İyileştir', icon: 'fa-arrow-up-right-dots', desc: 'Mevcut içeriği geliştir' },
  { id: 'faq', label: 'Sadece SSS', icon: 'fa-circle-question', desc: 'AEO için SSS bölümü ekle' },
  { id: 'meta', label: 'Meta Etiketler', icon: 'fa-tags', desc: 'SEO başlık + açıklama üret' },
];
const ARTICLE_TYPES = [
  { id: 'destination', label: 'Destinasyon Rehberi', icon: 'fa-map-location-dot' },
  { id: 'transfer', label: 'Transfer Rehberi', icon: 'fa-car-side' },
  { id: 'tips', label: 'Seyahat İpuçları', icon: 'fa-lightbulb' },
  { id: 'comparison', label: 'Karşılaştırma', icon: 'fa-scale-balanced' },
  { id: 'faq', label: 'S.S.S Makalesi', icon: 'fa-circle-question' },
];

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

Çıktıyı **yalnızca** JSON formatında döndür:
{"content": "geliştirilmiş markdown içerik"}`;
}

function buildFaqPrompt(title: string, region: string): string {
  return `Sen AEO (Answer Engine Optimization) uzmanısın. "Ata Flug Transfer" şirketi için "${title}" konusunda, ${region || 'Antalya'} bölgesine yönelik sesli arama ve AI motorlarına uyumlu bir SSS bölümü oluştur.

Kurallar:
- Tam olarak 7 soru-cevap çifti yaz
- Her soru gerçek kullanıcı dilinde, doğal ifadeyle
- Her cevap 2-4 cümle, direkt ve net
- Fiyat, süre, hizmet kalitesi, güvenlik, rezervasyon konularını kapsasın
- Ata Flug Transfer markasını doğal kullan

Çıktı formatı (sadece JSON):
{"faq": "## Sıkça Sorulan Sorular\\n\\n**Soru 1?**\\nCevap...\\n\\n**Soru 2?**\\nCevap..."}`;
}

function buildMetaPrompt(title: string, content: string, keyword: string): string {
  return `SEO uzmanı olarak, aşağıdaki Türkçe blog yazısı için optimal meta etiketler oluştur.

BAŞLIK: ${title}
ANA ANAHTAR KELİME: ${keyword || title}
İÇERİK ÖZETİ: ${content.substring(0, 500)}...

Kurallar:
- SEO başlığı: kesinlikle max 60 karakter, anahtar kelime içermeli
- Meta description: 120-155 karakter arası, call-to-action içermeli
- 6-8 SEO etiketi öner

Çıktı (sadece JSON):
{"seoTitle": "...", "seoDescription": "...", "tags": ["tag1", "tag2"]}`;
}

async function callClaudeAPI(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || `API Hatası: ${res.status}`);
  }
  const data = await res.json() as { content: { type: string; text: string }[] };
  return data.content?.[0]?.text || '';
}

function buildPrompt(topic: string, keyword: string, region: string, tone: string, articleType: string, businessName = 'Ata Flug Transfer'): string {
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

Çıktıyı **yalnızca** aşağıdaki JSON formatında döndür, başka hiçbir şey ekleme:
{
  "title": "Tam makale başlığı (H1 için)",
  "seoTitle": "SEO başlığı (max 60 karakter)",
  "seoDescription": "Meta açıklama (120-155 karakter)",
  "excerpt": "Blog listesinde görünecek özet (2-3 cümle)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "content": "Tam markdown içerik (800+ kelime)"
}`;
}

export const BlogView: React.FC<BlogViewProps> = ({
  blogPosts, setBlogPosts, blogTab, setBlogTab, blogCategories, setBlogCategories,
  blogSearchTerm, setBlogSearchTerm, selectedBlogs, setSelectedBlogs,
  showToast, clearAllBlogPosts, confirmAction
}) => {

  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [newBlogPost, setNewBlogPost] = useState<BlogPost>({
    id: '', title: '', slug: '', excerpt: '', content: '',
    category: 'Destinasyon', featuredImage: '',
    isPublished: false, tags: [], author: 'Ata Flug Transfer',
    seoTitle: '', seoDescription: '', viewCount: 0,
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'ai' | 'settings'>('content');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save state
  const [autoSavedAt, setAutoSavedAt] = useState<string | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{ postId: string | 'new'; data: BlogPost; savedAt: string } | null>(null);

  // Pagination
  const [blogPage, setBlogPage] = useState(1);

  // AI state
  const [aiApiKey, setAiApiKey] = useState(() => localStorage.getItem(AI_LS_KEY) || '');
  const [aiMode, setAiMode] = useState<'full' | 'improve' | 'faq' | 'meta'>('full');
  const [aiTopic, setAiTopic] = useState('');
  const [aiKeyword, setAiKeyword] = useState('');
  const [aiRegion, setAiRegion] = useState('Antalya');
  const [aiTone, setAiTone] = useState('Profesyonel');
  const [aiArticleType, setAiArticleType] = useState('destination');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiGenerated, setAiGenerated] = useState(false);

  // Sync API key from localStorage (in case it was updated in AccountView)
  useEffect(() => {
    const stored = localStorage.getItem(AI_LS_KEY) || '';
    setAiApiKey(stored);
  }, [activeTab]);

  // Auto-publish scheduled posts on mount
  useEffect(() => {
    const now = new Date();
    const toPublish = blogPosts.filter(p => !p.isPublished && p.scheduledAt && new Date(p.scheduledAt) <= now);
    if (toPublish.length > 0) {
      const ids = new Set(toPublish.map(p => p.id));
      setBlogPosts(prev => prev.map(p => ids.has(p.id) ? { ...p, isPublished: true, publishedAt: new Date().toISOString() } : p));
      showToast(`${toPublish.length} yazı otomatik yayınlandı`, 'success');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft every 30 seconds when drawer is open
  useEffect(() => {
    if (!isDrawerOpen) return;
    const interval = setInterval(() => {
      const draft = {
        postId: (editingBlogPost?.id || 'new') as string | 'new',
        data: newBlogPost,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(BLOG_DRAFT_KEY, JSON.stringify(draft));
      const hhmm = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      setAutoSavedAt(hhmm);
    }, 30000);
    return () => clearInterval(interval);
  }, [isDrawerOpen, newBlogPost, editingBlogPost]);

  const wordCount = newBlogPost.content.trim() ? newBlogPost.content.trim().split(/\s+/).length : 0;
  const charCount = newBlogPost.content.length;
  const { score: seoScore, checks: seoChecks } = calcSeoScore(newBlogPost);

  const filteredPosts = blogPosts
    .filter(p => blogTab === 'published' ? p.isPublished : !p.isPublished)
    .filter(p => !blogSearchTerm ||
      p.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(blogSearchTerm.toLowerCase())
    );

  const totalBlogPages = Math.ceil(filteredPosts.length / BLOG_PER_PAGE);
  const currentPosts = filteredPosts.slice((blogPage - 1) * BLOG_PER_PAGE, blogPage * BLOG_PER_PAGE);

  const filteredIds = currentPosts.map(p => p.id);
  const allSelected = currentPosts.length > 0 && currentPosts.every(p => selectedBlogs.includes(p.id));

  // Reset page when search term or tab changes
  useEffect(() => { setBlogPage(1); }, [blogSearchTerm, blogTab]);

  const openNew = () => {
    const defaultPost: BlogPost = {
      id: '', title: '', slug: '', excerpt: '', content: '',
      category: blogCategories[0] || 'Destinasyon',
      featuredImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
      isPublished: false, tags: [], author: 'Ata Flug Transfer',
      seoTitle: '', seoDescription: '', viewCount: 0,
    };
    setNewBlogPost(defaultPost);
    setEditingBlogPost(null);
    setSlugManuallyEdited(false);
    setActiveTab('content');
    setShowPreview(false);
    setSplitView(false);
    setAiGenerated(false);
    setAiError('');
    setAutoSavedAt(null);
    setShowDraftBanner(false);
    setPendingDraft(null);
    // Check for a "new" draft
    try {
      const stored = localStorage.getItem(BLOG_DRAFT_KEY);
      if (stored) {
        const draft = JSON.parse(stored) as { postId: string | 'new'; data: BlogPost; savedAt: string };
        if (draft.postId === 'new') {
          setPendingDraft(draft);
          setShowDraftBanner(true);
        }
      }
    } catch (e) { console.warn('Failed to load draft:', e); }
    setIsDrawerOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setNewBlogPost({ ...post });
    setEditingBlogPost(post);
    setSlugManuallyEdited(true);
    setActiveTab('content');
    setShowPreview(false);
    setSplitView(false);
    setAiGenerated(false);
    setAiError('');
    setAutoSavedAt(null);
    setShowDraftBanner(false);
    setPendingDraft(null);
    // Check for a draft for this post
    try {
      const stored = localStorage.getItem(BLOG_DRAFT_KEY);
      if (stored) {
        const draft = JSON.parse(stored) as { postId: string | 'new'; data: BlogPost; savedAt: string };
        if (draft.postId === post.id && new Date(draft.savedAt) > new Date(post.updatedAt || post.publishedAt || 0)) {
          setPendingDraft(draft);
          setShowDraftBanner(true);
        }
      }
    } catch (e) { console.warn('Failed to load draft:', e); }
    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!newBlogPost.title.trim()) { showToast('Başlık zorunludur', 'error'); return; }
    if (!newBlogPost.slug.trim()) { showToast('URL (slug) zorunludur', 'error'); return; }
    // Slug benzersizlik kontrolü
    const isSlugTaken = blogPosts.some(
      p => p.slug === newBlogPost.slug.trim() && p.id !== (editingBlogPost?.id || '')
    );
    if (isSlugTaken) { showToast('Bu URL (slug) zaten kullanımda', 'error'); return; }

    const now = new Date().toISOString();
    try {
      if (editingBlogPost) {
        const updated: BlogPost = { ...newBlogPost, updatedAt: now };
        await setBlogPosts(blogPosts.map(p => p.id === editingBlogPost.id ? updated : p));
        showToast('Blog yazısı güncellendi', 'success');
      } else {
        const created: BlogPost = {
          ...newBlogPost,
          id: crypto.randomUUID(),
          publishedAt: now,
          updatedAt: now,
          tags: newBlogPost.tags || [],
          author: newBlogPost.author || 'Ata Flug Transfer',
          seoTitle: newBlogPost.seoTitle || newBlogPost.title,
          seoDescription: newBlogPost.seoDescription || newBlogPost.excerpt,
          viewCount: 0,
        };
        await setBlogPosts([...blogPosts, created]);
        showToast('Blog yazısı oluşturuldu', 'success');
      }
    } catch {
      showToast('Veritabanına kaydedilemedi, yerel depolamaya yazıldı', 'error');
    }
    // Clear draft on manual save
    localStorage.removeItem(BLOG_DRAFT_KEY);
    setAutoSavedAt(null);
    setShowDraftBanner(false);
    setPendingDraft(null);
    setIsDrawerOpen(false);
  };

  const setContent = (v: string) => setNewBlogPost(p => ({ ...p, content: v }));

  // AI Generate
  const handleGenerate = async () => {
    const key = localStorage.getItem(AI_LS_KEY) || '';
    if (!key.trim()) {
      setAiError('API anahtarı bulunamadı. Lütfen Hesap Ayarları > AI Entegrasyonu bölümünden anahtarınızı ekleyin.');
      return;
    }
    if (aiMode === 'full' && !aiTopic.trim()) { setAiError('Konu alanı boş olamaz.'); return; }
    if (aiMode === 'improve' && !newBlogPost.content.trim()) { setAiError('İyileştirmek için önce İçerik sekmesine yazı girin.'); return; }
    if (aiMode === 'faq' && !newBlogPost.title.trim()) { setAiError('SSS oluşturmak için önce Ayarlar > Başlık alanını doldurun.'); return; }
    if (aiMode === 'meta' && !newBlogPost.title.trim()) { setAiError('Meta etiket oluşturmak için önce Ayarlar > Başlık alanını doldurun.'); return; }

    setAiError('');
    setIsGenerating(true);

    try {
      let prompt = '';
      if (aiMode === 'full') {
        const typeLabel = ARTICLE_TYPES.find(t => t.id === aiArticleType)?.label || aiArticleType;
        prompt = buildPrompt(aiTopic, aiKeyword, aiRegion, aiTone, typeLabel);
      } else if (aiMode === 'improve') {
        prompt = buildImprovePrompt(newBlogPost.content, newBlogPost.title);
      } else if (aiMode === 'faq') {
        prompt = buildFaqPrompt(newBlogPost.title, aiRegion);
      } else if (aiMode === 'meta') {
        prompt = buildMetaPrompt(newBlogPost.title, newBlogPost.content, aiKeyword);
      }

      const raw = await callClaudeAPI(key, prompt);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Yanıt JSON formatında değil. Tekrar deneyin.');
      const parsed = JSON.parse(jsonMatch[0]) as {
        title?: string; seoTitle?: string; seoDescription?: string;
        excerpt?: string; tags?: string[]; content?: string; faq?: string;
      };

      if (aiMode === 'full') {
        const autoSlug = (parsed.title || aiTopic).toLowerCase()
          .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
          .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
        setNewBlogPost(p => ({
          ...p,
          title: parsed.title || p.title,
          slug: slugManuallyEdited ? p.slug : autoSlug,
          excerpt: parsed.excerpt || p.excerpt,
          content: parsed.content || p.content,
          seoTitle: parsed.seoTitle || p.seoTitle,
          seoDescription: parsed.seoDescription || p.seoDescription,
          tags: parsed.tags || p.tags,
        }));
        showToast('Tam makale oluşturuldu!', 'success');
      } else if (aiMode === 'improve') {
        setNewBlogPost(p => ({ ...p, content: parsed.content || p.content }));
        showToast('İçerik iyileştirildi!', 'success');
      } else if (aiMode === 'faq') {
        setNewBlogPost(p => ({ ...p, content: p.content + '\n\n' + (parsed.faq || '') }));
        showToast('SSS bölümü eklendi!', 'success');
      } else if (aiMode === 'meta') {
        setNewBlogPost(p => ({
          ...p,
          seoTitle: parsed.seoTitle || p.seoTitle,
          seoDescription: parsed.seoDescription || p.seoDescription,
          tags: parsed.tags || p.tags,
        }));
        showToast('Meta etiketler güncellendi! SEO sekmesini kontrol edin.', 'success');
      }

      setAiGenerated(true);
      setActiveTab(aiMode === 'meta' ? 'seo' : 'content');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setIsGenerating(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isDrawerOpen || !textareaRef.current) return;
      if (e.ctrlKey || e.metaKey) {
        const ta = textareaRef.current;
        if (e.key === 'b') { e.preventDefault(); insertAtCursor(ta, '**', '**', 'kalın metin', setContent); }
        if (e.key === 'i') { e.preventDefault(); insertAtCursor(ta, '*', '*', 'italik', setContent); }
        if (e.key === 'k') { e.preventDefault(); insertAtCursor(ta, '[', '](https://)', 'link metni', setContent); }
        if (e.key === 's') { e.preventDefault(); handleSave(); }
      }
      if (e.key === 'Tab' && document.activeElement === textareaRef.current) {
        e.preventDefault();
        const ta = textareaRef.current;
        const start = ta.selectionStart;
        const next = ta.value.substring(0, start) + '  ' + ta.value.substring(ta.selectionEnd);
        setContent(next);
        setTimeout(() => ta.setSelectionRange(start + 2, start + 2), 0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen, newBlogPost]); // handleSave excluded — unstable prop; adding it causes infinite re-registration

  const tb = (label: string, icon: string, title: string, onClick: () => void) => (
    <button type="button" onClick={onClick} title={title}
      className="flex items-center gap-1 px-2 h-7 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-[11px] font-medium whitespace-nowrap">
      {icon.startsWith('fa-') ? <i className={`fa-solid ${icon} text-[9px]`}></i> : <span className="font-bold text-[10px]">{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );

  const scoreColor = seoScore >= 80 ? 'text-emerald-400' : seoScore >= 50 ? 'text-amber-400' : 'text-red-400';
  const scoreBg = seoScore >= 80 ? 'bg-emerald-500' : seoScore >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Yayında', value: blogPosts.filter(p => p.isPublished).length, icon: 'fa-globe', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
          { label: 'Taslak', value: blogPosts.filter(p => !p.isPublished).length, icon: 'fa-file-pen', iconBg: 'bg-slate-500', gradient: 'from-slate-500/15 to-slate-600/5', border: 'border-slate-500/15' },
          { label: 'Toplam Yazı', value: blogPosts.length, icon: 'fa-newspaper', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
          { label: 'Kategoriler', value: [...new Set(blogPosts.map(p => p.category))].length, icon: 'fa-folder', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.border}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-black font-outfit text-white mt-1">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg`}>
                <i className={`fa-solid ${s.icon} text-white text-sm`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Asistan Card */}
      <div className={`relative rounded-2xl border overflow-hidden ${aiApiKey ? 'bg-gradient-to-br from-violet-500/[0.07] to-purple-600/[0.03] border-violet-500/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4">
          {/* Icon */}
          <div className={`relative shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${aiApiKey ? 'bg-violet-500 shadow-lg shadow-violet-500/40' : 'bg-white/[0.05] border border-white/[0.08]'}`}>
            <i className={`fa-solid fa-robot text-lg ${aiApiKey ? 'text-white' : 'text-slate-600'}`}></i>
            {!aiApiKey && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-500"></span>
              </span>
            )}
            {aiApiKey && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0d1117] shadow shadow-emerald-500/50"></span>}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[14px] font-bold text-white">AI Yazı Asistanı</h3>
              {aiApiKey ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>AKTİF
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-[9px] font-bold text-slate-500">
                  <span className="w-1 h-1 rounded-full bg-slate-500"></span>YAPILANDIRILMADI
                </span>
              )}
            </div>
            {aiApiKey ? (
              <p className="text-[11px] text-slate-400 mt-0.5">Claude API bağlı · Tam makale, SEO meta, SSS, içerik iyileştirme</p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-0.5">
                API anahtarınızı ekleyin →{' '}
                <span className="text-violet-400">Hesap Ayarları → AI Entegrasyonu</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {aiApiKey ? (
              <>
                <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-500 mr-2">
                  {AI_MODES.slice(0, 3).map(m => (
                    <div key={m.id} className="flex items-center gap-1">
                      <i className={`fa-solid ${m.icon} text-violet-400 text-[8px]`}></i>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
                <button onClick={openNew}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold shadow-lg shadow-violet-500/30 transition-colors">
                  <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                  <span className="hidden sm:inline">Yeni Makale Üret</span>
                  <span className="sm:hidden">Üret</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-slate-600 hidden sm:block">
                  {AI_MODES.map(m => (
                    <div key={m.id} className="flex items-center gap-1.5 mb-1">
                      <i className={`fa-solid ${m.icon} text-slate-700 text-[8px]`}></i>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <i className="fa-solid fa-lock text-slate-600 text-[10px]"></i>
                  </div>
                  <span className="text-[9px] text-slate-600">Kilitli</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom stat bar when active */}
        {aiApiKey && (
          <div className="flex items-center gap-4 px-5 py-2.5 border-t border-violet-500/10 bg-violet-500/[0.03]">
            <span className="text-[10px] text-slate-600">Desteklenen modeller:</span>
            <span className="text-[10px] text-violet-300 font-mono">claude-opus-4-6 · claude-sonnet-4-6 · claude-haiku-4-5</span>
          </div>
        )}
      </div>

      {/* Category Manager */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowCategoryManager(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <i className="fa-solid fa-folder-open text-violet-400 text-[11px]"></i>
            </div>
            <span className="text-[13px] font-bold text-white">Kategori Yönetimi</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/15">
              {blogCategories.length} kategori
            </span>
          </div>
          <i className={`fa-solid fa-chevron-down text-slate-500 text-[10px] transition-transform duration-200 ${showCategoryManager ? 'rotate-180' : ''}`}></i>
        </button>

        {showCategoryManager && (
          <div className="border-t border-white/[0.05] px-4 pb-4 pt-3 animate-in slide-in-from-top-2 duration-200">
            {/* Add new category */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const trimmed = newCategoryName.trim();
                    if (!trimmed) return;
                    if (blogCategories.includes(trimmed)) { showToast('Bu kategori zaten mevcut', 'error'); return; }
                    setBlogCategories([...blogCategories, trimmed]);
                    setNewCategoryName('');
                    showToast('Kategori eklendi', 'success');
                  }
                }}
                placeholder="Yeni kategori adı..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 focus:border-violet-500/50 outline-none transition-all"
              />
              <button
                onClick={() => {
                  const trimmed = newCategoryName.trim();
                  if (!trimmed) return;
                  if (blogCategories.includes(trimmed)) { showToast('Bu kategori zaten mevcut', 'error'); return; }
                  setBlogCategories([...blogCategories, trimmed]);
                  setNewCategoryName('');
                  showToast('Kategori eklendi', 'success');
                }}
                className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus text-[10px]"></i> Ekle
              </button>
            </div>

            {/* Category list */}
            {blogCategories.length === 0 ? (
              <p className="text-center text-slate-600 text-xs py-4">Henüz kategori yok</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {blogCategories.map(cat => {
                  const postCount = blogPosts.filter(p => p.category === cat).length;
                  return (
                    <div key={cat} className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.10] transition-all">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 animate-pulse"></div>
                        <span className="text-[12px] font-semibold text-slate-200 truncate">{cat}</span>
                        {postCount > 0 && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shrink-0 animate-pulse">{postCount}</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (postCount > 0) { showToast(`Bu kategoride ${postCount} yazı var, önce yazıları taşıyın`, 'error'); return; }
                          if (confirm(`"${cat}" kategorisini silmek istediğinize emin misiniz?`)) {
                            setBlogCategories(blogCategories.filter(c => c !== cat));
                            showToast('Kategori silindi', 'delete');
                          }
                        }}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 ${postCount > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-500 hover:bg-red-500/20 hover:text-red-400'}`}
                        title={postCount > 0 ? `${postCount} yazı bu kategoride, silinemez` : 'Sil'}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-4">
          <div className="flex items-center gap-1">
            {[
              { id: 'published' as const, label: 'Yayında', icon: 'fa-globe', count: blogPosts.filter(p => p.isPublished).length },
              { id: 'draft' as const, label: 'Taslak', icon: 'fa-file-pen', count: blogPosts.filter(p => !p.isPublished).length },
            ].map(tab => (
              <button key={tab.id} onClick={() => setBlogTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${blogTab === tab.id ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                <i className={`fa-solid ${tab.icon} text-[10px]`}></i>
                {tab.label}
                <span className={`text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full ${blogTab === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {selectedBlogs.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              <span className="text-xs text-slate-400 font-medium">{selectedBlogs.length} seçili</span>
              <button onClick={() => {
                confirmAction({
                  title: 'Seçili Yazıları Sil',
                  description: `${selectedBlogs.length} yazıyı silmek istediğinize emin misiniz?`,
                  type: 'danger',
                  onConfirm: () => {
                    setBlogPosts(blogPosts.filter(p => !selectedBlogs.includes(p.id)));
                    setSelectedBlogs([]);
                    showToast(`${selectedBlogs.length} yazı silindi`, 'delete');
                  }
                });
              }}
                className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all">
                <i className="fa-solid fa-trash mr-1.5"></i>Sil
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
              <input type="text" placeholder="Yazı ara..." value={blogSearchTerm} onChange={e => setBlogSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all" />
              {blogSearchTerm && <button onClick={() => setBlogSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-xs"></i></button>}
            </div>
            <button onClick={openNew}
              className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0">
              <i className="fa-solid fa-plus text-[10px]"></i> Yeni Yazı
            </button>
            {blogPosts.length > 0 && (
              <button
                onClick={async () => {
                  confirmAction({
                    title: 'Tüm Blog Yazılarını Sil',
                    description: `Tüm ${blogPosts.length} blog yazısı KALICI olarak silinecek. Bu işlem geri alınamaz. Emin misiniz?`,
                    type: 'danger',
                    onConfirm: async () => {
                      await clearAllBlogPosts();
                      showToast('Tüm yazılar silindi', 'delete');
                    }
                  });
                }}

                className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0">
                <i className="fa-solid fa-trash-can text-[10px]"></i> Tümünü Sil
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {currentPosts.length === 0 ? (
          <EmptyState
            icon={blogTab === 'published' ? 'fa-newspaper' : 'fa-file-pen'}
            title={blogTab === 'published' ? 'Yayında yazı yok' : 'Taslak yazı yok'}
            description={blogSearchTerm ? `"${blogSearchTerm}" ile eşleşen yazı bulunamadı` : blogTab === 'published' ? 'Taslakları yayınlayarak başlayın' : 'Yeni yazı oluşturun'}
            action={blogSearchTerm ? { label: 'Aramayı Temizle', onClick: () => setBlogSearchTerm('') } : undefined}
          />
        ) : (
          <>
          <div className="overflow-x-auto scrollbar-hide" id="blog-table-container">
            <table className="w-full">
              <thead>
                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={allSelected} onChange={() => { if (allSelected) setSelectedBlogs(selectedBlogs.filter(id => !filteredIds.includes(id))); else setSelectedBlogs([...new Set([...selectedBlogs, ...filteredIds])]); }}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                  </th>
                  <th className="text-left px-3 py-3"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Yazı</span></th>
                  <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Kategori</span></th>
                  <th className="text-left px-3 py-3 hidden lg:table-cell"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Tarih</span></th>
                  <th className="text-center px-3 py-3 w-20"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Durum</span></th>
                  <th className="w-28 px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map(post => {
                  const isSelected = selectedBlogs.includes(post.id);
                  return (
                    <tr key={post.id} onClick={() => openEdit(post)}
                      className={`border-b border-white/[0.03] cursor-pointer transition-all group ${isSelected ? 'bg-[var(--color-primary)]/[0.06]' : 'hover:bg-white/[0.03]'}`}>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected}
                          onChange={e => { if (e.target.checked) setSelectedBlogs([...selectedBlogs, post.id]); else setSelectedBlogs(selectedBlogs.filter(id => id !== post.id)); }}
                          className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/20 shrink-0">
                            {post.featuredImage && <img src={post.featuredImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors truncate max-w-[140px] sm:max-w-[250px] md:max-w-[350px]">{post.title}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] mt-0.5">{post.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/15">{post.category}</span>
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <span className="text-[11px] text-slate-500">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        {!post.isPublished && post.scheduledAt && new Date(post.scheduledAt) > new Date() ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-amber-500/10 border-amber-500/20">
                            <i className="fa-solid fa-clock text-amber-400 text-[8px]"></i>
                            <span className="text-[10px] font-bold text-amber-400">Planlandı</span>
                          </div>
                        ) : (
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${post.isPublished ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-500/10 border-slate-500/20'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${post.isPublished ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                            <span className={`text-[10px] font-bold ${post.isPublished ? 'text-emerald-400' : 'text-slate-400'}`}>{post.isPublished ? 'Yayında' : 'Taslak'}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity justify-end">
                          <button onClick={() => openEdit(post)}
                            className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                            <i className="fa-solid fa-pen text-[10px]"></i>
                          </button>
                          {post.isPublished ? (
                            <button onClick={() => { setBlogPosts(blogPosts.map(p => p.id === post.id ? { ...p, isPublished: false } : p)); showToast('Taslağa alındı', 'success'); }}
                              className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all">
                              <i className="fa-solid fa-eye-slash text-[10px]"></i>
                            </button>
                          ) : (
                            <button onClick={() => { setBlogPosts(blogPosts.map(p => p.id === post.id ? { ...p, isPublished: true, publishedAt: new Date().toISOString() } : p)); showToast('Yayınlandı', 'success'); }}
                              className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all">
                              <i className="fa-solid fa-rocket text-[10px]"></i>
                            </button>
                          )}
                          <button onClick={() => {
                            confirmAction({
                              title: 'Yazıyı Sil',
                              description: `"${post.title}" başlıklı yazıyı silmek istediğinize emin misiniz?`,
                              type: 'danger',
                              onConfirm: () => {
                                setBlogPosts(blogPosts.filter(p => p.id !== post.id));
                                showToast('Silindi', 'delete');
                              }
                            });
                          }}
                            className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all">
                            <i className="fa-solid fa-trash text-[10px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalBlogPages > 1 && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center gap-3 m-4 mt-0">
              <span className="text-[11px] text-slate-500">
                {filteredPosts.length} yazıdan {(blogPage - 1) * BLOG_PER_PAGE + 1}–{Math.min(blogPage * BLOG_PER_PAGE, filteredPosts.length)} gösteriliyor
              </span>
              <div className="flex items-center gap-1 sm:ml-auto flex-wrap justify-center">
                <button
                  disabled={blogPage === 1}
                  onClick={() => setBlogPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <i className="fa-solid fa-chevron-left text-[9px] mr-1"></i>Önceki
                </button>
                {(() => {
                  const pages: (number | 'ellipsis')[] = [];
                  const maxVisible = 5;
                  if (totalBlogPages <= maxVisible) {
                    for (let i = 1; i <= totalBlogPages; i++) pages.push(i);
                  } else {
                    const half = Math.floor(maxVisible / 2);
                    let start = Math.max(1, blogPage - half);
                    const end = Math.min(totalBlogPages, start + maxVisible - 1);
                    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
                    if (start > 1) { pages.push(1); if (start > 2) pages.push('ellipsis'); }
                    for (let i = start; i <= end; i++) pages.push(i);
                    if (end < totalBlogPages) { if (end < totalBlogPages - 1) pages.push('ellipsis'); pages.push(totalBlogPages); }
                  }
                  return pages.map((p, i) => p === 'ellipsis' ? (
                    <span key={`e${i}`} className="px-2 text-slate-600 text-xs">…</span>
                  ) : (
                    <button key={p} onClick={() => setBlogPage(p as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${blogPage === p ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                      {p}
                    </button>
                  ));
                })()}
                <button
                  disabled={blogPage === totalBlogPages}
                  onClick={() => setBlogPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Sonraki<i className="fa-solid fa-chevron-right text-[9px] ml-1"></i>
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {/* ── Blog Drawer ─────────────────────────────────────────────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[210]">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-5xl bg-[#0d1117] shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/10 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg ${editingBlogPost ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  <i className={`fa-solid ${editingBlogPost ? 'fa-pen' : 'fa-plus'} text-sm`}></i>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white">{editingBlogPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h3>
                  <p className="text-[10px] text-slate-500">{wordCount} kelime · {charCount} karakter · SEO: <span className={scoreColor}>{seoScore}/100</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Auto-save badge */}
                {autoSavedAt && (
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-500/10 border border-slate-500/20">
                    <i className="fa-solid fa-cloud-arrow-up text-slate-400 text-[9px]"></i>
                    <span className="text-[10px] text-slate-400">Otomatik kaydedildi {autoSavedAt}</span>
                  </div>
                )}
                {/* SEO Score pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <div className={`w-2 h-2 rounded-full ${scoreBg}`}></div>
                  <span className={`text-[10px] font-bold ${scoreColor}`}>SEO {seoScore}%</span>
                </div>
                <button onClick={() => activeTab !== 'ai' && setSplitView(!splitView)}
                  disabled={activeTab === 'ai'}
                  title={activeTab === 'ai' ? 'AI Asistan açıkken bölünmüş görünüm kullanılamaz' : ''}
                  className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'ai' ? 'opacity-30 cursor-not-allowed bg-white/5 text-slate-600' : splitView ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  <i className="fa-solid fa-columns text-[10px]"></i> Bölünmüş
                </button>
                <button onClick={() => { setShowPreview(!showPreview); setSplitView(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showPreview && !splitView ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  <i className={`fa-solid ${showPreview && !splitView ? 'fa-pen' : 'fa-eye'} text-[10px]`}></i>
                  {showPreview && !splitView ? 'Düzenle' : 'Önizle'}
                </button>
                <button onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all">
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
            </div>

            {/* Inner Tabs */}
            <div className="flex items-center gap-1 px-5 py-2 border-b border-white/[0.06] shrink-0">
              {[
                { id: 'content' as const, label: 'İçerik', icon: 'fa-file-lines' },
                { id: 'seo' as const, label: 'SEO', icon: 'fa-magnifying-glass' },
                { id: 'settings' as const, label: 'Ayarlar', icon: 'fa-sliders' },
                { id: 'ai' as const, label: 'AI Asistan', icon: 'fa-robot' },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'} ${t.id === 'ai' ? (activeTab === 'ai' ? 'text-white' : 'text-violet-400 hover:text-violet-300') : ''}`}>
                  <i className={`fa-solid ${t.icon} text-[9px]`}></i>
                  {t.label}
                  {/* Pulsing dot when AI has no key — subtle teaser */}
                  {t.id === 'ai' && !aiApiKey && (
                    <span className="relative flex h-1.5 w-1.5 ml-0.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60"></span>
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                    </span>
                  )}
                  {t.id === 'ai' && aiApiKey && aiGenerated && (
                    <span className="ml-0.5 text-[8px] font-black text-emerald-400">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Draft banner */}
            {showDraftBanner && pendingDraft && (
              <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 shrink-0 animate-in slide-in-from-top-2 duration-200">
                <i className="fa-solid fa-triangle-exclamation text-amber-400 text-xs shrink-0"></i>
                <span className="text-[11px] text-amber-300 flex-1">
                  Kaydedilmemiş taslak bulundu ({new Date(pendingDraft.savedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})
                </span>
                <button
                  onClick={() => { setNewBlogPost(pendingDraft.data); setShowDraftBanner(false); showToast('Taslak geri yüklendi', 'success'); }}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline transition-colors shrink-0"
                >
                  Geri Yükle
                </button>
                <span className="text-amber-600 text-[10px]">|</span>
                <button
                  onClick={() => { setShowDraftBanner(false); localStorage.removeItem(BLOG_DRAFT_KEY); }}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-300 underline transition-colors shrink-0"
                >
                  Yoksay
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-hidden">

              {/* ── CONTENT TAB ── */}
              {activeTab === 'content' && (
                <div className={`h-full flex ${splitView ? 'flex-row' : 'flex-col'} overflow-hidden`}>
                  {(!showPreview || splitView) && (
                    <div className={`flex flex-col ${splitView ? 'flex-1 border-r border-white/[0.08]' : 'flex-1'} overflow-hidden`}>
                      {/* Formatting Toolbar */}
                      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
                        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
                          {tb('', 'fa-bold', 'Kalın (Ctrl+B)', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '**', '**', 'kalın', setContent); })}
                          {tb('', 'fa-italic', 'İtalik (Ctrl+I)', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '*', '*', 'italik', setContent); })}
                          {tb('', 'fa-strikethrough', 'Üstü çizili', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '~~', '~~', 'metin', setContent); })}
                          {tb('', 'fa-code', 'İnline kod', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '`', '`', 'kod', setContent); })}
                        </div>
                        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
                          {tb('H1', '', 'Başlık 1', () => { if (textareaRef.current) insertLine(textareaRef.current, '# Başlık 1', setContent); })}
                          {tb('H2', '', 'Başlık 2', () => { if (textareaRef.current) insertLine(textareaRef.current, '## Başlık 2', setContent); })}
                          {tb('H3', '', 'Başlık 3', () => { if (textareaRef.current) insertLine(textareaRef.current, '### Başlık 3', setContent); })}
                        </div>
                        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
                          {tb('', 'fa-list-ul', 'Sırasız liste', () => { if (textareaRef.current) insertLine(textareaRef.current, '- Liste öğesi', setContent); })}
                          {tb('', 'fa-list-ol', 'Numaralı liste', () => { if (textareaRef.current) insertLine(textareaRef.current, '1. Liste öğesi', setContent); })}
                          {tb('', 'fa-quote-left', 'Alıntı', () => { if (textareaRef.current) insertLine(textareaRef.current, '> Alıntı metni', setContent); })}
                          {tb('', 'fa-square-code', 'Kod bloğu', () => { if (textareaRef.current) insertLine(textareaRef.current, '```\nkod buraya\n```', setContent); })}
                        </div>
                        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
                          {tb('', 'fa-link', 'Link (Ctrl+K)', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '[', '](https://)', 'link metni', setContent); })}
                          {tb('', 'fa-image', 'Resim', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '![', '](https://resim-url)', 'açıklama', setContent); })}
                        </div>
                        {/* Quick inserts */}
                        <div className="flex items-center gap-0.5">
                          {tb('SSS', 'fa-circle-question', 'SSS Bölümü Ekle (AEO)', () => {
                            const faqBlock = `\n## Sıkça Sorulan Sorular\n\n**Transfer ne kadar sürer?**\nAntalya Havalimanı'ndan hedefe ulaşım süresi ortalama 20-60 dakika arasında değişmektedir.\n\n**Fiyatlar ne kadardır?**\nFiyatlarımız bölgeye ve araç tipine göre değişmektedir. WhatsApp üzerinden hızlıca fiyat alabilirsiniz.\n\n**Çocuk koltuğu var mı?**\nEvet, ücretsiz olarak bebek ve çocuk koltuğu sağlıyoruz. Rezervasyon sırasında belirtiniz.\n`;
                            setContent(newBlogPost.content + faqBlock);
                          })}
                          {tb('Tablo', 'fa-table', 'Tablo Ekle', () => {
                            const tableBlock = `\n| Bölge | Mesafe | Süre | Fiyat |\n|-------|--------|------|-------|\n| Side | 65 km | 55 dk | €30 |\n| Alanya | 120 km | 95 dk | €50 |\n`;
                            setContent(newBlogPost.content + tableBlock);
                          })}
                        </div>
                        <div className="flex-1" />
                        <span className="text-[9px] text-slate-600 hidden sm:block">Ctrl+B · Ctrl+I · Ctrl+K · Ctrl+S</span>
                      </div>

                      {/* Textarea */}
                      <textarea
                        ref={textareaRef}
                        value={newBlogPost.content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Blog içeriğinizi buraya yazın veya AI Asistan ile oluşturun...

# Ana Başlık
## Alt Başlık

**kalın** *italik* ~~üstü çizili~~

- liste öğesi

> Alıntı metni

[link metni](https://url)"
                        className="flex-1 p-5 font-mono text-[13px] bg-transparent text-slate-200 outline-none resize-none leading-relaxed placeholder-slate-700 overflow-y-auto"
                        style={{ lineHeight: '1.75', caretColor: '#c5a059' }}
                      />
                    </div>
                  )}

                  {/* Preview pane */}
                  {(showPreview || splitView) && (
                    <div className={`${splitView ? 'flex-1' : 'flex-1'} overflow-y-auto p-6`}>
                      {splitView && <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4">Önizleme</p>}
                      {newBlogPost.featuredImage && (
                        <div className="rounded-xl overflow-hidden mb-5 shadow-xl">
                          <img src={newBlogPost.featuredImage} alt="Preview" className="w-full h-40 object-cover" />
                        </div>
                      )}
                      <span className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">{newBlogPost.category}</span>
                      <h1 className="text-xl font-black mt-2 text-white leading-tight">{newBlogPost.title || <span className="text-slate-600">Başlık girilmedi...</span>}</h1>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">{newBlogPost.excerpt || <span className="text-slate-700">Özet girilmedi...</span>}</p>
                      <hr className="my-4 border-white/[0.06]" />
                      <div className="prose-custom text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(newBlogPost.content) || '<p class="text-slate-700">İçerik girilmedi...</p>') }} />
                    </div>
                  )}
                </div>
              )}

              {/* ── AI ASSISTANT TAB ── */}
              {activeTab === 'ai' && (
                <div className="h-full overflow-y-auto">

                  {/* ── LOCKED STATE (no API key) ── */}
                  {!aiApiKey ? (
                    <div className="h-full flex flex-col items-center justify-center px-8 py-12 text-center">
                      {/* Pulsing robot icon */}
                      <div className="relative mb-7">
                        <span className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" style={{ width: 72, height: 72, borderRadius: '50%', animationDuration: '2.4s' }}></span>
                        <span className="absolute inset-0 rounded-full bg-violet-500/10" style={{ width: 72, height: 72, borderRadius: '50%', margin: '-4px', padding: '4px' }}></span>
                        <div className="relative w-[72px] h-[72px] rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-lg shadow-violet-500/10">
                          <i className="fa-solid fa-robot text-[28px] text-violet-400"></i>
                        </div>
                      </div>
                      <h4 className="text-white font-bold text-[15px] mb-1.5 font-outfit">AI Asistan Hazır</h4>
                      <p className="text-slate-500 text-[12px] leading-relaxed mb-7 max-w-[260px]">
                        SEO, AEO ve GEO uyumlu blog içeriği üretmek için Anthropic API anahtarınızı ekleyin.
                      </p>
                      {/* Steps */}
                      <div className="w-full max-w-[280px] rounded-2xl bg-violet-500/[0.06] border border-violet-500/[0.12] p-4 text-left space-y-2.5 mb-8">
                        {[
                          { step: '1', text: 'Admin Paneli → Hesap Ayarları' },
                          { step: '2', text: 'AI Entegrasyonu bölümünü aç' },
                          { step: '3', text: 'Anthropic API anahtarını yapıştır' },
                        ].map(s => (
                          <div key={s.step} className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-[9px] font-black flex items-center justify-center shrink-0">{s.step}</span>
                            <span className="text-[11px] text-slate-400">{s.text}</span>
                          </div>
                        ))}
                      </div>
                      {/* Ghost preview of controls */}
                      <div className="w-full max-w-sm space-y-2.5 opacity-[0.12] pointer-events-none select-none">
                        <div className="grid grid-cols-2 gap-2">
                          {AI_MODES.map(mode => (
                            <div key={mode.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
                              <i className={`fa-solid ${mode.icon} text-slate-600 text-[10px]`}></i>
                              <span className="text-[11px] text-slate-600 font-bold">{mode.label}</span>
                            </div>
                          ))}
                        </div>
                        <div className="w-full py-4 rounded-2xl border border-violet-500/10 bg-violet-500/5 flex items-center justify-center gap-2">
                          <i className="fa-solid fa-wand-magic-sparkles text-slate-700 text-sm"></i>
                          <span className="text-sm font-bold text-slate-700">İçerik Oluştur</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
                      <p className="text-[11px] text-emerald-400 font-medium">Claude AI bağlı — üretmeye hazır</p>
                      <div className="ml-auto flex gap-1">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">SEO</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">AEO</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">GEO</span>
                      </div>
                    </div>

                  {/* Mode Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">İşlem Modu</label>
                    <div className="grid grid-cols-2 gap-2">
                      {AI_MODES.map(mode => (
                        <button key={mode.id} type="button" onClick={() => setAiMode(mode.id as typeof aiMode)}
                          className={`flex items-start gap-2.5 p-3 rounded-xl text-left transition-all border ${aiMode === mode.id ? 'bg-violet-500/20 border-violet-500/40' : 'bg-white/[0.03] border-white/[0.06] hover:border-white/15'}`}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${aiMode === mode.id ? 'bg-violet-500/30' : 'bg-white/5'}`}>
                            <i className={`fa-solid ${mode.icon} text-[10px] ${aiMode === mode.id ? 'text-violet-300' : 'text-slate-400'}`}></i>
                          </div>
                          <div>
                            <p className={`text-[11px] font-bold ${aiMode === mode.id ? 'text-violet-300' : 'text-slate-300'}`}>{mode.label}</p>
                            <p className="text-[9px] text-slate-600 mt-0.5">{mode.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fields — only show when relevant */}
                  {(aiMode === 'full') && (
                    <>
                      {/* Article Type */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Makale Türü</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {ARTICLE_TYPES.map(type => (
                            <button key={type.id} type="button" onClick={() => setAiArticleType(type.id)}
                              className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-[11px] font-bold transition-all border ${aiArticleType === type.id ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'}`}>
                              <i className={`fa-solid ${type.icon} text-[10px]`}></i>
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konu / Başlık Fikri <span className="text-red-400">*</span></label>
                          <input value={aiTopic} onChange={e => setAiTopic(e.target.value)}
                            placeholder="Antalya Havalimanı'ndan Side Transfer Rehberi"
                            className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ana Anahtar Kelime</label>
                          <input value={aiKeyword} onChange={e => setAiKeyword(e.target.value)}
                            placeholder="antalya havalimanı side transfer"
                            className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none transition-all" />
                        </div>
                      </div>
                    </>
                  )}

                  {(aiMode === 'full' || aiMode === 'faq') && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hedef Bölge/Lokasyon</label>
                      <input value={aiRegion} onChange={e => setAiRegion(e.target.value)}
                        placeholder="Side, Antalya"
                        className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none transition-all" />
                    </div>
                  )}

                  {(aiMode === 'full' || aiMode === 'improve') && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Üslup / Ton</label>
                      <div className="flex flex-wrap gap-1.5">
                        {TONES.map(tone => (
                          <button key={tone} type="button" onClick={() => setAiTone(tone)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${aiTone === tone ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'}`}>
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(aiMode === 'meta') && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ana Anahtar Kelime</label>
                      <input value={aiKeyword} onChange={e => setAiKeyword(e.target.value)}
                        placeholder="antalya vip transfer"
                        className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none transition-all" />
                    </div>
                  )}

                  {/* Mode info box */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'SEO', icon: 'fa-magnifying-glass', color: 'blue', desc: 'Başlıklar, keyword, iç linkler' },
                      { label: 'AEO', icon: 'fa-microphone', color: 'emerald', desc: 'SSS, sesli arama uyumu' },
                      { label: 'GEO', icon: 'fa-location-dot', color: 'amber', desc: 'Coğrafi entite, AI motorları' },
                    ].map(item => (
                      <div key={item.label} className={`p-2.5 rounded-xl bg-${item.color}-500/[0.08] border border-${item.color}-500/20`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <i className={`fa-solid ${item.icon} text-${item.color}-400 text-[9px]`}></i>
                          <span className={`text-[9px] font-black text-${item.color}-400`}>{item.label}</span>
                        </div>
                        <p className="text-[9px] text-slate-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Error */}
                  {aiError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                      <i className="fa-solid fa-triangle-exclamation text-red-400 text-xs mt-0.5 shrink-0"></i>
                      <p className="text-[11px] text-red-400">{aiError}</p>
                    </div>
                  )}

                  {/* Success */}
                  {aiGenerated && !aiError && !isGenerating && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-400 text-xs shrink-0"></i>
                      <p className="text-[11px] text-emerald-400 font-medium">Başarılı! İçerik ve SEO sekmeleri güncellendi.</p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiApiKey}
                    className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: isGenerating ? 'rgba(139,92,246,0.15)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      border: '1px solid rgba(139,92,246,0.4)',
                      color: 'white',
                      boxShadow: isGenerating ? 'none' : '0 4px 24px rgba(139,92,246,0.25)',
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>İşleniyor...</span>
                        <span className="text-[10px] text-violet-300">(30–60 sn)</span>
                      </>
                    ) : (
                      <>
                        <i className={`fa-solid ${AI_MODES.find(m => m.id === aiMode)?.icon || 'fa-wand-magic-sparkles'} text-sm`}></i>
                        <span>{AI_MODES.find(m => m.id === aiMode)?.label || 'Oluştur'}</span>
                      </>
                    )}
                  </button>

                  {isGenerating && (
                    <div className="space-y-1.5">
                      {(aiMode === 'full'
                        ? ['SEO yapısı analiz ediliyor...', 'AEO SSS bölümü hazırlanıyor...', 'GEO verileri entegre ediliyor...', 'Makale yazılıyor (800+ kelime)...']
                        : aiMode === 'improve'
                        ? ['Mevcut içerik okunuyor...', 'İyileştirme noktaları tespit ediliyor...', 'Geliştirilmiş içerik yazılıyor...']
                        : aiMode === 'faq'
                        ? ['Soru kalıpları oluşturuluyor...', 'Cevaplar yazılıyor...']
                        : ['Başlık optimize ediliyor...', 'Meta açıklama yazılıyor...']
                      ).map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: `${i * 0.25}s` }}></div>
                          <span className="text-[10px] text-slate-500">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                    </div>
                  )}
                </div>
              )}

              {/* ── SEO TAB ── */}
              {activeTab === 'seo' && (
                <div className="p-6 space-y-5 overflow-y-auto h-full">
                  {/* Score Overview */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Skoru</p>
                      <span className={`text-2xl font-black font-outfit ${scoreColor}`}>{seoScore}<span className="text-sm text-slate-500">/100</span></span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden mb-4">
                      <div className={`h-full ${scoreBg} rounded-full transition-all duration-500`} style={{ width: `${seoScore}%` }}></div>
                    </div>
                    <div className="space-y-2">
                      {seoChecks.map((check, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${check.pass ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                            <i className={`fa-solid ${check.pass ? 'fa-check' : 'fa-xmark'} text-[8px] ${check.pass ? 'text-emerald-400' : 'text-red-400'}`}></i>
                          </div>
                          <div>
                            <p className={`text-[11px] font-semibold ${check.pass ? 'text-slate-300' : 'text-slate-400'}`}>{check.label}</p>
                            {!check.pass && <p className="text-[10px] text-slate-600">{check.tip}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">SEO Başlığı</label>
                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                      value={newBlogPost.seoTitle || ''} onChange={e => setNewBlogPost(p => ({ ...p, seoTitle: e.target.value }))} placeholder="Arama motoru başlığı (60 karakter)..." />
                    <div className="flex justify-between">
                      <p className="text-[10px] text-slate-600">{(newBlogPost.seoTitle || '').length}/60 karakter</p>
                      {(newBlogPost.seoTitle || '').length > 60 && <p className="text-[10px] text-red-400">Çok uzun!</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Meta Açıklama</label>
                    <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-[var(--color-primary)]/50 outline-none resize-none transition-all" rows={3}
                      value={newBlogPost.seoDescription || ''} onChange={e => setNewBlogPost(p => ({ ...p, seoDescription: e.target.value }))} placeholder="Arama motorlarında görünen açıklama (160 karakter)..." />
                    <div className="flex justify-between">
                      <p className="text-[10px] text-slate-600">{(newBlogPost.seoDescription || '').length}/160 karakter</p>
                      {(newBlogPost.seoDescription || '').length > 160 && <p className="text-[10px] text-red-400">Çok uzun!</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Etiketler (virgülle ayırın)</label>
                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                      value={(newBlogPost.tags || []).join(', ')} onChange={e => setNewBlogPost(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="antalya transfer, vip, havalimanı..." />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(newBlogPost.tags || []).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold border border-[var(--color-primary)]/20">{tag}</span>
                      ))}
                    </div>
                  </div>
                  {/* SERP Preview */}
                  <div className="p-4 rounded-xl bg-white rounded-xl overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Google SERP Önizlemesi</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-blue-700 text-[15px] font-medium truncate">{newBlogPost.seoTitle || newBlogPost.title || 'Sayfa Başlığı'}</p>
                      <p className="text-green-700 text-[12px] mt-0.5">ataflugtransfer.com › blog › {newBlogPost.slug || 'yazi-url'}</p>
                      <p className="text-slate-600 text-[13px] mt-1 leading-relaxed line-clamp-2">{newBlogPost.seoDescription || newBlogPost.excerpt || 'Meta açıklama burada görünecek...'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SETTINGS TAB ── */}
              {activeTab === 'settings' && (
                <div className="p-6 space-y-5 overflow-y-auto h-full">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-image text-[8px] text-[var(--color-primary)]"></i> Kapak Görseli</label>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 group">
                      {newBlogPost.featuredImage && <img src={newBlogPost.featuredImage} className="w-full h-full object-cover" alt="Preview" />}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <input type="file" id="blog-image-upload" className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { if (f.size > 2 * 1024 * 1024) { alert('Maks 2MB!'); return; } const r = new FileReader(); r.onloadend = () => setNewBlogPost(p => ({ ...p, featuredImage: r.result as string })); r.readAsDataURL(f); } }} />
                        <label htmlFor="blog-image-upload" className="bg-white text-slate-800 px-4 py-2 rounded-xl font-bold text-xs cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors"><i className="fa-solid fa-upload mr-2"></i>Yükle</label>
                      </div>
                    </div>
                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[var(--color-primary)]/50 outline-none transition-all" value={newBlogPost.featuredImage} onChange={e => setNewBlogPost(p => ({ ...p, featuredImage: e.target.value }))} placeholder="Görsel URL..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Başlık *</label>
                      <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                        value={newBlogPost.title} onChange={e => {
                          const v = e.target.value;
                          const autoSlug = v.toLowerCase().replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's').replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
                          setNewBlogPost(p => ({ ...p, title: v, slug: slugManuallyEdited ? p.slug : autoSlug }));
                        }} placeholder="Yazı başlığı..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Kategori</label>
                      <select className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                        value={newBlogPost.category} onChange={e => setNewBlogPost(p => ({ ...p, category: e.target.value }))}>
                        {blogCategories.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Yeni kategori..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white focus:border-[var(--color-primary)]/50 outline-none placeholder-slate-600 transition-all" />
                        <button type="button" onClick={() => { if (newCategoryName.trim() && !blogCategories.includes(newCategoryName.trim())) { setBlogCategories([...blogCategories, newCategoryName.trim()]); setNewBlogPost(p => ({ ...p, category: newCategoryName.trim() })); setNewCategoryName(''); } }}
                          className="px-3 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-amber-600 text-white text-xs font-bold transition-colors"><i className="fa-solid fa-plus"></i></button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">URL (Slug) *</label>
                      <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none font-mono transition-all"
                        value={newBlogPost.slug} onChange={e => { setSlugManuallyEdited(true); setNewBlogPost(p => ({ ...p, slug: e.target.value })); }} placeholder="yazi-url-adresi" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Yazar</label>
                      <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                        value={newBlogPost.author || ''} onChange={e => setNewBlogPost(p => ({ ...p, author: e.target.value }))} placeholder="Yazar adı..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Özet</label>
                    <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-[var(--color-primary)]/50 outline-none resize-none transition-all" rows={3}
                      value={newBlogPost.excerpt} onChange={e => setNewBlogPost(p => ({ ...p, excerpt: e.target.value }))} placeholder="Kısa özet metni..." />
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/[0.06]">
                    <input type="checkbox" id="publish-check" checked={newBlogPost.isPublished} onChange={e => setNewBlogPost(p => ({ ...p, isPublished: e.target.checked }))} className="w-4 h-4 rounded accent-[#c5a059]" />
                    <label htmlFor="publish-check" className="font-bold text-white text-sm flex-1 cursor-pointer">Hemen Yayınla</label>
                    {newBlogPost.isPublished && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg">YAYINDA</span>}
                  </div>
                  {!newBlogPost.isPublished && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-clock text-[8px] text-amber-400"></i> Yayın Tarihi (Planlanmış)
                      </label>
                      <input
                        type="datetime-local"
                        value={newBlogPost.scheduledAt ? newBlogPost.scheduledAt.slice(0, 16) : ''}
                        onChange={e => setNewBlogPost(p => ({ ...p, scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                        className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500/50 outline-none transition-all [color-scheme:dark]"
                      />
                      {newBlogPost.scheduledAt && new Date(newBlogPost.scheduledAt) > new Date() && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <i className="fa-solid fa-clock text-amber-400 text-xs shrink-0"></i>
                          <span className="text-[11px] text-amber-300">
                            {new Date(newBlogPost.scheduledAt).toLocaleString('tr-TR')} tarihinde otomatik yayınlanacak
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.08] flex items-center gap-3 shrink-0 bg-white/[0.02]">
              <div className="text-[10px] text-slate-600 hidden sm:flex items-center gap-3">
                <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">Ctrl+S</kbd> kaydet</span>
                <span className={`font-bold ${scoreColor}`}>SEO {seoScore}%</span>
              </div>
              <div className="flex-1" />
              <button onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">İptal</button>
              <button onClick={handleSave}
                className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-amber-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
                <i className="fa-solid fa-check text-[11px]"></i> {editingBlogPost ? 'Kaydet' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
