import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { EmptyState } from '../EmptyState';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { useViewMode } from '../../../hooks/useViewMode';
import type { BlogPost } from '../../../types';

const BLOG_PER_PAGE = 10;
const AI_LS_KEY = 'site_ai_api_key';

interface BlogViewProps {
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => Promise<void>;
  blogTab: 'published' | 'draft';
  setBlogTab: (tab: 'published' | 'draft') => void;
  blogCategories: string[];
  blogSearchTerm: string;
  setBlogSearchTerm: (term: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'delete' | 'warning' | 'info') => void;
  confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1 text-white">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2 text-white">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black mt-6 mb-2 text-white">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-[var(--color-primary)] pl-4 text-slate-400 italic my-3">$1</blockquote>')
    .replace(/```([\s\S]*?)```/gm, '<pre class="bg-black/40 rounded-lg p-3 text-xs text-emerald-400 my-3 overflow-x-auto">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-black/30 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/~~(.+?)~~/g, '<del class="text-slate-500 line-through">$1</del>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[var(--color-primary)] underline hover:brightness-110" target="_blank">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-slate-300 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-slate-300 list-decimal">$1</li>')
    .replace(/(<li[\s\S]+?<\/li>)/g, '<ul class="my-2 space-y-1">$1</ul>')
    .replace(/^(?!<[h1-6|ul|ol|li|blockquote|pre|div])(.+)$/gm, '<p class="text-slate-300 leading-relaxed my-2">$1</p>')
    .replace(/\n\n/g, '')
    .trim();
}

function insertAtCursor(ta: HTMLTextAreaElement, prefix: string, suffix = '', placeholder = '', setter: (v: string) => void) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const text = ta.value;
  const selected = text.substring(start, end);
  const before = text.substring(0, start);
  const after = text.substring(end);
  const val = selected || placeholder;
  const next = before + prefix + val + suffix + after;
  setter(next);
  setTimeout(() => {
    ta.focus();
    ta.setSelectionRange(start + prefix.length, start + prefix.length + val.length);
  }, 0);
}

export const BlogView: React.FC<BlogViewProps> = ({
  blogPosts, setBlogPosts, blogTab, setBlogTab, blogCategories,
  blogSearchTerm, setBlogSearchTerm, showToast, confirmAction
}) => {
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'ai' | 'settings'>('content');
  const [newBlogPost, setNewBlogPost] = useState<BlogPost>({
    id: '', title: '', slug: '', excerpt: '', content: '',
    category: 'Destinasyon', featuredImage: '',
    isPublished: false, tags: [], author: 'Yönetici',
    seoTitle: '', seoDescription: '', viewCount: 0,
  });

  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const aiApiKey = typeof window !== 'undefined' ? localStorage.getItem(AI_LS_KEY) : '';

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { viewMode, toggleViewMode } = useViewMode();

  const filteredPosts = blogPosts
    .filter(p => blogTab === 'published' ? p.isPublished : !p.isPublished)
    .filter(p => !blogSearchTerm ||
      p.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(blogSearchTerm.toLowerCase())
    );

  const currentPosts = filteredPosts.slice(0, BLOG_PER_PAGE);

  const openNew = () => {
    setNewBlogPost({
        id: '', title: '', slug: '', excerpt: '', content: '',
        category: blogCategories[0] || 'Destinasyon',
        featuredImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
        isPublished: false, tags: [], author: 'Yönetici',
        seoTitle: '', seoDescription: '', viewCount: 0,
    });
    setEditingBlogPost(null);
    setActiveTab('content');
    setIsDrawerOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setNewBlogPost({ ...post });
    setEditingBlogPost(post);
    setActiveTab('content');
    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!newBlogPost.title.trim()) { showToast('Başlık zorunludur', 'warning'); return; }
    const now = new Date().toISOString();
    if (editingBlogPost) {
        await setBlogPosts(blogPosts.map(p => p.id === editingBlogPost.id ? { ...newBlogPost, updatedAt: now } : p));
        showToast('Blog yazısı güncellendi', 'success');
    } else {
        const created = { ...newBlogPost, id: crypto.randomUUID(), publishedAt: now, updatedAt: now };
        await setBlogPosts([...blogPosts, created]);
        showToast('Blog yazısı oluşturuldu', 'success');
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    confirmAction({
        title: 'Yazıyı Sil',
        description: `"${title}" başlıklı yazıyı kalıcı olarak silmek istediğinize emin misiniz?`,
        type: 'danger',
        onConfirm: () => {
            setBlogPosts(prev => Array.isArray(prev) ? prev.filter(p => p.id !== id) : []);
            showToast('Blog yazısı silindi', 'delete');
        }
    });
  };

  const handleGenerate = async () => {
    if (!aiApiKey) { showToast('API anahtarı bulunamadı', 'error'); return; }
    setIsGenerating(true);
    setTimeout(() => {
        setIsGenerating(false);
        showToast('AI içeriği üretildi (Demo)', 'success');
    }, 2000);
  };

  const LABEL_CLS = 'block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1';
  const INPUT_CLS = 'w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all';

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500/20 to-transparent border border-rose-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105"><i className="fa-solid fa-pen-nib text-rose-400 text-2xl"></i></div>
            <div><div className="flex items-center gap-2 mb-1.5"><h2 className="text-2xl font-[900] text-white tracking-tight">Blog Yönetimi</h2><span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Articles</span></div><p className="text-[13px] text-slate-400 font-medium">Toplam {blogPosts.length} içerik yönetiliyor</p></div>
        </div>
        <button onClick={openNew} className="px-6 py-3 bg-[var(--color-primary)] text-[#06080F] rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95">Yeni Yazı</button>
      </div>

      <div className="bg-[#020617]/30 border border-white/[0.04] rounded-[2.5rem] p-5 shadow-xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row gap-5 items-center">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                {[{ id: 'published' as const, label: 'Yayında' }, { id: 'draft' as const, label: 'Taslaklar' }].map(tab => (
                    <button key={tab.id} onClick={() => setBlogTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${blogTab === tab.id ? 'bg-[var(--color-primary)] text-[#06080F]' : 'bg-white/5 text-slate-500 hover:text-white'}`}>{tab.label}</button>
                ))}
            </div>
            <div className="relative flex-1 w-full group">
                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                <input type="text" placeholder="Başlık veya kategori ara..." value={blogSearchTerm} onChange={e => setBlogSearchTerm(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-[13px] text-white focus:border-[var(--color-primary)]/40 outline-none transition-all font-semibold" />
            </div>
            <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
        </div>
      </div>

      {currentPosts.length === 0 ? (
        <div className="bg-[#020617]/20 border border-white/[0.04] rounded-[2.5rem] p-20 text-center"><EmptyState icon="fa-newspaper" title="Yazı bulunamadı" description="Kriterlere uygun içerik mevcut değil." /></div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentPosts.map(post => (
                <SwipeableCard key={post.id} actions={[{ icon: 'fa-pen', label: 'Düzenle', color: 'bg-blue-500', onClick: () => openEdit(post) }, { icon: 'fa-trash', label: 'Sil', color: 'bg-rose-500', onClick: () => handleDelete(post.id, post.title) }]}>
                    <div onClick={() => openEdit(post)} className="group p-6 bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer relative overflow-hidden shadow-xl">
                        <div className="aspect-[16/10] rounded-[1.5rem] overflow-hidden border border-white/10 mb-5 bg-black/40"><img src={post.featuredImage} className="w-full h-full object-cover" alt={post.title} /></div>
                        <h3 className="font-[800] text-white text-[16px] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-2">{post.title}</h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-6">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-5 border-t border-white/[0.04]"><span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{post.category}</span><span className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest ${post.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>{post.isPublished ? 'YAYINDA' : 'TASLAK'}</span></div>
                    </div>
                </SwipeableCard>
            ))}
        </div>
      ) : (
        <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
                <thead><tr className="bg-white/[0.02] border-b border-white/[0.04]"><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Başlık</th><th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Kategori</th><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th></tr></thead>
                <tbody className="divide-y divide-white/[0.03]">
                    {currentPosts.map(post => (
                        <tr key={post.id} onClick={() => openEdit(post)} className="group hover:bg-white/[0.03] transition-all cursor-pointer">
                            <td className="px-8 py-5"><div className="flex items-center gap-4"><div className="w-14 h-10 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0"><img src={post.featuredImage} className="w-full h-full object-cover" alt={post.title} /></div><p className="text-[14px] font-[800] text-white group-hover:text-[var(--color-primary)] transition-colors truncate max-w-md">{post.title}</p></div></td>
                            <td className="px-6 py-5"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{post.category}</span></td>
                            <td className="px-8 py-5 text-right" onClick={e => e.stopPropagation()}><div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"><button onClick={() => openEdit(post)} className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-lg"><i className="fa-solid fa-pen text-xs"></i></button><button onClick={() => handleDelete(post.id, post.title)} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-lg"><i className="fa-solid fa-trash-can text-xs"></i></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[210]">
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[85vw] xl:max-w-6xl bg-[#06080F] border-l border-white/[0.08] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner"><i className="fa-solid fa-pen-nib text-lg"></i></div>
                <div><h3 className="text-lg font-[900] text-white tracking-tight">{editingBlogPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h3><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">İçerik & SEO Editörü</p></div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="flex items-center gap-2 px-8 py-3 border-b border-white/[0.03] shrink-0 overflow-x-auto scrollbar-hide">
              {([
                { id: 'content' as const, label: 'İçerik', icon: 'fa-align-left' },
                { id: 'seo' as const, label: 'SEO & Meta', icon: 'fa-magnifying-glass-chart' },
                { id: 'ai' as const, label: 'AI Yazıcı', icon: 'fa-wand-magic-sparkles' },
                { id: 'settings' as const, label: 'Ayarlar', icon: 'fa-sliders' },
              ] as const).map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-[var(--color-primary)] text-[#06080F]' : 'bg-white/5 text-slate-500 hover:text-white'}`}><i className={`fa-solid ${t.icon} text-[10px]`}></i> {t.label}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto admin-scrollbar p-8">
              {activeTab === 'content' && (
                <div className="space-y-6 h-full flex flex-col">
                    <input className="w-full bg-transparent border-none text-3xl font-black text-white placeholder-white/10 outline-none mb-4" value={newBlogPost.title} onChange={e => setNewBlogPost({ ...newBlogPost, title: e.target.value })} placeholder="Başlık girin..." />
                    <div className="flex-1 flex flex-col border border-white/[0.08] rounded-[2rem] overflow-hidden bg-white/[0.02]">
                        <div className="px-4 py-2 border-b border-white/[0.08] bg-white/[0.02] flex items-center gap-2 overflow-x-auto scrollbar-hide">
                            <button onClick={() => textareaRef.current && insertAtCursor(textareaRef.current, '**', '**', 'kalın', v => setNewBlogPost({...newBlogPost, content: v}))} className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-400"><i className="fa-solid fa-bold text-xs"></i></button>
                            <button onClick={() => textareaRef.current && insertAtCursor(textareaRef.current, '*', '*', 'italik', v => setNewBlogPost({...newBlogPost, content: v}))} className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-400"><i className="fa-solid fa-italic text-xs"></i></button>
                            <button onClick={() => textareaRef.current && insertAtCursor(textareaRef.current, '### ', '', 'Başlık', v => setNewBlogPost({...newBlogPost, content: v}))} className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-400"><i className="fa-solid fa-heading text-xs"></i></button>
                        </div>
                        <div className="flex-1 flex divide-x divide-white/[0.08]">
                            <textarea ref={textareaRef} className="flex-1 p-6 bg-transparent text-slate-300 font-medium leading-relaxed outline-none resize-none admin-scrollbar" value={newBlogPost.content} onChange={e => setNewBlogPost({ ...newBlogPost, content: e.target.value })} placeholder="İçeriğinizi buraya yazın (Markdown)..." />
                            <div className="flex-1 p-6 bg-black/20 overflow-y-auto admin-scrollbar prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(newBlogPost.content)) }} />
                        </div>
                    </div>
                </div>
              )}
              {activeTab === 'seo' && (
                <div className="max-w-2xl space-y-8">
                    <div className="space-y-4"><label className={LABEL_CLS}>SEO Başlığı</label><input className={INPUT_CLS} value={newBlogPost.seoTitle || ''} onChange={e => setNewBlogPost({ ...newBlogPost, seoTitle: e.target.value })} /></div>
                    <div className="space-y-4"><label className={LABEL_CLS}>SEO Açıklaması</label><textarea className={`${INPUT_CLS} min-h-[100px] resize-none`} value={newBlogPost.seoDescription || ''} onChange={e => setNewBlogPost({ ...newBlogPost, seoDescription: e.target.value })} /></div>
                </div>
              )}
              {activeTab === 'ai' && (
                <div className="max-w-2xl space-y-8 text-center p-8 bg-violet-600/5 rounded-[2rem] border border-violet-500/20">
                    <div className="w-16 h-16 rounded-3xl bg-violet-500 shadow-xl flex items-center justify-center mx-auto text-white text-2xl mb-4"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                    <h4 className="text-lg font-black text-white mb-4">AI İçerik Üretici</h4>
                    <input className={`${INPUT_CLS} !border-violet-500/30 mb-4`} value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="Konu başlığı girin..." />
                    <button onClick={handleGenerate} disabled={isGenerating || !aiApiKey} className="w-full py-4 bg-violet-500 text-white rounded-2xl font-black text-xs tracking-widest">{isGenerating ? 'Üretiliyor...' : 'AI İLE OLUŞTUR'}</button>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div><label className={LABEL_CLS}>Kategori</label><select className={INPUT_CLS} value={newBlogPost.category} onChange={e => setNewBlogPost({ ...newBlogPost, category: e.target.value })}>{blogCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        <div><label className={LABEL_CLS}>URL (Slug)</label><input className={INPUT_CLS} value={newBlogPost.slug} onChange={e => setNewBlogPost({ ...newBlogPost, slug: e.target.value })} /></div>
                    </div>
                    <div><label className={LABEL_CLS}>Görsel URL</label><input className={INPUT_CLS} value={newBlogPost.featuredImage} onChange={e => setNewBlogPost({ ...newBlogPost, featuredImage: e.target.value })} /></div>
                </div>
              )}
            </div>
            <div className="p-8 border-t border-white/[0.05] flex justify-end gap-4 shrink-0">
                <button onClick={() => setIsDrawerOpen(false)} className="px-8 py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-xs tracking-widest">İPTAL</button>
                <button onClick={handleSave} className="px-10 py-4 bg-[var(--color-primary)] text-[#06080F] rounded-2xl font-black text-xs tracking-widest shadow-xl uppercase">KAYDET</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
