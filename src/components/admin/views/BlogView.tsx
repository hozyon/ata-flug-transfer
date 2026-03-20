import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { EmptyState } from '../EmptyState';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  isPublished: boolean;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  viewCount?: number;
}

interface BlogViewProps {
  blogPosts: BlogPost[];
  setBlogPosts: Dispatch<SetStateAction<BlogPost[]>>;
  blogTab: 'published' | 'draft';
  setBlogTab: Dispatch<SetStateAction<'published' | 'draft'>>;
  blogCategories: string[];
  setBlogCategories: Dispatch<SetStateAction<string[]>>;
  blogSearchTerm: string;
  setBlogSearchTerm: Dispatch<SetStateAction<string>>;
  selectedBlogs: string[];
  setSelectedBlogs: Dispatch<SetStateAction<string[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'delete') => void;
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
const ARTICLE_TYPES = [
  { id: 'destination', label: 'Destinasyon Rehberi', icon: 'fa-map-location-dot' },
  { id: 'transfer', label: 'Transfer Rehberi', icon: 'fa-car-side' },
  { id: 'tips', label: 'Seyahat İpuçları', icon: 'fa-lightbulb' },
  { id: 'comparison', label: 'Karşılaştırma', icon: 'fa-scale-balanced' },
  { id: 'faq', label: 'S.S.S Makalesi', icon: 'fa-circle-question' },
];

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
  blogSearchTerm, setBlogSearchTerm, selectedBlogs, setSelectedBlogs, showToast
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
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'ai' | 'settings'>('content');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // AI state
  const [aiApiKey, setAiApiKey] = useState(() => localStorage.getItem(AI_LS_KEY) || '');
  const [aiShowKey, setAiShowKey] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiKeyword, setAiKeyword] = useState('');
  const [aiRegion, setAiRegion] = useState('Antalya');
  const [aiTone, setAiTone] = useState('Profesyonel');
  const [aiArticleType, setAiArticleType] = useState('destination');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiGenerated, setAiGenerated] = useState(false);

  const wordCount = newBlogPost.content.trim() ? newBlogPost.content.trim().split(/\s+/).length : 0;
  const charCount = newBlogPost.content.length;
  const { score: seoScore, checks: seoChecks } = calcSeoScore(newBlogPost);

  const currentPosts = blogPosts
    .filter(p => blogTab === 'published' ? p.isPublished : !p.isPublished)
    .filter(p => !blogSearchTerm ||
      p.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(blogSearchTerm.toLowerCase())
    );

  const filteredIds = currentPosts.map(p => p.id);
  const allSelected = currentPosts.length > 0 && currentPosts.every(p => selectedBlogs.includes(p.id));

  const openNew = () => {
    setNewBlogPost({
      id: '', title: '', slug: '', excerpt: '', content: '',
      category: blogCategories[0] || 'Destinasyon',
      featuredImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
      isPublished: false, tags: [], author: 'Ata Flug Transfer',
      seoTitle: '', seoDescription: '', viewCount: 0,
    });
    setEditingBlogPost(null);
    setSlugManuallyEdited(false);
    setActiveTab('content');
    setShowPreview(false);
    setSplitView(false);
    setAiGenerated(false);
    setAiError('');
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
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!newBlogPost.title.trim()) { showToast('Başlık zorunludur', 'error'); return; }
    if (!newBlogPost.slug.trim()) { showToast('URL (slug) zorunludur', 'error'); return; }
    const now = new Date().toISOString();
    if (editingBlogPost) {
      const updated: BlogPost = { ...newBlogPost, updatedAt: now };
      setBlogPosts(blogPosts.map(p => p.id === editingBlogPost.id ? updated : p));
      showToast('Blog yazısı güncellendi', 'success');
    } else {
      const created: BlogPost = {
        ...newBlogPost,
        id: Date.now().toString(),
        publishedAt: newBlogPost.isPublished ? now : undefined,
        updatedAt: now,
        tags: newBlogPost.tags || [],
        author: newBlogPost.author || 'Ata Flug Transfer',
        seoTitle: newBlogPost.seoTitle || newBlogPost.title,
        seoDescription: newBlogPost.seoDescription || newBlogPost.excerpt,
        viewCount: 0,
      };
      setBlogPosts([...blogPosts, created]);
      showToast('Blog yazısı oluşturuldu', 'success');
    }
    setIsDrawerOpen(false);
  };

  const setContent = (v: string) => setNewBlogPost(p => ({ ...p, content: v }));

  // AI Generate
  const handleGenerate = async () => {
    if (!aiApiKey.trim()) { setAiError('Anthropic API anahtarı gerekli.'); return; }
    if (!aiTopic.trim()) { setAiError('Konu alanı boş olamaz.'); return; }
    setAiError('');
    setIsGenerating(true);
    try {
      const typeLabel = ARTICLE_TYPES.find(t => t.id === aiArticleType)?.label || aiArticleType;
      const prompt = buildPrompt(aiTopic, aiKeyword, aiRegion, aiTone, typeLabel);
      const raw = await callClaudeAPI(aiApiKey, prompt);
      // Extract JSON from response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Yanıt JSON formatında değil. Tekrar deneyin.');
      const parsed = JSON.parse(jsonMatch[0]) as {
        title: string; seoTitle: string; seoDescription: string;
        excerpt: string; tags: string[]; content: string;
      };
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
      setAiGenerated(true);
      showToast('İçerik oluşturuldu! İçerik sekmesini kontrol edin.', 'success');
      setActiveTab('content');
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
  }, [isDrawerOpen, newBlogPost]);

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
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-black text-white mt-1">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg`}>
                <i className={`fa-solid ${s.icon} text-white text-sm`}></i>
              </div>
            </div>
          </div>
        ))}
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
              <button onClick={() => { if (confirm(`${selectedBlogs.length} yazıyı silmek istediğinize emin misiniz?`)) { setBlogPosts(blogPosts.filter(p => !selectedBlogs.includes(p.id))); setSelectedBlogs([]); showToast(`${selectedBlogs.length} yazı silindi`, 'delete'); } }}
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
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead>
                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={allSelected} onChange={() => { if (allSelected) setSelectedBlogs(selectedBlogs.filter(id => !filteredIds.includes(id))); else setSelectedBlogs([...new Set([...selectedBlogs, ...filteredIds])]); }}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                  </th>
                  <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Yazı</span></th>
                  <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</span></th>
                  <th className="text-left px-3 py-3 hidden lg:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tarih</span></th>
                  <th className="text-center px-3 py-3 w-20"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span></th>
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
                            <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors truncate max-w-[250px] sm:max-w-[350px]">{post.title}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[200px] sm:max-w-[300px] mt-0.5">{post.excerpt}</p>
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
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${post.isPublished ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-500/10 border-slate-500/20'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${post.isPublished ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                          <span className={`text-[10px] font-bold ${post.isPublished ? 'text-emerald-400' : 'text-slate-400'}`}>{post.isPublished ? 'Yayında' : 'Taslak'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
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
                          <button onClick={() => { if (confirm('Bu yazıyı silmek istediğinize emin misiniz?')) { setBlogPosts(blogPosts.filter(p => p.id !== post.id)); showToast('Silindi', 'delete'); } }}
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
                {/* SEO Score pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <div className={`w-2 h-2 rounded-full ${scoreBg}`}></div>
                  <span className={`text-[10px] font-bold ${scoreColor}`}>SEO {seoScore}%</span>
                </div>
                <button onClick={() => setSplitView(!splitView)}
                  className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${splitView ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
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
                { id: 'ai' as const, label: 'AI Asistan', icon: 'fa-robot', badge: aiGenerated ? '✓' : undefined },
                { id: 'seo' as const, label: 'SEO', icon: 'fa-magnifying-glass' },
                { id: 'settings' as const, label: 'Ayarlar', icon: 'fa-sliders' },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'} ${t.id === 'ai' ? 'text-violet-400' : ''}`}>
                  <i className={`fa-solid ${t.icon} text-[9px]`}></i>
                  {t.label}
                  {t.id === 'ai' && <span className="ml-1 text-[8px] font-black text-violet-400 bg-violet-500/20 px-1 py-0.5 rounded">NEW</span>}
                  {t.badge && <span className="ml-1 text-[8px] font-black text-emerald-400">{t.badge}</span>}
                </button>
              ))}
            </div>

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
                      <div className="prose-custom text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(newBlogPost.content) || '<p class="text-slate-700">İçerik girilmedi...</p>' }} />
                    </div>
                  )}
                </div>
              )}

              {/* ── AI ASSISTANT TAB ── */}
              {activeTab === 'ai' && (
                <div className="h-full overflow-y-auto p-5 space-y-5">
                  {/* Header */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-600/5 border border-violet-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                        <i className="fa-solid fa-robot text-white text-sm"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">AI Blog Yazarı</p>
                        <p className="text-[10px] text-slate-400">SEO · AEO · GEO uyumlu makale üretimi</p>
                      </div>
                      <div className="ml-auto flex gap-1.5">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">SEO</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AEO</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">GEO</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Konu ve anahtar kelimeyi girin, Claude AI sizin için SEO, AEO ve GEO uyumlu, 800+ kelimelik Türkçe blog yazısı oluştursun. Başlık, meta açıklama, etiketler ve SSS bölümü otomatik eklenir.
                    </p>
                  </div>

                  {/* API Key */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <i className="fa-solid fa-key text-[8px] text-violet-400"></i>
                      Anthropic API Anahtarı
                    </label>
                    <div className="relative">
                      <input
                        type={aiShowKey ? 'text' : 'password'}
                        value={aiApiKey}
                        onChange={e => { setAiApiKey(e.target.value); localStorage.setItem(AI_LS_KEY, e.target.value); }}
                        placeholder="sk-ant-api03-..."
                        className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-violet-500/50 outline-none transition-all pr-20"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button type="button" onClick={() => setAiShowKey(!aiShowKey)}
                          className="text-slate-500 hover:text-white text-xs transition-colors">
                          <i className={`fa-solid ${aiShowKey ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                        </button>
                        {aiApiKey && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      Anahtarınız tarayıcınızda şifreli saklanır. <span className="text-violet-400">console.anthropic.com</span> adresinden edinebilirsiniz.
                    </p>
                  </div>

                  {/* Article Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Makale Türü</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ARTICLE_TYPES.map(type => (
                        <button key={type.id} type="button" onClick={() => setAiArticleType(type.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-bold transition-all border ${aiArticleType === type.id ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/15 hover:text-white'}`}>
                          <i className={`fa-solid ${type.icon} text-[10px]`}></i>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic + Keyword */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Konu / Başlık Fikri <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={aiTopic}
                        onChange={e => setAiTopic(e.target.value)}
                        placeholder="Antalya Havalimanı'ndan Side Transfer Rehberi"
                        className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Ana Anahtar Kelime
                      </label>
                      <input
                        value={aiKeyword}
                        onChange={e => setAiKeyword(e.target.value)}
                        placeholder="antalya havalimanı side transfer"
                        className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Region + Tone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hedef Bölge/Lokasyon</label>
                      <input
                        value={aiRegion}
                        onChange={e => setAiRegion(e.target.value)}
                        placeholder="Side, Antalya"
                        className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
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
                  </div>

                  {/* Optimization badges info */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { badge: 'SEO', color: 'blue', icon: 'fa-magnifying-glass', desc: 'H1-H3 başlıklar, anahtar kelime yoğunluğu, meta etiketler, iç linkler' },
                      { badge: 'AEO', color: 'emerald', icon: 'fa-microphone', desc: 'Yapılandırılmış SSS, direkt cevaplar, sesli arama uyumluluğu' },
                      { badge: 'GEO', color: 'amber', icon: 'fa-location-dot', desc: 'Coğrafi entiteler, doğrulanabilir veriler, AI motorları için yapısal içerik' },
                    ].map(item => (
                      <div key={item.badge} className={`p-3 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <i className={`fa-solid ${item.icon} text-${item.color}-400 text-[10px]`}></i>
                          <span className={`text-[10px] font-black text-${item.color}-400`}>{item.badge}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-relaxed">{item.desc}</p>
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
                  {aiGenerated && !aiError && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-400 text-xs shrink-0"></i>
                      <p className="text-[11px] text-emerald-400">İçerik oluşturuldu! İçerik sekmesinde düzenleyebilirsiniz.</p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiTopic.trim() || !aiApiKey.trim()}
                    className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: isGenerating ? 'rgba(139,92,246,0.15)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      border: '1px solid rgba(139,92,246,0.4)',
                      color: 'white',
                      boxShadow: isGenerating ? 'none' : '0 4px 24px rgba(139,92,246,0.3)',
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Makale oluşturuluyor...</span>
                        <span className="text-[10px] text-violet-300 ml-1">(30–60 sn)</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
                        <span>AI ile Makale Oluştur</span>
                      </>
                    )}
                  </button>

                  {isGenerating && (
                    <div className="space-y-2">
                      {['SEO analizi yapılıyor...', 'AEO yapısı hazırlanıyor...', 'GEO verileri ekleniyor...', 'İçerik yazılıyor...'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                          <span className="text-[10px] text-slate-500">{step}</span>
                        </div>
                      ))}
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
                      <span className={`text-2xl font-black ${scoreColor}`}>{seoScore}<span className="text-sm text-slate-500">/100</span></span>
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
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEO Başlığı</label>
                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                      value={newBlogPost.seoTitle || ''} onChange={e => setNewBlogPost(p => ({ ...p, seoTitle: e.target.value }))} placeholder="Arama motoru başlığı (60 karakter)..." />
                    <div className="flex justify-between">
                      <p className="text-[10px] text-slate-600">{(newBlogPost.seoTitle || '').length}/60 karakter</p>
                      {(newBlogPost.seoTitle || '').length > 60 && <p className="text-[10px] text-red-400">Çok uzun!</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta Açıklama</label>
                    <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-[var(--color-primary)]/50 outline-none resize-none transition-all" rows={3}
                      value={newBlogPost.seoDescription || ''} onChange={e => setNewBlogPost(p => ({ ...p, seoDescription: e.target.value }))} placeholder="Arama motorlarında görünen açıklama (160 karakter)..." />
                    <div className="flex justify-between">
                      <p className="text-[10px] text-slate-600">{(newBlogPost.seoDescription || '').length}/160 karakter</p>
                      {(newBlogPost.seoDescription || '').length > 160 && <p className="text-[10px] text-red-400">Çok uzun!</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Etiketler (virgülle ayırın)</label>
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
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Başlık *</label>
                      <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                        value={newBlogPost.title} onChange={e => {
                          const v = e.target.value;
                          const autoSlug = v.toLowerCase().replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's').replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
                          setNewBlogPost(p => ({ ...p, title: v, slug: slugManuallyEdited ? p.slug : autoSlug }));
                        }} placeholder="Yazı başlığı..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
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
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">URL (Slug) *</label>
                      <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none font-mono transition-all"
                        value={newBlogPost.slug} onChange={e => { setSlugManuallyEdited(true); setNewBlogPost(p => ({ ...p, slug: e.target.value })); }} placeholder="yazi-url-adresi" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Yazar</label>
                      <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                        value={newBlogPost.author || ''} onChange={e => setNewBlogPost(p => ({ ...p, author: e.target.value }))} placeholder="Yazar adı..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Özet</label>
                    <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-[var(--color-primary)]/50 outline-none resize-none transition-all" rows={3}
                      value={newBlogPost.excerpt} onChange={e => setNewBlogPost(p => ({ ...p, excerpt: e.target.value }))} placeholder="Kısa özet metni..." />
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/[0.06]">
                    <input type="checkbox" id="publish-check" checked={newBlogPost.isPublished} onChange={e => setNewBlogPost(p => ({ ...p, isPublished: e.target.checked }))} className="w-4 h-4 rounded accent-[#c5a059]" />
                    <label htmlFor="publish-check" className="font-bold text-white text-sm flex-1 cursor-pointer">Hemen Yayınla</label>
                    {newBlogPost.isPublished && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg">YAYINDA</span>}
                  </div>
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
