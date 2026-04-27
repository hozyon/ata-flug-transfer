import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { EmptyState } from '../EmptyState';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { useViewMode } from '../../../hooks/useViewMode';
import type { BlogPost } from '../../../types';

const _BLOG_PER_PAGE = 12;
const _AI_LS_KEY = 'site_ai_api_key';

interface BlogViewProps {
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => Promise<void>;
  blogTab: 'published' | 'draft';
  setBlogTab: (tab: 'published' | 'draft') => void;
  blogCategories: string[];
  blogSearchTerm: string;
  setBlogSearchTerm: (term: string) => void;
  showToast: (message: string, type?: string) => void;
  _confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-black mt-8 mb-2 text-slate-900 tracking-tight">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-black mt-10 mb-4 text-slate-900 tracking-tighter">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-black mt-12 mb-6 text-slate-900 tracking-tighter">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-[6px] border-gold/40 pl-6 text-slate-500 italic my-6 bg-slate-50/50 py-4 rounded-r-3xl">$1</blockquote>')
    .replace(/```([\s\S]*?)```/gm, '<pre class="bg-slate-900 rounded-[2rem] p-6 text-xs text-emerald-400 my-8 overflow-x-auto shadow-2xl">$1</pre>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 font-black">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-6 text-slate-600 list-disc py-1">$1</li>')
    .replace(/^(?!<[h1-6|ul|ol|li|blockquote|pre|div])(.+)$/gm, '<p class="text-slate-600 leading-[1.8] my-4 font-medium">$1</p>')
    .trim();
}

function _insertAtCursor(ta: HTMLTextAreaElement, prefix: string, suffix = '', placeholder = '', setter: (v: string) => void) {
  const start = ta.selectionStart; const end = ta.selectionEnd; const text = ta.value;
  const selected = text.substring(start, end); const before = text.substring(0, start); const after = text.substring(end);
  const val = selected || placeholder; const next = before + prefix + val + suffix + after;
  setter(next);
  setTimeout(() => { ta.focus(); ta.setSelectionRange(start + prefix.length, start + prefix.length + val.length); }, 0);
}

export const BlogView: React.FC<BlogViewProps> = ({
  blogPosts, setBlogPosts, blogTab, setBlogTab, blogCategories,
  blogSearchTerm, setBlogSearchTerm, showToast, _confirmAction
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

  const [_isGenerating, _setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { viewMode, toggleViewMode } = useViewMode();

  const filteredPosts = blogPosts
    .filter(p => blogTab === 'published' ? p.isPublished : !p.isPublished)
    .filter(p => !blogSearchTerm || p.title.toLowerCase().includes(blogSearchTerm.toLowerCase()));

  const openNew = () => {
    setNewBlogPost({ id: '', title: '', slug: '', excerpt: '', content: '', category: blogCategories[0] || 'Destinasyon', featuredImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800', isPublished: false, tags: [], author: 'Yönetici', seoTitle: '', seoDescription: '', viewCount: 0 });
    setEditingBlogPost(null); setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!newBlogPost.title.trim()) { showToast('Başlık zorunludur', 'warning'); return; }
    const now = new Date().toISOString();
    if (editingBlogPost) { await setBlogPosts(blogPosts.map(p => p.id === editingBlogPost.id ? { ...newBlogPost, updatedAt: now } : p)); }
    else { await setBlogPosts([...blogPosts, { ...newBlogPost, id: crypto.randomUUID(), publishedAt: now, updatedAt: now }]); }
    setIsDrawerOpen(false);
  };

  const INPUT_CLS = 'w-full bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] px-8 py-4 text-sm font-bold text-slate-900 placeholder-slate-300 focus:bg-white focus:shadow-xl transition-all duration-500 outline-none shadow-sm';
  const LABEL_CLS = 'block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 ml-2';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
      <div className="admin-glass-panel rounded-[3rem] p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 shadow-sm">
        <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm"><i className="fa-solid fa-pen-nib text-xl"></i></div>
            <div><h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Blog & Hikayeler</h2><p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-2">DİJİTAL YAYIN HATTI</p></div>
        </div>
        <button onClick={openNew} className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"><i className="fa-solid fa-plus text-[10px]"></i> Yeni Makale Yaz</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide p-1.5 bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] shadow-sm">
            {[{ id: 'published' as const, label: 'Yayında' }, { id: 'draft' as const, label: 'Taslaklar' }].map(tab => (
                <button key={tab.id} onClick={() => setBlogTab(tab.id)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${blogTab === tab.id ? 'bg-slate-900 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-900'}`}>{tab.label}</button>
            ))}
        </div>
        <div className="relative flex-1 w-full group">
            <i className="fa-solid fa-magnifying-glass absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 text-sm transition-colors group-focus-within:text-gold"></i>
            <input type="text" placeholder="Hikayelerde ara..." value={blogSearchTerm} onChange={e => setBlogSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] text-[15px] font-bold text-slate-900 placeholder-slate-300 shadow-sm focus:bg-white focus:shadow-xl transition-all duration-500 outline-none" />
        </div>
        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="admin-glass-panel rounded-[4rem] p-32 text-center shadow-sm"><EmptyState icon="fa-newspaper" title="Makale Bulunamadı" description="Yazmaya başlamak için yeni yazı butonunu kullanın." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
                <SwipeableCard key={post.id} actions={[{ icon: 'fa-pen', label: 'Düz.', color: 'bg-blue-500', onClick: () => { setNewBlogPost({...post}); setEditingBlogPost(post); setIsDrawerOpen(true); } }]}>
                    <div onClick={() => { setNewBlogPost({...post}); setEditingBlogPost(post); setIsDrawerOpen(true); }} className="admin-glass-panel rounded-[3.5rem] p-8 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-1000 cursor-pointer group animate-in fade-in slide-in-from-bottom-4 shadow-sm" style={{ animationDelay: `${idx * 80}ms` }}>
                        <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white bg-slate-50 mb-8 relative shadow-inner"><img src={post.featuredImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={post.title} /></div>
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-gold transition-colors tracking-tight leading-tight mb-4 line-clamp-2">{post.title}</h3>
                        <p className="text-[13px] text-slate-500 line-clamp-2 mb-8 font-medium leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/40"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.category}</span><span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${post.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{post.isPublished ? 'YAYINDA' : 'TASLAK'}</span></div>
                    </div>
                </SwipeableCard>
            ))}
        </div>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[210]">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-6 top-6 bottom-6 w-full max-w-7xl bg-white/80 backdrop-blur-3xl rounded-[4rem] border border-white shadow-2xl animate-in slide-in-from-right-8 duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] flex flex-col overflow-hidden">
            <div className="px-12 py-8 border-b border-white/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6"><div className="w-16 h-16 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 shadow-sm"><i className="fa-solid fa-pen-nib text-xl"></i></div><div><h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{editingBlogPost ? 'Makaleyi Düzenle' : 'Yeni Hikaye Oluştur'}</h3><p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">DİJİTAL YAYINCILIK EDİTÖRÜ</p></div></div>
              <button onClick={() => setIsDrawerOpen(false)} className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-all active:scale-90"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="flex items-center gap-2 px-12 py-4 bg-slate-50/50 shrink-0 overflow-x-auto scrollbar-hide">
              {[{id:'content' as const, label:'İçerik Editörü'}, {id:'seo' as const, label:'SEO & Meta'}, {id:'settings' as const, label:'Yayın Ayarları'}].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === t.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}>{t.label}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto admin-scrollbar p-12 space-y-10">
              {activeTab === 'content' && (
                <div className="space-y-10 h-full flex flex-col max-w-5xl mx-auto">
                    <input className="w-full bg-transparent border-none text-5xl font-black text-slate-900 placeholder:text-slate-200 outline-none tracking-tight leading-tight focus:placeholder:text-slate-100 transition-all" value={newBlogPost.title} onChange={e => setNewBlogPost({ ...newBlogPost, title: e.target.value })} placeholder="Buraya çarpıcı bir başlık yazın..." />
                    <div className="flex-1 flex flex-col admin-glass-panel rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <div className="flex-1 flex divide-x divide-white/40">
                            <textarea ref={textareaRef} className="flex-1 p-10 bg-white/20 text-slate-800 font-bold leading-[1.8] outline-none resize-none admin-scrollbar text-lg placeholder:text-slate-300" value={newBlogPost.content} onChange={e => setNewBlogPost({ ...newBlogPost, content: e.target.value })} placeholder="Anlatmaya başlayın (Markdown desteklenir)..." />
                            <div className="flex-1 p-10 bg-slate-50/30 overflow-y-auto admin-scrollbar prose prose-slate prose-xl max-w-none prose-headings:font-black prose-p:font-bold prose-p:text-slate-600" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(newBlogPost.content)) }} />
                        </div>
                    </div>
                </div>
              )}
              {activeTab === 'seo' && (
                <div className="max-w-4xl mx-auto space-y-10 py-10">
                    <div className="space-y-4"><label className={LABEL_CLS}>Arama Motoru Başlığı</label><input className={INPUT_CLS} value={newBlogPost.seoTitle || ''} onChange={e => setNewBlogPost({ ...newBlogPost, seoTitle: e.target.value })} placeholder="Tarayıcı sekmesinde görünecek başlık..." /></div>
                    <div className="space-y-4"><label className={LABEL_CLS}>Meta Açıklaması</label><textarea className={`${INPUT_CLS} min-h-[200px] resize-none leading-[1.8]`} value={newBlogPost.seoDescription || ''} onChange={e => setNewBlogPost({ ...newBlogPost, seoDescription: e.target.value })} placeholder="Arama sonuçlarında görünecek kısa özet..." /></div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-10 py-10">
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4"><label className={LABEL_CLS}>Kategori Seçimi</label><select className={INPUT_CLS} value={newBlogPost.category} onChange={e => setNewBlogPost({ ...newBlogPost, category: e.target.value })}>{blogCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        <div className="space-y-4"><label className={LABEL_CLS}>URL Uzantısı (Slug)</label><input className={INPUT_CLS} value={newBlogPost.slug} onChange={e => setNewBlogPost({ ...newBlogPost, slug: e.target.value })} placeholder="yazi-basligi-buraya" /></div>
                    </div>
                    <div className="space-y-4"><label className={LABEL_CLS}>Öne Çıkan Görsel URL</label><input className={INPUT_CLS} value={newBlogPost.featuredImage} onChange={e => setNewBlogPost({ ...newBlogPost, featuredImage: e.target.value })} placeholder="https://..." /></div>
                </div>
              )}
            </div>
            <div className="px-12 py-10 border-t border-white/40 flex justify-end gap-6 shrink-0 bg-white/20 backdrop-blur-md">
                <button onClick={() => setIsDrawerOpen(false)} className="px-10 py-5 text-slate-400 hover:text-slate-900 font-black text-[11px] uppercase tracking-widest transition-all">DEĞİŞİKLİKLERİ İPTAL ET</button>
                <button onClick={handleSave} className="px-20 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-95">MAKALEYİ KAYDET</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
