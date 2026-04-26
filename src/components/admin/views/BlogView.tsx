import React, { useState } from 'react';
import { EmptyState } from '../EmptyState';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { useViewMode } from '../../../hooks/useViewMode';
import type { BlogPost } from '../../../types';

const BLOG_PER_PAGE = 10;

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

export const BlogView: React.FC<BlogViewProps> = ({
  blogPosts, setBlogPosts, blogTab, setBlogTab, blogCategories,
  blogSearchTerm, setBlogSearchTerm,
  showToast, confirmAction
}) => {

  const [newBlogPost, setNewBlogPost] = useState<BlogPost>({
    id: '', title: '', slug: '', excerpt: '', content: '',
    category: 'Destinasyon', featuredImage: '',
    isPublished: false, tags: [], author: 'Yönetici',
    seoTitle: '', seoDescription: '', viewCount: 0,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const { viewMode, toggleViewMode } = useViewMode();

  const filteredPosts = blogPosts
    .filter(p => blogTab === 'published' ? p.isPublished : !p.isPublished)
    .filter(p => !blogSearchTerm ||
      p.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(blogSearchTerm.toLowerCase())
    );

  const blogPage = 1;
  const currentPosts = filteredPosts.slice((blogPage - 1) * BLOG_PER_PAGE, blogPage * BLOG_PER_PAGE);

  const openEdit = (post: BlogPost) => {
    setNewBlogPost({ ...post });
    setEditingBlogPost(post);
    setIsDrawerOpen(true);
  };

  const openNew = () => {
    setNewBlogPost({
        id: '', title: '', slug: '', excerpt: '', content: '',
        category: blogCategories[0] || 'Destinasyon',
        featuredImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
        isPublished: false, tags: [], author: 'Yönetici',
        seoTitle: '', seoDescription: '', viewCount: 0,
    });
    setEditingBlogPost(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    confirmAction({
        title: 'Yazıyı Sil',
        description: `"${title}" başlıklı yazıyı kalıcı olarak silmek istediğinize emin misiniz?`,
        type: 'danger',
        onConfirm: () => {
            setBlogPosts(prev => {
                const arr = Array.isArray(prev) ? prev : [];
                return arr.filter(p => p.id !== id);
            });
            showToast('Blog yazısı silindi', 'delete');
        }
    });
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

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
      {/* Header / Stats — Elite Style */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500/20 to-transparent border border-rose-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                <i className="fa-solid fa-pen-nib text-rose-400 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"></i>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <h2 className="text-2xl font-[900] text-white tracking-tight">Blog Yönetimi</h2>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Articles</span>
                </div>
                <p className="text-[13px] text-slate-400 font-medium">Toplam {blogPosts.length} içerik, {blogPosts.filter(p => p.isPublished).length} yayında</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
             <button onClick={openNew}
                className="px-5 py-3 bg-[var(--color-primary)] hover:bg-amber-600 text-[#06080F] rounded-2xl font-[900] text-[11px] uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2.5 active:scale-95">
                <i className="fa-solid fa-plus text-[10px]"></i> Yeni Yazı
            </button>
        </div>
      </div>

      {/* Toolbar — Filter & Search */}
      <div className="bg-[#020617]/30 border border-white/[0.04] rounded-[2.5rem] p-5 shadow-xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row gap-5 items-center">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                {[
                    { id: 'published' as const, label: 'Yayında', count: blogPosts.filter(p => p.isPublished).length },
                    { id: 'draft' as const, label: 'Taslaklar', count: blogPosts.filter(p => !p.isPublished).length },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setBlogTab(tab.id)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${blogTab === tab.id ? 'bg-[var(--color-primary)] text-[#06080F]' : 'bg-white/5 text-slate-500 hover:text-white'}`}>{tab.label} ({tab.count})</button>
                ))}
            </div>

            <div className="relative flex-1 w-full group">
                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs transition-colors group-focus-within:text-[var(--color-primary)]"></i>
                <input
                    type="text"
                    placeholder="Başlık veya kategori ile içerik ara..."
                    value={blogSearchTerm}
                    onChange={e => setBlogSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-[13px] text-white placeholder-slate-600 focus:border-[var(--color-primary)]/40 focus:bg-white/[0.04] outline-none transition-all font-semibold"
                />
            </div>
            <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
        </div>
      </div>

      {currentPosts.length === 0 ? (
        <div className="bg-[#020617]/20 border border-white/[0.04] rounded-[2.5rem] p-20">
            <EmptyState icon="fa-newspaper" title="Yazı bulunamadı" description="Kriterlere uygun blog yazısı mevcut değil." />
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentPosts.map(post => (
                <SwipeableCard key={post.id} actions={[
                    { icon: 'fa-pen', label: 'Düzenle', color: 'bg-blue-500', onClick: () => openEdit(post) },
                    { icon: 'fa-trash', label: 'Sil', color: 'bg-rose-500', onClick: () => handleDelete(post.id, post.title) },
                ]}>
                    <div onClick={() => openEdit(post)}
                        className="group p-6 bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] hover:border-[var(--color-primary)]/40 hover:bg-white/[0.03] transition-all duration-500 cursor-pointer relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="aspect-[16/10] rounded-[1.5rem] overflow-hidden border border-white/10 mb-5 relative bg-black/40">
                            {post.featuredImage && <img src={post.featuredImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />}
                            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">{post.category}</div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-[800] text-white text-[16px] group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-snug line-clamp-2">{post.title}</h3>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-500"><i className="fa-solid fa-user"></i></div>
                                <span className="text-[10px] font-bold text-slate-500">{post.author}</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded-md border text-[9px] font-black tracking-widest ${post.isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'}`}>
                                {post.isPublished ? 'YAYINDA' : 'TASLAK'}
                            </div>
                        </div>
                    </div>
                </SwipeableCard>
            ))}
        </div>
      ) : (
        <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                        <th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Kapak / Başlık</th>
                        <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Kategori</th>
                        <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-center">Tarih</th>
                        <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-center">Durum</th>
                        <th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                    {currentPosts.map(post => (
                        <tr key={post.id} onClick={() => openEdit(post)} className="group hover:bg-white/[0.03] transition-all duration-300 cursor-pointer">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-11 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0">
                                        {post.featuredImage && <img src={post.featuredImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[14px] font-[800] text-white group-hover:text-[var(--color-primary)] transition-colors duration-300 truncate max-w-[300px]">{post.title}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{post.slug}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-white/5 border border-white/10 text-slate-400 uppercase tracking-widest">{post.category}</span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className="text-[11px] font-black text-slate-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : '—'}</span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-[9px] font-[900] border tracking-widest ${post.isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${post.isPublished ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,1)]' : 'bg-slate-500'}`}></div>
                                    {post.isPublished ? 'YAYINDA' : 'TASLAK'}
                                </span>
                            </td>
                            <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    <button onClick={() => openEdit(post)} className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"><i className="fa-solid fa-pen text-xs"></i></button>
                                    <button onClick={() => handleDelete(post.id, post.title)} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"><i className="fa-solid fa-trash-can text-xs"></i></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[210]">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#06080F] border-l border-white/[0.08] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
                  <i className="fa-solid fa-pen-nib text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-[900] text-white tracking-tight">{editingBlogPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">İçerik Editörü</p>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <input className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-4 text-lg font-[800] text-white outline-none focus:border-[var(--color-primary)]/50 transition-all" value={newBlogPost.title} onChange={e => setNewBlogPost({...newBlogPost, title: e.target.value})} placeholder="Yazı Başlığı..." />
                <textarea className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-4 text-sm text-slate-300 outline-none focus:border-[var(--color-primary)]/50 transition-all min-h-[300px]" value={newBlogPost.content} onChange={e => setNewBlogPost({...newBlogPost, content: e.target.value})} placeholder="İçerik metni (Markdown)..." />
            </div>
            <div className="p-8 border-t border-white/[0.05] bg-white/[0.01] flex gap-4">
              <button onClick={handleSave} className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-amber-600 text-[#06080F] rounded-2xl font-black text-xs tracking-widest shadow-xl transition-all active:scale-95 uppercase">KAYDET</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
