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

// ── Minimal Markdown → HTML renderer ─────────────────────────────────────────
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1 text-white">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2 text-white">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black mt-6 mb-2 text-white">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-amber-500 pl-4 text-slate-400 italic my-3">$1</blockquote>')
    .replace(/^```([\s\S]*?)```$/gm, '<pre class="bg-black/40 rounded-lg p-3 text-xs text-emerald-400 my-3 overflow-x-auto">$1</pre>')
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

// ── Toolbar button helper ────────────────────────────────────────────────────
function insertAtCursor(
  ta: HTMLTextAreaElement,
  prefix: string,
  suffix = '',
  placeholder = '',
  setter: (v: string) => void
) {
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
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = newBlogPost.content.trim() ? newBlogPost.content.trim().split(/\s+/).length : 0;
  const charCount = newBlogPost.content.length;

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
    setIsDrawerOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setNewBlogPost({ ...post });
    setEditingBlogPost(post);
    setSlugManuallyEdited(true);
    setActiveTab('content');
    setShowPreview(false);
    setSplitView(false);
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
      if (e.key === 'Tab' && document.activeElement === ta) {
        e.preventDefault();
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
          <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-[#0d1117] shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/10 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg ${editingBlogPost ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  <i className={`fa-solid ${editingBlogPost ? 'fa-pen' : 'fa-plus'} text-sm`}></i>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white">{editingBlogPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h3>
                  <p className="text-[10px] text-slate-500">{wordCount} kelime · {charCount} karakter</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                { id: 'seo' as const, label: 'SEO', icon: 'fa-magnifying-glass' },
                { id: 'settings' as const, label: 'Ayarlar', icon: 'fa-sliders' },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                  <i className={`fa-solid ${t.icon} text-[9px]`}></i>{t.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'content' && (
                <div className={`h-full flex ${splitView ? 'flex-row' : 'flex-col'} overflow-hidden`}>
                  {/* Editor pane */}
                  {(!showPreview || splitView) && (
                    <div className={`flex flex-col ${splitView ? 'flex-1 border-r border-white/[0.08]' : 'flex-1'} overflow-hidden`}>

                      {/* Formatting Toolbar */}
                      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
                        {/* Text format */}
                        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
                          {tb('', 'fa-bold', 'Kalın (Ctrl+B)', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '**', '**', 'kalın', setContent); })}
                          {tb('', 'fa-italic', 'İtalik (Ctrl+I)', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '*', '*', 'italik', setContent); })}
                          {tb('', 'fa-strikethrough', 'Üstü çizili', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '~~', '~~', 'metin', setContent); })}
                          {tb('', 'fa-code', 'İnline kod', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '`', '`', 'kod', setContent); })}
                        </div>
                        {/* Headings */}
                        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
                          {tb('H1', '', 'Başlık 1', () => { if (textareaRef.current) insertLine(textareaRef.current, '# Başlık 1', setContent); })}
                          {tb('H2', '', 'Başlık 2', () => { if (textareaRef.current) insertLine(textareaRef.current, '## Başlık 2', setContent); })}
                          {tb('H3', '', 'Başlık 3', () => { if (textareaRef.current) insertLine(textareaRef.current, '### Başlık 3', setContent); })}
                        </div>
                        {/* Lists */}
                        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
                          {tb('', 'fa-list-ul', 'Liste', () => { if (textareaRef.current) insertLine(textareaRef.current, '- Liste öğesi', setContent); })}
                          {tb('', 'fa-list-ol', 'Numaralı liste', () => { if (textareaRef.current) insertLine(textareaRef.current, '1. Liste öğesi', setContent); })}
                        </div>
                        {/* Blocks */}
                        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
                          {tb('', 'fa-quote-left', 'Alıntı', () => { if (textareaRef.current) insertLine(textareaRef.current, '> Alıntı metni', setContent); })}
                          {tb('', 'fa-square-code', 'Kod bloğu', () => { if (textareaRef.current) insertLine(textareaRef.current, '```\nkod buraya\n```', setContent); })}
                        </div>
                        {/* Links */}
                        <div className="flex items-center gap-0.5">
                          {tb('', 'fa-link', 'Link (Ctrl+K)', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '[', '](https://)', 'link metni', setContent); })}
                          {tb('', 'fa-image', 'Resim', () => { if (textareaRef.current) insertAtCursor(textareaRef.current, '![', '](https://resim-url)', 'açıklama', setContent); })}
                        </div>
                        <div className="flex-1" />
                        <span className="text-[9px] text-slate-600 hidden sm:block">Ctrl+B · Ctrl+I · Ctrl+K · Ctrl+S</span>
                      </div>

                      {/* Textarea */}
                      <textarea
                        ref={textareaRef}
                        id="blog-content"
                        value={newBlogPost.content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Blog içeriğinizi buraya yazın...

# Ana Başlık
## Alt Başlık

**kalın** *italik* ~~üstü çizili~~

- liste öğesi
- başka öğe

> Alıntı metni burada

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
                      <div
                        className="prose-custom text-sm"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(newBlogPost.content) || '<p class="text-slate-700">İçerik girilmedi...</p>' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="p-6 space-y-4 overflow-y-auto h-full">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEO Başlığı</label>
                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                      value={newBlogPost.seoTitle || ''} onChange={e => setNewBlogPost(p => ({ ...p, seoTitle: e.target.value }))} placeholder="Arama motoru başlığı (60 karakter)..." />
                    <p className="text-[10px] text-slate-600">{(newBlogPost.seoTitle || '').length}/60 karakter</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta Açıklama</label>
                    <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-[var(--color-primary)]/50 outline-none resize-none transition-all" rows={3}
                      value={newBlogPost.seoDescription || ''} onChange={e => setNewBlogPost(p => ({ ...p, seoDescription: e.target.value }))} placeholder="Arama motorlarında görünen açıklama (160 karakter)..." />
                    <p className="text-[10px] text-slate-600">{(newBlogPost.seoDescription || '').length}/160 karakter</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Etiketler (virgülle ayırın)</label>
                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                      value={(newBlogPost.tags || []).join(', ')} onChange={e => setNewBlogPost(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="antalya transfer, vip, havalimanı..." />
                  </div>
                  {/* SERP Preview */}
                  <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Google Önizlemesi</p>
                    <p className="text-blue-400 text-sm font-medium truncate">{newBlogPost.seoTitle || newBlogPost.title || 'Sayfa Başlığı'}</p>
                    <p className="text-emerald-600 text-[11px] mt-0.5">ataflugtransfer.com/blog/{newBlogPost.slug || 'yazi-url'}</p>
                    <p className="text-slate-400 text-[12px] mt-1 leading-relaxed line-clamp-2">{newBlogPost.seoDescription || newBlogPost.excerpt || 'Meta açıklama burada görünecek...'}</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6 space-y-5 overflow-y-auto h-full">
                  {/* Cover image */}
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

                  {/* Title + Category + Slug */}
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

                  {/* Slug + Author */}
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

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Özet</label>
                    <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-[var(--color-primary)]/50 outline-none resize-none transition-all" rows={3}
                      value={newBlogPost.excerpt} onChange={e => setNewBlogPost(p => ({ ...p, excerpt: e.target.value }))} placeholder="Kısa özet metni..." />
                  </div>

                  {/* Publish */}
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
              <div className="text-[10px] text-slate-600 hidden sm:block">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">Ctrl+S</kbd> kaydet
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
