import React, { useRef } from 'react';
import { SiteContent } from '../../../types';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';

interface SiteSettingsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    showToast?: (msg: string) => void;
    confirmAction?: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const SiteSettingsView: React.FC<SiteSettingsViewProps> = ({
    editContent, setEditContent, confirmAction
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportBackup = () => {
        const backup = { siteContent: editContent, exportedAt: new Date().toISOString(), version: 'v2' };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `site-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
    };

    const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result as string) as { siteContent?: SiteContent };
                if (data.siteContent) setEditContent(data.siteContent);
            } catch (err) { console.error('Import failed', err); }
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const { getDragProps, getRowClassName } = useDragAndDrop(editContent.navbar, (n) => setEditContent({ ...editContent, navbar: n }));

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-blue-100/50">
                        <i className="fa-solid fa-list-tree text-blue-600 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Menü Yönetimi</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Ana navigasyon yapısını ve alt menüleri yönetin</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { const n = [...editContent.navbar]; n.push({ label: 'Yeni Menü', url: '#', subMenus: [] }); setEditContent({ ...editContent, navbar: n }); }}
                        className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">Menü Ekle</button>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50/50 border-b border-slate-100"><th className="w-12 px-2 py-4"></th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Menü Başlığı</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bağlantı</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {editContent.navbar.map((item, index) => (
                                <tr key={index} {...getDragProps(index)} className={`group hover:bg-slate-50 transition-all cursor-grab active:cursor-grabbing ${getRowClassName(index)}`}>
                                    <td className="px-2 py-5 text-center"><i className="fa-solid fa-grip-vertical text-slate-200 group-hover:text-slate-400"></i></td>
                                    <td className="px-8 py-5"><input className="bg-transparent font-bold text-slate-900 text-[14px] outline-none w-full focus:text-gold" value={item.label} onChange={e => { const n = [...editContent.navbar]; n[index].label = e.target.value; setEditContent({ ...editContent, navbar: n }); }} /></td>
                                    <td className="px-6 py-5"><input className="bg-transparent font-mono text-[11px] text-slate-400 outline-none w-full focus:text-slate-900" value={item.url} onChange={e => { const n = [...editContent.navbar]; n[index].url = e.target.value; setEditContent({ ...editContent, navbar: n }); }} /></td>
                                    <td className="px-8 py-5 text-right"><button onClick={() => { if (confirmAction) { confirmAction({ title: 'Menü Sil', description: 'Bu menü kalemini silmek istediğinize emin misiniz?', type: 'danger', onConfirm: () => { const n = [...editContent.navbar]; n.splice(index, 1); setEditContent({ ...editContent, navbar: n }); } }); } }} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"><i className="fa-solid fa-trash-can text-xs"></i></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm font-black"><i className="fa-solid fa-database text-lg"></i></div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Veri Yönetimi</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">YEDEKLEME VE GERİ YÜKLEME</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={exportBackup} className="flex-1 py-4 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-sm">JSON İndir</button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 bg-slate-900 text-white hover:bg-black rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-200">Yedek Yükle</button>
                </div>
                <input ref={fileInputRef} type="file" accept=".json" onChange={importBackup} className="hidden" />
            </div>
        </div>
    );
};
