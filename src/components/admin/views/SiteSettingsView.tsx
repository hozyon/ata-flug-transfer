import React, { useRef } from 'react';
import { SiteContent } from '../../../types';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';

interface SiteSettingsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    _confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const SiteSettingsView: React.FC<SiteSettingsViewProps> = ({
    editContent, setEditContent, _confirmAction
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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-list-tree text-blue-400 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5"><h2 className="text-2xl font-[900] text-white tracking-tight">Menü Yönetimi</h2><span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Navigation</span></div>
                        <p className="text-[13px] text-slate-400 font-medium">Ana navigasyon yapısını ve alt menüleri yönetin</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { const n = [...editContent.navbar]; n.push({ label: 'Yeni Menü', url: '#', subMenus: [] }); setEditContent({ ...editContent, navbar: n }); }}
                        className="px-5 py-3 bg-[var(--color-primary)] text-[#06080F] rounded-2xl font-[900] text-[11px] uppercase tracking-widest transition-all">Menü Ekle</button>
                </div>
            </div>

            <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left">
                        <thead><tr className="bg-white/[0.02] border-b border-white/[0.04]"><th className="w-12 px-2 py-4"></th><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Menü Başlığı</th><th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Bağlantı</th><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th></tr></thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {editContent.navbar.map((item, index) => (
                                <tr key={index} {...getDragProps(index)} className={`group hover:bg-white/[0.03] transition-all cursor-grab active:cursor-grabbing ${getRowClassName(index)}`}>
                                    <td className="px-2 py-5 text-center"><i className="fa-solid fa-grip-vertical text-slate-800"></i></td>
                                    <td className="px-8 py-5"><input className="bg-transparent font-[800] text-white text-[14px] outline-none w-full" value={item.label} onChange={e => { const n = [...editContent.navbar]; n[index].label = e.target.value; setEditContent({ ...editContent, navbar: n }); }} /></td>
                                    <td className="px-6 py-5"><input className="bg-transparent font-mono text-[11px] text-slate-500 outline-none w-full" value={item.url} onChange={e => { const n = [...editContent.navbar]; n[index].url = e.target.value; setEditContent({ ...editContent, navbar: n }); }} /></td>
                                    <td className="px-8 py-5 text-right"><button onClick={() => { _confirmAction({ title: 'Sil', description: 'Emin misiniz?', type: 'danger', onConfirm: () => { const n = [...editContent.navbar]; n.splice(index, 1); setEditContent({ ...editContent, navbar: n }); } }); }} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"><i className="fa-solid fa-trash-can text-xs"></i></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] p-8 backdrop-blur-3xl">
                <h3 className="text-lg font-[800] text-white mb-6">Veri Yönetimi</h3>
                <div className="flex gap-4"><button onClick={exportBackup} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">JSON İndir</button><button onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Yedek Yükle</button></div>
                <input ref={fileInputRef} type="file" accept=".json" onChange={importBackup} className="hidden" />
            </div>
        </div>
    );
};
