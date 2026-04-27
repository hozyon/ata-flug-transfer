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
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1 text-slate-900">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2 text-slate-900">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black mt-6 mb-2 text-slate-900">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gold/40 pl-4 text-slate-500 italic my-3 bg-slate-50 py-2 rounded-r-lg">$1</blockquote>')
    .replace(/```([\s\S]*?)```/gm, '<pre class="bg-slate-900 rounded-xl p-4 text-xs text-emerald-400 my-4 overflow-x-auto shadow-inner">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-rose-500 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-700 italic">$1</em>')
    .replace(/~~(.+?)~~/g, '<del class="text-slate-400 line-through">$1</del>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-gold underline hover:text-amber-600 transition-colors" target="_blank">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-slate-600 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-slate-600 list-decimal">$1</li>')
    .replace(/(<li[\s\S]+?<\/li>)/g, '<ul class="my-3 space-y-1.5">$1</ul>')
    .replace(/^(?!<[h1-6|ul|ol|li|blockquote|pre|div])(.+)$/gm, '<p class="text-slate-600 leading-relaxed my-3">$1</p>')
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

  const LABEL_CLS = 'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1';
  const INPUT_CLS = 'w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:border-gold/40 focus:ring-4 focus:ring-gold/5 outline-none transition-all placeholder:text-slate-300';

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-rose-100/50"><i className="fa-solid fa-pen-nib text-rose-500 text-2xl"></i></div>
            <div><div className="flex items-center gap-2 mb-1.5"><h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Blog Yönetimi</h2><span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Makaleler</span></div><p className="text-[13px] text-slate-500 font-medium">Toplam <span className="text-slate-900 font-bold">{blogPosts.length}</span> içerik yönetiliyor</p></div>
        </div>
        <button onClick={openNew} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">Yeni Yazı Ekle</button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-5 items-center">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide w-full lg:w-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                {[{ id: 'published' as const, label: 'Yayında' }, { id: 'draft' as const, label: 'Taslaklar' }].map(tab => (
                    <button key={tab.id} onClick={() => setBlogTab(tab.id)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${blogTab === tab.id ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>{tab.label}</button>
                ))}
            </div>
            <div className="relative flex-1 w-full group">
                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-gold"></i>
                <input type="text" placeholder="Başlık veya kategori ara..." value={blogSearchTerm} onChange={e => setBlogSearchTerm(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] text-slate-900 font-bold focus:bg-white focus:border-gold/40 outline-none transition-all placeholder:text-slate-300" />
            </div>
            <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
        </div>
      </div>

      {currentPosts.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center shadow-sm"><EmptyState icon="fa-newspaper" title="Yazı bulunamadı" description="Kriterlere uygun içerik mevcut değil." /></div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentPosts.map(post => (
                <SwipeableCard key={post.id} actions={[{ icon: 'fa-pen', label: 'Düzenle', color: 'bg-blue-500', onClick: () => openEdit(post) }, { icon: 'fa-trash', label: 'Sil', color: 'bg-rose-500', onClick: () => handleDelete(post.id, post.title) }]}>
                    <div onClick={() => openEdit(post)} className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:border-gold/40 hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden shadow-sm">
                        <div className="aspect-[16/10] rounded-[1.8rem] overflow-hidden border border-slate-100 mb-5 bg-slate-50 shadow-inner"><img src={post.featuredImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} /></div>
                        <h3 className="font-black text-slate-900 text-[16px] group-hover:text-gold transition-colors line-clamp-2 mb-2 leading-snug">{post.title}</h3>
                        <p className="text-[12px] text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-5 border-t border-slate-50"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.category}</span><span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest border ${post.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{post.isPublished ? 'YAYINDA' : 'TASLAK'}</span></div>
                    </div>
                </SwipeableCard>
            ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead><tr className="bg-slate-50/50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Görsel / Başlık</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kategori</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                    {currentPosts.map(post => (
                        <tr key={post.id} onClick={() => openEdit(post)} className="group hover:bg-slate-50 transition-all duration-300 cursor-pointer">
                            <td className="px-8 py-5"><div className="flex items-center gap-4"><div className="w-16 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0"><img src={post.featuredImage} className="w-full h-full object-cover" alt={post.title} /></div><p className="text-[14px] font-bold text-slate-900 group-hover:text-gold transition-colors truncate max-w-md">{post.title}</p></div></td>
                            <td className="px-6 py-5 text-center"><span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200">{post.category}</span></td>
                            <td className="px-8 py-5 text-right" onClick={e => e.stopPropagation()}><div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"><button onClick={() => openEdit(post)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white flex items-center justify-center shadow-sm transition-all"><i className="fa-solid fa-pen text-xs"></i></button><button onClick={() => handleDelete(post.id, post.title)} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white flex items-center justify-center shadow-sm transition-all"><i className="fa-solid fa-trash-can text-xs"></i></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[210]">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[90vw] xl:max-w-7xl bg-white border-l border-slate-100 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm border border-rose-100"><i className="fa-solid fa-pen-nib text-lg"></i></div>
                <div><h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{editingBlogPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">İçerik & SEO Editörü</p></div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark text-lg"></i></button>
            </div>
            
            <div className="flex items-center gap-2 px-8 py-3 border-b border-slate-50 bg-slate-50/50 shrink-0 overflow-x-auto scrollbar-hide">
              {([
                { id: 'content' as const, label: 'İçerik', icon: 'fa-align-left' },
                { id: 'seo' as const, label: 'SEO & Meta', icon: 'fa-magnifying-glass-chart' },
                { id: 'ai' as const, label: 'AI Yazıcı', icon: 'fa-wand-magic-sparkles' },
                { id: 'settings' as const, label: 'Ayarlar', icon: 'fa-sliders' },
              ] as const).map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}><i className={`fa-solid ${t.icon} text-[10px]`}></i> {t.label}</button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto admin-scrollbar p-8 bg-slate-50/30">
              {activeTab === 'content' && (
                <div className="space-y-6 h-full flex flex-col">
                    <input className="w-full bg-transparent border-none text-4xl font-black text-slate-900 placeholder:text-slate-200 outline-none mb-4 focus:placeholder:text-slate-100 transition-all" value={newBlogPost.title} onChange={e => setNewBlogPost({ ...newBlogPost, title: e.target.value })} placeholder="Başlık girin..." />
                    <div className="flex-1 flex flex-col border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-slate-100/50">
                        <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                            <button onClick={() => textareaRef.current && insertAtCursor(textareaRef.current, '**', '**', 'kalın', v => setNewBlogPost({...newBlogPost, content: v}))} className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"><i className="fa-solid fa-bold text-xs"></i></button>
                            <button onClick={() => textareaRef.current && insertAtCursor(textareaRef.current, '*', '*', 'italik', v => setNewBlogPost({...newBlogPost, content: v}))} className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"><i className="fa-solid fa-italic text-xs"></i></button>
                            <button onClick={() => textareaRef.current && insertAtCursor(textareaRef.current, '### ', '', 'Başlık', v => setNewBlogPost({...newBlogPost, content: v}))} className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"><i className="fa-solid fa-heading text-xs"></i></button>
                        </div>
                        <div className="flex-1 flex divide-x divide-slate-50">
                            <textarea ref={textareaRef} className="flex-1 p-8 bg-transparent text-slate-700 font-bold leading-relaxed outline-none resize-none admin-scrollbar text-lg placeholder:text-slate-200" value={newBlogPost.content} onChange={e => setNewBlogPost({ ...newBlogPost, content: e.target.value })} placeholder="Hikayenizi anlatın (Markdown desteklenir)..." />
                            <div className="flex-1 p-8 bg-slate-50/50 overflow-y-auto admin-scrollbar prose prose-slate prose-lg max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-slate-600 prose-blockquote:bg-white prose-blockquote:border-gold/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-xl shadow-inner" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(newBlogPost.content)) }} />
                        </div>
                    </div>
                </div>
              )}
              {activeTab === 'seo' && (
                <div className="max-w-3xl mx-auto space-y-10 py-10">
                    <div className="space-y-4"><label className={LABEL_CLS}>Arama Motoru Başlığı (SEO Title)</label><input className={INPUT_CLS} value={newBlogPost.seoTitle || ''} onChange={e => setNewBlogPost({ ...newBlogPost, seoTitle: e.target.value })} placeholder="Tarayıcı sekmesinde görünecek başlık..." /></div>
                    <div className="space-y-4"><label className={LABEL_CLS}>Açıklama (Meta Description)</label><textarea className={`${INPUT_CLS} min-h-[160px] resize-none leading-relaxed`} value={newBlogPost.seoDescription || ''} onChange={e => setNewBlogPost({ ...newBlogPost, seoDescription: e.target.value })} placeholder="Arama sonuçlarında görünecek kısa özet..." /></div>
                </div>
              )}
              {activeTab === 'ai' && (
                <div className="max-w-3xl mx-auto py-20 text-center space-y-8 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-indigo-100/30">
                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 border border-indigo-100 shadow-lg shadow-indigo-100 flex items-center justify-center mx-auto text-indigo-500 text-4xl mb-6 animate-bounce duration-[3000ms]"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2">AI Makale Yazıcı</h4>
                    <p className="text-slate-500 font-medium max-w-md mx-auto mb-10">İçeriğinizin konusunu belirleyin, AI sizin için etkileyici bir makale taslağı oluştursun.</p>
                    <input className={`${INPUT_CLS} text-center text-lg py-5 border-indigo-100 focus:border-indigo-400 focus:ring-indigo-50`} value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="Hangi konuda yazalım?" />
                    <button onClick={handleGenerate} disabled={isGenerating || !aiApiKey} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase">{isGenerating ? 'YARATILIYOR...' : 'AI İLE İÇERİK ÜRET'}</button>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="max-w-3xl mx-auto space-y-10 py-10">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4"><label className={LABEL_CLS}>Kategori</label><select className={INPUT_CLS} value={newBlogPost.category} onChange={e => setNewBlogPost({ ...newBlogPost, category: e.target.value })}>{blogCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        <div className="space-y-4"><label className={LABEL_CLS}>URL Uzantısı (Slug)</label><input className={INPUT_CLS} value={newBlogPost.slug} onChange={e => setNewBlogPost({ ...newBlogPost, slug: e.target.value })} placeholder="yazi-basligi-buraya" /></div>
                    </div>
                    <div className="space-y-4"><label className={LABEL_CLS}>Kapak Görseli URL</label><input className={INPUT_CLS} value={newBlogPost.featuredImage} onChange={e => setNewBlogPost({ ...newBlogPost, featuredImage: e.target.value })} placeholder="https://..." /></div>
                </div>
              )}
            </div>
            <div className="p-8 border-t border-slate-50 flex justify-end gap-5 shrink-0 bg-white">
                <button onClick={() => setIsDrawerOpen(false)} className="px-10 py-4 text-slate-400 hover:text-slate-900 font-black text-xs tracking-widest transition-all">İPTAL ET</button>
                <button onClick={handleSave} className="px-16 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95">DEĞİŞİKLİKLERİ KAYDET</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
