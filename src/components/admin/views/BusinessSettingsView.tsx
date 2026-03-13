import React from 'react';
import { SiteContent } from '../../../types';

interface BusinessSettingsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
}

export const BusinessSettingsView: React.FC<BusinessSettingsViewProps> = ({ editContent, setEditContent }) => {
    const fields = [editContent.business.name, editContent.business.phone, editContent.business.email, editContent.business.address, editContent.business.whatsapp, editContent.business.telegram, editContent.business.instagram, editContent.business.facebook, editContent.business.mapEmbedUrl];
    const filled = fields.filter(v => v && v.trim().length > 0).length;
    const total = fields.length;
    const percent = Math.round((filled / total) * 100);

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Doldurulmuş', value: `${filled}/${total}`, icon: 'fa-circle-check', iconBg: percent === 100 ? 'bg-emerald-500' : 'bg-amber-500', gradient: percent === 100 ? 'from-emerald-500/15 to-green-600/5' : 'from-amber-500/15 to-orange-600/5', border: percent === 100 ? 'border-emerald-500/15' : 'border-amber-500/15' },
                    { label: 'Sosyal Medya', value: `${[editContent.business.whatsapp, editContent.business.telegram, editContent.business.instagram, editContent.business.facebook].filter(v => v?.trim()).length}/4`, icon: 'fa-share-nodes', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Harita', value: editContent.business.mapEmbedUrl?.trim() ? 'Aktif' : 'Pasif', icon: 'fa-map-location-dot', iconBg: editContent.business.mapEmbedUrl?.trim() ? 'bg-emerald-500' : 'bg-red-500', gradient: editContent.business.mapEmbedUrl?.trim() ? 'from-emerald-500/15 to-green-600/5' : 'from-red-500/15 to-rose-600/5', border: editContent.business.mapEmbedUrl?.trim() ? 'border-emerald-500/15' : 'border-red-500/15' },
                    { label: 'Logo', value: editContent.business.logo?.trim() ? '✓' : '—', icon: 'fa-image', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
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

            {/* Completion Bar */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-5 py-3.5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profil Tamamlanma</span>
                    <span className={`text-xs font-black ${percent === 100 ? 'text-emerald-400' : percent >= 70 ? 'text-amber-400' : 'text-red-400'}`}>{percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${percent === 100 ? 'bg-gradient-to-r from-emerald-500 to-green-500' : percent >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                        style={{ width: `${percent}%` }} />
                </div>
            </div>

            {/* Logo Section */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-700 border border-white/10 flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-image text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Site Logosu</h3>
                        <p className="text-[10px] text-slate-500">Şeffaf PNG önerilir</p>
                    </div>
                    <div className={`ml-auto w-2 h-2 rounded-full ${editContent.business.logo?.trim() ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
                </div>
                <div className="p-6 flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-16 h-16 rounded-xl bg-[#0f172a] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={editContent.business.logo || '/logo.png'} alt="Logo" className="max-w-[80%] max-h-[80%] object-contain" onError={e => (e.currentTarget.src = '/logo.png')} />
                    </div>
                    <div className="flex-1 w-full space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input type="file" accept="image/*" className="hidden" id="logo-upload" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setEditContent({ ...editContent, business: { ...editContent.business, logo: r.result as string } }); r.readAsDataURL(f); } }} />
                            <label htmlFor="logo-upload" className="px-4 py-2.5 bg-[#c5a059] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
                                <i className="fa-solid fa-cloud-arrow-up text-[10px]"></i> Yükle
                            </label>
                            <input className="flex-1 bg-white/5 border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#c5a059]/50 transition-all"
                                value={editContent.business.logo?.startsWith('data:') ? 'Yüklendi (Base64)' : editContent.business.logo || ''} onChange={e => setEditContent({ ...editContent, business: { ...editContent.business, logo: e.target.value } })} placeholder="URL yapıştırın..." />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Info Table */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#c5a059] flex items-center justify-center shadow-lg"><i className="fa-solid fa-building text-white text-sm"></i></div>
                    <h3 className="text-sm font-bold text-white">Ana Bilgiler</h3>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                                <th className="text-left px-5 py-3 w-40"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alan</span></th>
                                <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Değer</span></th>
                                <th className="w-16 px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { key: 'name' as const, label: 'İşletme Adı', icon: 'fa-signature', color: 'text-[#c5a059]', placeholder: 'İşletme adınızı girin', type: 'input' },
                                { key: 'phone' as const, label: 'Telefon', icon: 'fa-phone', color: 'text-green-400', placeholder: '+90 505 XXX XX XX', type: 'input' },
                                { key: 'email' as const, label: 'E-posta', icon: 'fa-envelope', color: 'text-blue-400', placeholder: 'info@example.com', type: 'input' },
                                { key: 'address' as const, label: 'Adres', icon: 'fa-location-dot', color: 'text-red-400', placeholder: 'İşletme adresini girin', type: 'textarea' },
                            ].map(field => (
                                <tr key={field.key} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <i className={`fa-solid ${field.icon} ${field.color} text-sm`}></i>
                                            <span className="text-[12px] font-bold text-white">{field.label}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3.5">
                                        {field.type === 'textarea' ? (
                                            <textarea className="w-full bg-transparent text-sm text-slate-300 outline-none focus:text-white resize-none placeholder-slate-600 transition-colors" rows={2}
                                                value={(editContent.business as any)[field.key] || ''} onChange={e => setEditContent({ ...editContent, business: { ...editContent.business, [field.key]: e.target.value } })} placeholder={field.placeholder} />
                                        ) : (
                                            <input className="w-full bg-transparent text-sm text-slate-300 outline-none focus:text-white placeholder-slate-600 transition-colors"
                                                value={(editContent.business as any)[field.key] || ''} onChange={e => setEditContent({ ...editContent, business: { ...editContent.business, [field.key]: e.target.value } })} placeholder={field.placeholder} />
                                        )}
                                    </td>
                                    <td className="px-3 py-3.5 text-center">
                                        <div className={`w-2 h-2 rounded-full mx-auto ${(editContent.business as any)[field.key]?.trim() ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Social Media Table */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg"><i className="fa-solid fa-share-nodes text-white text-sm"></i></div>
                    <h3 className="text-sm font-bold text-white">Sosyal Medya</h3>
                    <div className="ml-auto flex items-center gap-1">
                        {[editContent.business.whatsapp, editContent.business.telegram, editContent.business.instagram, editContent.business.facebook].map((v, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${v?.trim() ? 'bg-emerald-400' : 'bg-red-500/50'}`} />
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                                <th className="text-left px-5 py-3 w-40"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Platform</span></th>
                                <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bağlantı</span></th>
                                <th className="w-16 px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { key: 'whatsapp' as const, label: 'WhatsApp', icon: 'fa-whatsapp', color: 'text-green-400', placeholder: '905XXXXXXXXX', linkPrefix: 'https://wa.me/' },
                                { key: 'telegram' as const, label: 'Telegram', icon: 'fa-telegram', color: 'text-sky-400', placeholder: 'https://t.me/kullaniciadi' },
                                { key: 'instagram' as const, label: 'Instagram', icon: 'fa-instagram', color: 'text-pink-400', placeholder: 'https://instagram.com/kullaniciadi' },
                                { key: 'facebook' as const, label: 'Facebook', icon: 'fa-facebook', color: 'text-blue-400', placeholder: 'https://facebook.com/sayfaadi' },
                            ].map(social => (
                                <tr key={social.key} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <i className={`fa-brands ${social.icon} ${social.color} text-sm`}></i>
                                            <span className="text-[12px] font-bold text-white">{social.label}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3.5">
                                        <input className="w-full bg-transparent text-sm text-slate-300 outline-none focus:text-white placeholder-slate-600 transition-colors"
                                            value={(editContent.business as any)[social.key] || ''} onChange={e => setEditContent({ ...editContent, business: { ...editContent.business, [social.key]: e.target.value } })} placeholder={social.placeholder} />
                                    </td>
                                    <td className="px-3 py-3.5 text-center">
                                        <div className={`w-2 h-2 rounded-full mx-auto ${(editContent.business as any)[social.key]?.trim() ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Map */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg"><i className="fa-solid fa-map-location-dot text-white text-sm"></i></div>
                    <h3 className="text-sm font-bold text-white">Harita</h3>
                    <div className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${editContent.business.mapEmbedUrl?.trim() ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${editContent.business.mapEmbedUrl?.trim() ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className={`text-[10px] font-bold ${editContent.business.mapEmbedUrl?.trim() ? 'text-emerald-400' : 'text-red-400'}`}>{editContent.business.mapEmbedUrl?.trim() ? 'Aktif' : 'Pasif'}</span>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <i className="fa-solid fa-code text-[8px] text-cyan-400"></i> Embed URL
                        </label>
                        <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white font-mono placeholder-slate-600 outline-none focus:border-cyan-500/50 resize-none transition-all" rows={3}
                            value={editContent.business.mapEmbedUrl} onChange={e => setEditContent({ ...editContent, business: { ...editContent.business, mapEmbedUrl: e.target.value } })} placeholder="https://www.google.com/maps/embed?pb=..." />
                        <p className="text-[10px] text-slate-600"><i className="fa-solid fa-circle-info mr-1"></i> Google Maps → Paylaş → Yerleştir → <code className="text-[#c5a059]">src="..."</code> URL'sini yapıştırın.</p>
                    </div>
                    {editContent.business.mapEmbedUrl?.trim() && (
                        <div className="rounded-xl overflow-hidden border border-white/10 h-48">
                            <iframe src={editContent.business.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Harita"></iframe>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
