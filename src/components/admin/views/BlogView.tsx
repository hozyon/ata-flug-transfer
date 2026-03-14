import React, { useState, Dispatch, SetStateAction } from 'react';
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

export const BlogView: React.FC<BlogViewProps> = ({
  blogPosts, setBlogPosts, blogTab, setBlogTab, blogCategories, setBlogCategories,
  blogSearchTerm, setBlogSearchTerm, selectedBlogs, setSelectedBlogs, showToast
}) => {
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
  const [newBlogPost, setNewBlogPost] = useState<Partial<BlogPost>>({
    title: '', slug: '', excerpt: '', content: '', category: 'Destinasyon',
    featuredImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
    isPublished: false
  });
  const [showBlogPreview, setShowBlogPreview] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const currentPosts = blogPosts
    .filter(p => blogTab === 'published' ? p.isPublished : !p.isPublished)
    .filter(p => !blogSearchTerm || p.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) || p.excerpt.toLowerCase().includes(blogSearchTerm.toLowerCase()) || p.category.toLowerCase().includes(blogSearchTerm.toLowerCase()));

  const filteredIds = currentPosts.map(p => p.id);
  const allSelected = currentPosts.length > 0 && currentPosts.every(p => selectedBlogs.includes(p.id));

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
          {/* Tabs */}
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

          {/* Bulk Actions */}
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
            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
              <input type="text" placeholder="Yazı ara..." value={blogSearchTerm} onChange={e => setBlogSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all" />
              {blogSearchTerm && <button onClick={() => setBlogSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-xs"></i></button>}
            </div>
            {/* Add */}
            <button onClick={() => { setNewBlogPost({ title: '', slug: '', excerpt: '', content: '', category: blogCategories[0] || 'Havalimanı Transfer', featuredImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800', isPublished: false }); setEditingBlogPost(null); setIsAddBlogModalOpen(true); }}
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
                    <tr key={post.id} onClick={() => { setNewBlogPost(post); setEditingBlogPost(post); setIsAddBlogModalOpen(true); }}
                      className={`border-b border-white/[0.03] cursor-pointer transition-all group ${isSelected ? 'bg-[var(--color-primary)]/[0.06]' : 'hover:bg-white/[0.03]'}`}>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected}
                          onChange={e => { if (e.target.checked) setSelectedBlogs([...selectedBlogs, post.id]); else setSelectedBlogs(selectedBlogs.filter(id => id !== post.id)); }}
                          className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/20 shrink-0">
                            <img src={post.featuredImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
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
                        <span className="text-[11px] text-slate-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : '—'}</span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${post.isPublished ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-500/10 border-slate-500/20'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${post.isPublished ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                          <span className={`text-[10px] font-bold ${post.isPublished ? 'text-emerald-400' : 'text-slate-400'}`}>{post.isPublished ? 'Yayında' : 'Taslak'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          <button onClick={() => { setNewBlogPost(post); setEditingBlogPost(post); setIsAddBlogModalOpen(true); }}
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

      {/* Blog Drawer */}
      {isAddBlogModalOpen && (
        <div className="fixed inset-0 z-[210]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setIsAddBlogModalOpen(false); setShowBlogPreview(false); }} />
          <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/10 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${editingBlogPost ? 'bg-blue-500' : 'bg-emerald-500'} flex items-center justify-center text-white shadow-lg`}>
                  <i className={`fa-solid ${editingBlogPost ? 'fa-pen' : 'fa-plus'} text-sm`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{editingBlogPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h3>
                  <p className="text-[10px] text-slate-500">Tüm alanları doldurun</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowBlogPreview(!showBlogPreview)}
                  className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${showBlogPreview ? 'bg-[var(--color-primary)] text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  <i className={`fa-solid ${showBlogPreview ? 'fa-edit' : 'fa-eye'} text-[10px]`}></i>
                  {showBlogPreview ? 'Düzenle' : 'Önizle'}
                </button>
                <button onClick={() => { setIsAddBlogModalOpen(false); setShowBlogPreview(false); }}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain">
              {showBlogPreview ? (
                <div className="p-6">
                  <div className="rounded-2xl overflow-hidden mb-6 shadow-xl"><img src={newBlogPost.featuredImage} alt="Preview" className="w-full h-56 object-cover" /></div>
                  <span className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">{newBlogPost.category}</span>
                  <h1 className="text-2xl font-black mt-2 text-white">{newBlogPost.title || 'Başlık girilmedi...'}</h1>
                  <p className="mt-3 text-sm text-slate-300">{newBlogPost.excerpt || 'Özet girilmedi...'}</p>
                  <div className="mt-6"><p className="text-slate-300 text-sm" style={{ whiteSpace: 'pre-wrap' }}>{newBlogPost.content || 'İçerik girilmedi...'}</p></div>
                </div>
              ) : (
                <div className="p-6 space-y-5">
                  {/* Image */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2"><i className="fa-solid fa-image text-[8px] text-[var(--color-primary)]"></i> Kapak Görseli</label>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 group">
                      <img src={newBlogPost.featuredImage} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <input type="file" id="blog-image-upload" className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { if (f.size > 2 * 1024 * 1024) { alert('Maks 2MB!'); return; } const r = new FileReader(); r.onloadend = () => setNewBlogPost({ ...newBlogPost, featuredImage: r.result as string }); r.readAsDataURL(f); } }} />
                        <label htmlFor="blog-image-upload" className="bg-white text-slate-800 px-4 py-2 rounded-xl font-bold text-xs cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors"><i className="fa-solid fa-upload mr-2"></i>Görsel Yükle</label>
                      </div>
                    </div>
                    <input className="w-full mt-2 bg-white/5 border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[var(--color-primary)]/50 outline-none transition-all" value={newBlogPost.featuredImage} onChange={e => setNewBlogPost({ ...newBlogPost, featuredImage: e.target.value })} placeholder="veya URL girin..." />
                  </div>

                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-heading text-[8px] text-blue-400"></i> Başlık</label>
                      <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                        value={newBlogPost.title} onChange={e => setNewBlogPost({ ...newBlogPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} placeholder="Blog başlığı..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-folder text-[8px] text-violet-400"></i> Kategori</label>
                      <select className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                        value={newBlogPost.category} onChange={e => setNewBlogPost({ ...newBlogPost, category: e.target.value })}>
                        {blogCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Yeni kategori..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white focus:border-[var(--color-primary)]/50 outline-none placeholder-slate-600 transition-all" />
                        <button type="button" onClick={() => { if (newCategoryName.trim() && !blogCategories.includes(newCategoryName.trim())) { setBlogCategories([...blogCategories, newCategoryName.trim()]); setNewBlogPost({ ...newBlogPost, category: newCategoryName.trim() }); setNewCategoryName(''); } }}
                          className="px-3 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-amber-600 text-white text-xs font-bold transition-colors"><i className="fa-solid fa-plus"></i></button>
                      </div>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-align-left text-[8px] text-emerald-400"></i> Özet</label>
                    <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-[var(--color-primary)]/50 outline-none resize-none transition-all" rows={3}
                      value={newBlogPost.excerpt} onChange={e => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })} placeholder="Kısa özet metni..." />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-file-lines text-[8px] text-amber-400"></i> İçerik</label>
                    <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl border-b bg-slate-800 border-slate-600">
                      <div className="flex items-center gap-1 pr-2 border-r border-slate-500/30">
                        <button type="button" onClick={() => { const t = document.getElementById('blog-content') as HTMLTextAreaElement; if (t) { const s = t.selectionStart; const e = t.selectionEnd; const txt = t.value; const sel = txt.substring(s, e); setNewBlogPost({ ...newBlogPost, content: `${txt.substring(0, s)}**${sel || 'kalın metin'}**${txt.substring(e)}` }); } }} className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs hover:bg-slate-700 text-slate-300" title="Kalın">B</button>
                        <button type="button" onClick={() => { const t = document.getElementById('blog-content') as HTMLTextAreaElement; if (t) { const s = t.selectionStart; const e = t.selectionEnd; const txt = t.value; const sel = txt.substring(s, e); setNewBlogPost({ ...newBlogPost, content: `${txt.substring(0, s)}*${sel || 'italik'}*${txt.substring(e)}` }); } }} className="w-7 h-7 rounded-lg flex items-center justify-center italic text-xs hover:bg-slate-700 text-slate-300" title="İtalik">I</button>
                      </div>
                      <div className="flex items-center gap-1 pr-2 border-r border-slate-500/30">
                        <button type="button" onClick={() => { const t = document.getElementById('blog-content') as HTMLTextAreaElement; if (t) { const s = t.selectionStart; setNewBlogPost({ ...newBlogPost, content: `${t.value.substring(0, s)}\n## Başlık\n${t.value.substring(s)}` }); } }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold hover:bg-slate-700 text-slate-300">H2</button>
                        <button type="button" onClick={() => { const t = document.getElementById('blog-content') as HTMLTextAreaElement; if (t) { const s = t.selectionStart; setNewBlogPost({ ...newBlogPost, content: `${t.value.substring(0, s)}\n### Alt Başlık\n${t.value.substring(s)}` }); } }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold hover:bg-slate-700 text-slate-300">H3</button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => { const t = document.getElementById('blog-content') as HTMLTextAreaElement; if (t) { const s = t.selectionStart; setNewBlogPost({ ...newBlogPost, content: `${t.value.substring(0, s)}\n- Liste öğesi\n${t.value.substring(s)}` }); } }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-700 text-slate-300"><i className="fa-solid fa-list text-[10px]"></i></button>
                        <button type="button" onClick={() => { const url = prompt('URL:', 'https://'); const lt = prompt('Metin:', 'tıkla'); if (url && lt) { const t = document.getElementById('blog-content') as HTMLTextAreaElement; if (t) { const s = t.selectionStart; setNewBlogPost({ ...newBlogPost, content: `${t.value.substring(0, s)}[${lt}](${url})${t.value.substring(s)}` }); } } }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-700 text-slate-300"><i className="fa-solid fa-link text-[10px]"></i></button>
                      </div>
                      <div className="flex-1"></div>
                      <span className="text-[10px] text-slate-500"><i className="fa-solid fa-circle-info mr-1"></i>Markdown</span>
                    </div>
                    <textarea id="blog-content" className="w-full p-4 rounded-b-xl font-mono text-xs bg-white/5 text-white border border-white/[0.06] border-t-0 focus:border-[var(--color-primary)]/50 outline-none min-h-[200px] resize-y leading-relaxed"
                      value={newBlogPost.content} onChange={e => setNewBlogPost({ ...newBlogPost, content: e.target.value })} placeholder="Blog içeriğinizi buraya yazın..." />
                  </div>

                  {/* Publish Toggle */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/[0.06]">
                    <input type="checkbox" id="publish-check" checked={newBlogPost.isPublished} onChange={e => setNewBlogPost({ ...newBlogPost, isPublished: e.target.checked })} className="w-4 h-4 rounded accent-[#c5a059]" />
                    <label htmlFor="publish-check" className="font-bold text-white text-sm flex-1">Hemen Yayınla</label>
                    {newBlogPost.isPublished && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg">YAYINDA</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex gap-3 shrink-0 bg-white/[0.02]">
              <button onClick={() => {
                if (editingBlogPost) { setBlogPosts(blogPosts.map(p => p.id === editingBlogPost.id ? { ...p, ...newBlogPost } as BlogPost : p)); showToast('Güncellendi', 'success'); }
                else { setBlogPosts([...blogPosts, { ...newBlogPost, id: Date.now().toString(), publishedAt: new Date().toISOString() } as BlogPost]); showToast('Oluşturuldu', 'success'); }
                setIsAddBlogModalOpen(false); setShowBlogPreview(false);
              }}
                className="flex-1 bg-[var(--color-primary)] hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
                <i className="fa-solid fa-check"></i> {editingBlogPost ? 'Kaydet' : 'Oluştur'}
              </button>
              <button onClick={() => { setIsAddBlogModalOpen(false); setShowBlogPreview(false); }}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
